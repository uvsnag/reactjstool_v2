import { useEffect, useState, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { Configuration, OpenAIApi } from "openai-edge"
import { toggleCollapse } from '../../common/common.js';
import VoiceToText from './VoiceToText.jsx';
import './style-common-module.css';
import loadingImg from './loading.webp';



const TP_GEN = 1;
const TP_GPT = 2;
let aiType = TP_GEN;
const MODEL_AI = [
    { value: "gemini-2.5-flash", name: "gemini-2.5-flash", type: TP_GEN },
    { value: "gpt-4o", name: "gpt-4o", type: TP_GPT },
]

const AICk = ({ index, prefix }) => {
    const keyGeminiNm = `gemi-key-${prefix}${index}`;
    const keyChatGptNm = `gpt-key-${prefix}${index}`;
    const sysPromptNm = `sys-promt-${prefix}${index}`;
    let aiGem = useRef(null)
    let openai = useRef(null)

    const [gemKey, setGemKey] = useState(null);
    const [gptKey, setGptKey] = useState(null);
    const [aiName, setAIName] = useState('Gemini');
    const [model, setModel] = useState(MODEL_AI[0]);

    const [prompt, setPrompt] = useState("");
    const [sysPrompt, setSysPrompt] = useState("");
    useEffect(() => {
        let locGem = localStorage.getItem(keyGeminiNm) ?? 'no-key';
        let locgpt = localStorage.getItem(keyChatGptNm) ?? 'no-key';
        let sysPromptVa = localStorage.getItem(sysPromptNm) ?? '';
        console.log(locGem)
        setGemKey(locGem);
        setGptKey(locgpt);
        setSysPrompt(sysPromptVa);
        toggleCollapse(`gemini-${prefix}${index}`)
        aiGem.current = new GoogleGenAI({ apiKey: locGem });
        openai.current = new OpenAIApi(new Configuration({ apiKey: locgpt }));
    }, []);

    useEffect(() => {
        aiType = model.type;
    }, [model]);
    useEffect(() => {
        if (gemKey) {
            aiGem.current = new GoogleGenAI({ apiKey: gemKey });
            localStorage.setItem(keyGeminiNm, gemKey);
        }

    }, [gemKey]);

    useEffect(() => {
        if (gptKey) {
            openai.current = new OpenAIApi(new Configuration({ apiKey: gptKey }));
            localStorage.setItem(keyChatGptNm, gptKey);
        }
    }, [gptKey]);

    useEffect(() => {
        if (sysPrompt) {
            localStorage.setItem(sysPromptNm, sysPrompt);
        }
    }, [sysPrompt]);



    async function askGemini(promVal) {
        const aiResponse = await aiGem.current.models.generateContent({
            model: model.value,
            contents: `${sysPrompt} ${promVal}`,
        });
        return aiResponse.text;
    }

    async function askChatGPT(promVal) {
        const completion = await openai.current.createChatCompletion({
            model: model.value,
            messages: [
                { role: "system", content: sysPrompt },
                { role: "user", content: promVal },
            ],
            temperature: 0,
            stream: true,
        })

        console.log(completion)
    }

    async function askDec(promVal) {
        if (!promVal || promVal.trim().length === 0) {
            return;
        }
        let responseTxt;
        setPrompt('')
        toggleClass(`loading${prefix}${index}`, false)
        // let responseTmp = response;
        addLog(formatMyQus(promVal) + '<br/>');
        if (aiType === TP_GPT) {
            responseTxt = await askChatGPT(promVal);
            setAIName('GPT')
        } else {
            setAIName('Gemini')
            responseTxt = await askGemini(promVal);
        }
        addLog(fomatRawResponse(responseTxt), false);
        toggleClass(`loading${prefix}${index}`, true)
    }
    function toggleClass(id, isHiding) {
        const content = document.getElementById(id);
        if(!isHiding){
            content.classList.add('open');
        } else{
            content.classList.remove('open');
        }
    }

    function addLog(message, isScroll = true) {
        let logElement = document.getElementById(`response-ai-${prefix}${index}`)
        const logEntry = document.createElement('div');
        logEntry.innerHTML = message;
        logElement.appendChild(logEntry);
        if(isScroll){
            logElement.scrollTop = logElement.scrollHeight;
        }
    }
    function clearLog() {
        let logElement = document.getElementById(`response-ai-${prefix}${index}`)
        logElement.innerHTML = '';
    }
    function handleKeyDown(e, promVal) {
        if (e.key === 'Enter') {
            askDec(promVal);
        }
    }

    function fomatRawResponse(input) {
        input = input.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>'); // ** -> <b>
        // input = input.replaceAll(`\n`, '<br/>'); 
        input = replaceNewlinesExceptInTags(input, ['pre'])
        input = input.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // ** -> <b>
        input = input.replaceAll(`<br/>* `, '<br/>➤');
        input = input.replaceAll(`<br/>### `, '<br/>⚙️');
        input = input.replaceAll(`<br/>## `, '<br/>📌');
        input = input.replace(/\*(.*?)\*/g, '<i>$1</i>');

        return input;
    }
    function replaceNewlinesExceptInTags(text, tagsToProtect = ['pre']) {
        const tagPattern = tagsToProtect.join('|');
        const regex = new RegExp(`<(${tagPattern})\\b[^>]*>[\\s\\S]*?<\\/\\1>`, 'gi');

        const protectedBlocks = [];
        const placeholder = '%%BLOCK_';
        let index = 0;

        // Extract and protect content inside the tags
        const protectedText = text.replace(regex, (match) => {
            const tagName = match.match(/^<(\w+)/i)[1];
            const openTag = match.match(new RegExp(`<${tagName}\\b[^>]*>`, 'i'))[0];
            const content = match.replace(openTag, '').replace(new RegExp(`<\\/${tagName}>$`, 'i'), '');
            const escapedContent = escapeHtml(content);
            protectedBlocks.push(`${openTag}${escapedContent}</${tagName}>`);
            return `${placeholder}${index++}%%`;
        });

        // Replace \n with <br/> in the rest of the text
        const withBreaks = protectedText.replace(/\n/g, '<br/>');

        // Restore the protected blocks
        const finalText = withBreaks.replace(new RegExp(`${placeholder}(\\d+)%%`, 'g'), (_, i) => protectedBlocks[i]);

        return finalText;
    }
    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')   // escape & first
            .replace(/</g, '&lt;')    // escape <
            .replace(/>/g, '&gt;')    // escape >
            .replace(/"/g, '&quot;')  // escape "
            .replace(/'/g, '&#39;');  // escape '
    }

    function formatMyQus(input) {
        return `<div class ='my-quest'>${input}</div>`
    }

    return (
        <div>
            <div onClick={() => toggleCollapse(`gemini-${prefix}${index}`)}>{`Instance ${index + 1}`}</div>
            <div className='collapse-content bolder' id={`gemini-${prefix}${index}`}>
                <img id={`loading${prefix}${index}`} className='collapse-content loading' src={loadingImg} />
                <div id={`response-ai-${prefix}${index}`} className="response-ai">
                </div><br />
                <textarea className='ai-promt'
                    rows="3"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask something..."
                    onKeyDown={e => handleKeyDown(e, prompt)}
                /><br />
                <button onClick={() => askDec(prompt)} className="button-12 inline" >Send</button>
                <VoiceToText setText={setPrompt}></VoiceToText>
                <button onClick={() => clearLog()} className="button-12 inline">Clear</button>
                <select onChange={(e) => {
                    setModel(e.target.value)
                }}>
                    {MODEL_AI.map((option, index) => (
                        <option key={option.value} value={option.value}>
                            {`${option.name}`}
                        </option>
                    ))}
                </select>

                <div onClick={() => toggleCollapse(`config-${prefix}${index}`)}>Config</div>
                <div className='collapse-content bolder' id={`config-${prefix}${index}`}>
                    <input type="text" value={gemKey} onChange={(event) => {
                        setGemKey(event.target.value);
                    }} placeholder="gem" />
                    <input type="text" value={gptKey} onChange={(event) => {
                        setGptKey(event.target.value);
                    }} placeholder="gpt" /><br />
                    <textarea className='ai-promt'
                        rows="3"
                        value={sysPrompt}
                        onChange={(e) => setSysPrompt(e.target.value)}
                        placeholder="Sys promt"
                    />

                </div>
            </div>
        </div>
    )

};
export default AICk;