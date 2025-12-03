import { useEffect, useState, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { Configuration, OpenAIApi } from "openai-edge"
import { toggleCollapse, KEY_GPT_NM, KEY_GEMINI_NM, collapseElement } from '../../common/common.js';
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

const AIBoard = ({ index, prefix, enableHis, heightRes , isMini, statement, isShowPract, lastSentence}) => {
    const keyGeminiNm = `gemi-key-${prefix}${index}`;
    const keyChatGptNm = `gpt-key-${prefix}${index}`;
    const sysPromptNm = `sys-promt-${prefix}${index}`;
    let aiGem = useRef(null)
    let aiGemHis = useRef(null)
    let openai = useRef(null)

    const [gemKey, setGemKey] = useState(null);
    const [gptKey, setGptKey] = useState(null);
    const [aiName, setAIName] = useState('Gemini');
    const [model, setModel] = useState(MODEL_AI[0]);
    const [useHis, setUseHis] = useState(enableHis);

    const [prompt, setPrompt] = useState("");
    const [sysPrompt, setSysPrompt] = useState("");
    const [isUseAIMini, setIsUseAIMini] = useState(false);
    useEffect(() => {
        let gmLcal =  localStorage.getItem(keyGeminiNm);
        let gptLcal =  localStorage.getItem(keyChatGptNm);
        let locGem = gmLcal ? gmLcal: (localStorage.getItem(KEY_GEMINI_NM));
        let locgpt = gptLcal ? gptLcal: (localStorage.getItem(KEY_GPT_NM));
        let sysPromptVa = localStorage.getItem(sysPromptNm) ?? '';
        console.log(locGem)
        if(gmLcal){
            setGemKey(locGem);
        }
        if(gptLcal){
            setGptKey(locgpt);
        }
        setSysPrompt(sysPromptVa);
        toggleCollapse(`gemini-${prefix}${index}`)
        aiGem.current = new GoogleGenAI({ apiKey: locGem });
        openai.current = new OpenAIApi(new Configuration({ apiKey: locgpt }));
    }, []);

    useEffect(() => {
       onAskMini();
    }, [statement]);

    useEffect(() => {
        aiType = model.type;
        if (useHis) {
            aiGemHis.current = aiGem.current.chats.create({
                model: model.value,
            });
        }
    }, [useHis]);
    useEffect(() => {
        aiType = model.type;
        if (useHis) {
            aiGemHis.current = aiGem.current.chats.create({
                model: model.value,
            });
        }
    }, [model]);
    useEffect(() => {
        let key = gemKey ? gemKey:localStorage.getItem(KEY_GEMINI_NM)
        aiGem.current = new GoogleGenAI({ apiKey: key });
        localStorage.setItem(keyGeminiNm, gemKey);
        if (useHis) {
            aiGemHis.current = aiGem.current.chats.create({
                model: model.value,
            });
        }
        if(gemKey === null){
            setGemKey('')
        }

    }, [gemKey]);

    useEffect(() => {
        let key = gptKey ? gptKey: localStorage.getItem(KEY_GPT_NM)
        openai.current = new OpenAIApi(new Configuration({ apiKey: key }));
        localStorage.setItem(keyChatGptNm, gptKey);
         if(gptKey === null){
            setGptKey('')
        }

    }, [gptKey]);

    useEffect(() => {
        if (sysPrompt) {
            localStorage.setItem(sysPromptNm, sysPrompt);
        }
    }, [sysPrompt]);

    function onAskMini(isProcess=false, spSentence = null){
        let promp = spSentence ?? statement;
        let isUseMiniAI=  document.getElementById(`enable-ai-mini-${prefix}${index}`)?.checked;
        if (isMini && promp && isShowPract && (isUseMiniAI || isProcess)) {
            let isToggleMiniAI=  document.getElementById(`toggle-ai-mini-${prefix}${index}`)?.checked;
            askDec(promp)
            console.log('ask: ', promp)
            if(isToggleMiniAI){
                collapseElement(`gemini-${prefix}${index}`)
            }
        }
    }
    function reloadMini(){
       onAskMini(true)
       collapseElement(`gemini-${prefix}${index}`)
    }
    function specSentAIMini(spSentence){
       onAskMini(true, spSentence)
       collapseElement(`gemini-${prefix}${index}`)
    }

    async function askGemini(promVal) {
        const aiResponse = await aiGem.current.models.generateContent({
            model: model.value,
            contents: promVal,
            config: {
                systemInstruction: sysPrompt,
            },
        });
        return aiResponse.text;
    }

    async function askGeminiHis(promVal) {
        const aiResponse = await aiGemHis.current.sendMessage({
            message: promVal,
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
        setTimeout(() => {
            setPrompt('')
        }, 100);
        toggleClass(`loading${prefix}${index}`, false)
        // let responseTmp = response;
        addLog(formatMyQus(promVal) + '<br/>', true);
        if (aiType === TP_GPT) {
            responseTxt = await askChatGPT(promVal);
            setAIName('GPT')
        } else {
            setAIName('Gemini')
            responseTxt = useHis ? await askGeminiHis(promVal) : await askGemini(promVal);
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

    function addLog(message, isQuest) {
        let logElement = document.getElementById(`response-ai-${prefix}${index}`)
        const logEntry = document.createElement('div');
        logEntry.innerHTML = message;
        logElement.appendChild(logEntry);
        logElement.scrollTop = logElement.scrollHeight;
        if(isQuest){
        }else{
            setTimeout(() => {
                let extraHeight = logEntry.offsetHeight
                logElement.scrollBy({
                    top: (-Number(extraHeight) + Number(heightRes) - 40), // negative value scrolls up
                    // top: (-extraHeight + heightRes - 40), // negative value scrolls up
                    behavior: 'smooth' // optional for smooth scroll
                });
            }, 100);
        }
    }
    function clearLog() {
        let logElement = document.getElementById(`response-ai-${prefix}${index}`)
        logElement.innerHTML = '';
    }
    function handleKeyDown(e, promVal) {
        if (e.key === 'Enter' && e.shiftKey) {
            console.log('Shift + Enter detected');
        } else if (e.key === 'Enter') {
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
            <div onClick={() => toggleCollapse(`gemini-${prefix}${index}`)}>{`Instance ${index + 1}`} 
                 {isMini &&<label> <input  id= {`enable-ai-mini-${prefix}${index}`} type="checkbox" defaultChecked={false}/>Enable</label>}
                 {isMini && <label> <input  id= {`toggle-ai-mini-${prefix}${index}`} type="checkbox" defaultChecked={false}/>Toggle</label>}
                 {isMini && <input onClick={() => reloadMini()} type="submit" value="Curr"/>}
                 {isMini && <input onClick={() => specSentAIMini(lastSentence)} type="submit" value="Last"/>}
                 </div>
            <div className='collapse-content bolder' id={`gemini-${prefix}${index}`}>
                <img id={`loading${prefix}${index}`} className='collapse-content loading' src={loadingImg} />
                <div style={{ height: `${heightRes}px` }} id={`response-ai-${prefix}${index}`} className="response-ai">
                </div><br />
                <textarea id={`prompt-${prefix}${index}`} className='ai-promt'
                    rows="3"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="..."
                    onKeyDown={e => handleKeyDown(e, prompt)}
                />
                <br />

                <div onClick={() => toggleCollapse(`config-${prefix}${index}`)}>Config</div>
                <div className='collapse-content bolder' id={`config-${prefix}${index}`}>
                    <button onClick={() => askDec(prompt)} className="button-12 inline" >Send</button>
                <VoiceToText setText={setPrompt} index ={index}></VoiceToText>
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
                    <span>History</span>
                    <select value ={useHis} onChange={(e) => {
                        setUseHis(e.target.value)
                    }}>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                    <br/>
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
export default AIBoard;