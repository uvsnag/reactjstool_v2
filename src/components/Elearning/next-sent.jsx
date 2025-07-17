import React, { useEffect, useState } from "react";
import { MdHearing } from 'react-icons/md';
import { FaMicrophone } from 'react-icons/fa';
import _ from 'lodash';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const currSentenceNm = 'current-sentence';
const orgTextNm = 'org-text';
const notetNm = 'note-of-text';
let commonArr = [];
const NextSentence = () => {

    const { transcript
        , resetTranscript
        , listening
        , browserSupportsSpeechRecognition
        , isMicrophoneAvailable
        , interimTranscript
        , finalTranscript } = useSpeechRecognition();

    const [currentSentence, setCurrentSentence] = useState('');
    const [orgText, setOrgText] = useState('');
    const [note, setNote] = useState('');

    const [isStartRecord, setIsStartRecord] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    useEffect(() => {
        setNote(transcript);
    }, [transcript]);
    useEffect(() => {
        if (!_.isEmpty(localStorage)) {
            setCurrentSentence(localStorage.getItem(currSentenceNm));
            setOrgText(localStorage.getItem(orgTextNm));
            setNote(localStorage.getItem(notetNm));
        }
        collapseSentence();
        if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
            alert("Browser does not support speech to text");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(currSentenceNm, currentSentence);
    }, [currentSentence]);

    useEffect(() => {
        localStorage.setItem(notetNm, note);
    }, [note]);

    useEffect(() => {
        localStorage.setItem(orgTextNm, orgText);
    }, [orgText]);



    const handleSubmitGemini = async (e) => {
        e.preventDefault();

        const res = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBy74O7Hyd9xqfmxHh4B5IoMTFB-rWEAEI",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }],
                        },
                    ],
                }),
            }
        );

        const data = await res.json();
        setResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || "No response");
    };

    function toggleCollapse(id) {
        const content = document.getElementById(id);
        content.classList.toggle('open'); // Add or remove the 'open' class
    }
    function collapseOrgText() {
        toggleCollapse("maincontent-nw")
    }
    function collapseSentence() {
        toggleCollapse("sentence")
    }
    function onProcess() {
        commonArr = orgText.match(/[^.!?]+[.!?]?/g).map(s => s.trim());
        if (commonArr && commonArr.length > 0) {
            setCurrentSentence(commonArr.shift())
            setOrgText(commonArr.join('\n'));
        }
    }
    const onCoppy = () => {
        let val = document.getElementById('note').value
        navigator.clipboard.writeText(val);
    };
    const startListening = () => {
        setIsStartRecord(true);
        console.log('Start recoding...');
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
        setTimeout(() => {
            console.log(transcript)
        }, 1000);
    }
    const stopListening = () => {
        setIsStartRecord(false);
        console.log('Stoped record');
        SpeechRecognition.stopListening();
    }
    const processRecord = () => {
        isStartRecord ? stopListening() : startListening()
    }
    return (
        <div>
            <div id="sentence" className='collapse-content'>
                <div>{currentSentence}</div>
            </div>
            <input type='submit' className="button-12 inline" value="Next" id='btnExecute' onClick={() => onProcess()} />
            <input type='submit' className="button-12 inline" value="Copy" id='btnCoppy' onClick={() => onCoppy()} />
            <input type='submit' className="button-12 inline" value="^^^" onClick={() => collapseSentence()} />
            <button className='button-12 inline' onClick={() => processRecord()}>
                {isStartRecord ? <MdHearing /> : <FaMicrophone />} </button>
            <br />
            <textarea id='note' className="width-93 height-2lines" value={note} onChange={(event) => {
                setNote(event.target.value);
            }}
            ></textarea>
            <div onClick={() => collapseOrgText()}>vvv</div>
            <div id="maincontent-nw" className='collapse-content'>
                <textarea id='sentence-text' value={orgText} onChange={(event) => {
                    setOrgText(event.target.value);
                }}
                ></textarea>
            </div>
                <div >Gemini Chat</div>
                <div className='collapse-content'>

                    <form onSubmit={handleSubmitGemini}>
                        <textarea
                            rows="4"
                            cols="50"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ask something..."
                        />
                        <br />
                        <button type="submit">Send</button>
                    </form>
                    <hr />
                    <div>
                        <strong>Response:</strong>
                        <p>{response}</p>
                    </div>
                </div>
            <div className=" height1000"></div>
        </div>
    )

};
export default NextSentence;