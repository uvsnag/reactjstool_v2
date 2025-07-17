import { useEffect, useState, useRef } from "react";
import _ from 'lodash';
import { GoogleGenAI } from "@google/genai";
import { Configuration, OpenAIApi } from "openai-edge"
import { toggleCollapse } from '../../common/common.js';
import VoiceToText from './voice-to-text.jsx';
import './style-common-module.css';



const TP_GEN = 1;
const TP_GPT = 2;
let aiType = TP_GEN;
const AICk = ({index}) => {
    const keyGeminiNm = `gemi-key-${index}`;
    const keyChatGptNm = `gpt-key-${index}`;
    let aiGem = useRef(null)
    let openai = useRef(null)
    
    const [gemKey, setGemKey] = useState(null);
    const [gptKey, setGptKey] = useState(null);
    const [aiName, setAIName] = useState('Gemini');

    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    useEffect(() => {
        // if (!_.isEmpty(localStorage)) {
        let locGem = localStorage.getItem(keyGeminiNm) ?? 'no-key';
        let locgpt = localStorage.getItem(keyChatGptNm) ?? 'no-key';
            console.log(locGem)
            setGemKey(locGem);
            setGptKey(locgpt);
        // }
        toggleCollapse(`gemini-${index}`)
        aiGem.current  = new GoogleGenAI({ apiKey: locGem });
        openai.current  =  new OpenAIApi( new Configuration({ apiKey: locgpt }));
    }, []);

    useEffect(() => {
        if(gemKey){
            localStorage.setItem(keyGeminiNm, gemKey);
        }

    }, [gemKey]);

    useEffect(() => {
        if (gptKey) {
            localStorage.setItem(keyChatGptNm, gptKey);
        }
    }, [gptKey]);



    async function askGemini(promVal) {
        const aiResponse = await aiGem.current.models.generateContent({
            model: "gemini-2.5-flash",
            contents: promVal,
        });
        console.log(response.text);
        setResponse(response + aiResponse.text)

        addLog(aiResponse.text);
    }

    async function askChatGPT(promVal) {
        const completion = await openai.current.createChatCompletion({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: promVal },
            ],
            temperature: 0,
            stream: true,
        })

        console.log(completion)
    }

    function askDec(promVal) {
        addLog(promVal +'\n');
        if (aiType === TP_GPT) {
            askChatGPT(promVal);
            setAIName('GPT')
        }else{
            setAIName('Gemini')
            askGemini(promVal);
        }
        setPrompt('')
    }
    function addLog(val){
         document.getElementById(`response-ai-${index}`).textContent += val;
    }
    function clearLog(){
         document.getElementById(`response-ai-${index}`).textContent ='';
    }
    function handleKeyDown (e, promVal)  {
        if (e.key === 'Enter') {
            askDec(promVal);
        }
    }
    return (
        <div>
            <div onClick={() => toggleCollapse(`gemini-${index}`)}>{aiName}</div>
            <div className='collapse-content'  id={`gemini-${index}`}>
                <pre id={`response-ai-${index}`} className="response-ai">
                </pre><br />
                <textarea className ='ai-promt'
                    rows="3"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask something..."
                    onKeyDown={e => handleKeyDown(e, prompt)} 
                />
                <button onClick={() =>askDec(prompt)} className="button-12 inline" >Send</button>
                <VoiceToText setText={setPrompt}></VoiceToText>
                <button onClick={() =>clearLog()} className="button-12 inline">Clear</button>


            <div onClick={() => toggleCollapse(`config-${index}`)}>Config</div>
            <div className='collapse-content' id={`config-${index}`}>
                <input type="text" value={gemKey} onChange={(event) => {
                    setGemKey(event.target.value);
                }} placeholder="gem" />
                <input type="text" value={gptKey} onChange={(event) => {
                    setGptKey(event.target.value);
                }} placeholder="gpt" />

            </div>
            </div>
        </div>
    )

};
export default AICk;