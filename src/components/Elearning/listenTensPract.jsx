// this is a tools for studying english
import React, { useEffect, useState, useRef } from "react";
import '../../common/style.css';
import '../../common/styleTemplate.css';
import { FaEyeSlash } from 'react-icons/fa';
import { useSpeechSynthesis } from "react-speech-kit";
import { replaceArr, isEqualStr, getPosition } from "../../common/common.js";
import {
    validateArrStrCheck, arrStrCheckToStr,
    autoCorrectLetter, genHintStrAns, TYPE_WRONG, TYPE_CORRECT
} from "../Elearning/commonElearn";
import _ from 'lodash';

let arrSentence = []
let indexST = -1;
let sentence = "";
const ListenTensPract = () => {
    const onEnd = () => {
        // You could do something here after speaking has finished
    };
    const [voiceIndex, setVoiceIndex] = useState(0);
    const { speak, voices } = useSpeechSynthesis({
        onEnd,
    });
    const [rate, setRate] = useState(1);
    const [answer, setAnswer] = useState("");
    /* const [errorMs, setErrorMs] = useState(""); */
    const [lastAnsw, setLastAnsw] = useState('');
    const inputAns = useRef(null)

    useEffect(() => {
        document.getElementById('numbWord').value = 2
        document.getElementById('numWordBreak').value = 7
    }, []);
    useEffect(() => {
        voices.forEach((option, index) => {
            if (option.lang.includes("en-US")) {
                setVoiceIndex(index);
            }
        });
    }, [voices]);
    const onHideInput = (idName) => {
        var prac = document.getElementById(`${idName}`);
        if (prac.style.display === "block" || prac.style.display === "") {
            document.getElementById(`${idName}`).style.display = "none";
        } else {
            document.getElementById(`${idName}`).style.display = "block";
        }
    };

    const onStart = () => {
        let input = document.getElementById('inputTxt').value;
        let arrReg = [',', '?', '(', ')', '!', '—', '-', '=', '”', '“', '\n',
            ';']
        input = replaceArr(input, arrReg, '.')
        arrSentence = input.split('.')
        indexST = -1
        setAnswer('')
        changeSentence()
        document.getElementById(`inputTxt`).style.display = "none";
        inputAns.current.focus()
    };
    const isInteger = num => /^-?[0-9]+$/.test(num+'');
    const isTime =(str)=>{
        str =str.trim()
        let arr = str.split(':');
        if(arr.length === 2 && isInteger(arr[0]) && isInteger(arr[0])){
            return true
        }
        return false
    }

    const onStartCountW = () => {
        const removeTime = true
        let inputtxt = document.getElementById('inputTxt').value;
        let input = ''
        if(removeTime === true){
            let arrIn = inputtxt.split('\n');
            for (let i = 0; i < arrIn.length; i++) {
                if(!isTime(arrIn[i])){
                    input += `${arrIn[i]} `;
                }
                
            }
        }
        let arrReg = ['[',']',',', '?', '(', ')', '!', '—', '-', '.', '”', '“', '\n',
        ';', '  ']
        input = replaceArr(input, arrReg, ' ')
        const NUMOFWORD = document.getElementById('numWordBreak').value
        let input2 = ''
        let count = 0
        for (let j = 0; j < input.length; j++) {
            if (input[j] === ' ') {
                count++;
                if (count >= Number(NUMOFWORD)) {
                    input2 += '*'
                    count = 0
                    continue;
                }
            }
            input2 += input[j]

        }
        arrSentence = input2.split('*')
        console.log(arrSentence)
        indexST = -1
        setAnswer('')
        changeSentence()
        document.getElementById(`inputTxt`).style.display = "none";
        inputAns.current.focus()
    }
    const changeSentence = () => {
        if(_.isEmpty(arrSentence)){
            onStart()
            if(_.isEmpty(arrSentence)){
                return;
            }
        }
        indexST = getIndex(indexST);
        setLastAnsw(sentence)
        sentence = arrSentence[indexST].trim();
        sentence = sentence.replaceAll("  ", " ")
        speakAns();
    };

    const getIndex = (indexST) =>{
        indexST = indexST + 1;
        if (indexST >= arrSentence.length) {
            indexST = 0;
        }
        
        return _.isEmpty(arrSentence[indexST]) ? getIndex(indexST): indexST
    }

    const speakAns = () => {
        speakText(sentence)
    };
    const onCheck = () => {
        let ans = document.getElementById('answer').value;
        if (isEqualStr(sentence, ans, true)) {
            let arr = validateArrStrCheck(ans, sentence, 0)
            setAnswer(arrStrCheckToStr(arr))
            changeSentence()
            /* setErrorMs('correct!'); */
            document.getElementById('answer').value = "";
        } else {
            let arr0 = validateArrStrCheck(ans, sentence, 0)
            let arr1 = validateArrStrCheck(ans, sentence, 1)
            let arr2 = validateArrStrCheck(ans, sentence, 2)
            let arr = arr0
           if(getNumberCorrect(arr)<getNumberCorrect(arr1)){
              arr = arr1
           }
           if(getNumberCorrect(arr)<getNumberCorrect(arr2)){
              arr = arr2
           }
            setAnswer(arrStrCheckToStr(arr))
            /* setErrorMs('wrong!'); */
        }
    }

    const getNumberCorrect = (arr) => {
        let number = 0
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].type === TYPE_CORRECT) {
                number += 1
            }
        }
        return number;
    }
    const handleKeyDownInput = (e) => {
        if (e.nativeEvent.code === 'PageUp') {
            onHideInput('inputTxt')
            inputAns.current.focus()
        }
        if (e.nativeEvent.code === 'PageDown' ) {
            onHideInput('control')
            inputAns.current.focus()
        }
    }

    const handleKeyDown = (e) => {
        console.log(e.nativeEvent.code)
        if (e.key === 'Enter') {
            onCheck();
        }
        if (e.nativeEvent.code === 'ShiftLeft') {
            let arr = genHintStrAns('answer', sentence);
            setAnswer(arrStrCheckToStr(arr))
        }
        if (e.nativeEvent.code === 'ControlLeft') {
            let preAnsInput =  document.getElementById('answer').value
            autoCorrectLetter('answer', sentence);
            let afterAnsInput =  document.getElementById('answer').value
            if(_.isEqual(preAnsInput, afterAnsInput)&&(preAnsInput.length < sentence.length)){
                let len = preAnsInput.length
                preAnsInput = preAnsInput + sentence.substring(len, len+1)
                document.getElementById('answer').value = preAnsInput;
            }
        }
        if (e.nativeEvent.code === 'Insert') {
            speakAns();
        }
      
        if (e.nativeEvent.code === 'End') {
            changeSentence();
        }
        if (e.nativeEvent.code === 'Home') {
            onStart();
        }
        if (e.nativeEvent.code === 'PageUp') {
            onHideInput('inputTxt')
        }
        if (e.nativeEvent.code === 'PageDown' ) {
            onHideInput('control')
        }
        if (e.nativeEvent.code === 'ArrowDown') {
            speakText(lastAnsw);
        }
        if (e.nativeEvent.code === 'ShiftRight') {
            speakText(getNextSubAns());
        }
        if (e.nativeEvent.code === 'ControlRight' ) {
            speakI();
        }
    }
    const speakI =()=>{
        console.log('ds')
        let numOfWord = document.getElementById('numbWord').value
        let nextStr = getNextSubAns()
        let index = getPosition(nextStr, ' ', Number(numOfWord))
        if (index > 0) {
            speakText(nextStr.substring(0, index));
        } else {
            speakText(nextStr);
        }
    }
    const getNextSubAns =()=>{
        let ansInput =  document.getElementById('answer').value
        let indexFirstErr = 0;
        let arrStrCheck = validateArrStrCheck(ansInput, sentence, 0)
        for(let i=0; i< arrStrCheck.length; i++){
            if(_.isEqual(arrStrCheck[i].type, TYPE_WRONG)){
                indexFirstErr = i
                break;
            }
        }
        let strSpeak = sentence.substring(0, indexFirstErr)
        let index = strSpeak.lastIndexOf(" ")
        return sentence.substring(index, sentence.length);
    }

    const speakText = (speakStr) => {

        var vVoice = document.getElementById('voice').value;
        var vrate = document.getElementById('rate').value;
        var utterance = new window.SpeechSynthesisUtterance();
        utterance.text = speakStr;
        utterance.rate = vrate;
        utterance.voice = voices[vVoice];
        utterance.volume = 1;
        speak(utterance);
    }
    return (
        <div className='container-left listen-prac'>
            <div id="control">

                <textarea id='inputTxt' className='area-input' onKeyDown={e => handleKeyDownInput(e)}></textarea>
                <br />
                <button className='button-12 inline' id='hideBtn' onClick={() => onHideInput('inputTxt')} ><FaEyeSlash /></button>
                <span> </span>
                <button className='button-12 inline' id='Start' onClick={() => onStart()} >Start</button>
                <button className='button-12 inline'  onClick={() => onStartCountW()} >St2</button>
                <input id='numWordBreak' className='width-30'/>
                <span> </span>
                <select className='button-12 inline width-120 '
                    id="voice"
                    name="voice"
                    value={voiceIndex || ''}
                    onChange={(event) => {
                        setVoiceIndex(event.target.value);
                    }}
                >
                    <option value="" >Default</option>
                    {voices.map((option, index) => (
                        <option key={option.voiceURI} value={index}>
                            {`${option.lang} - ${option.name}`}
                        </option>
                    ))}
                </select>
                <input id='numbWord' className='width-30'/>
                <span> </span>
                <div className="mobile">
                    <button className='button-12 inline' onClick={() => onCheck()} >c</button>
                    <span> </span>
                    <button className='button-12 inline' onClick={() => speakI()} >ci</button>
                    <span> </span>
                    <button className='button-12 inline' onClick={() => speakText(getNextSubAns())} >ce</button>
                </div>
                <br />
                <input className="width-220 range-color"
                    type="range"
                    min="0.2"
                    max="1.5"
                    defaultValue="1"
                    step="0.1"
                    id="rate"
                    onChange={(event) => {
                        setRate(event.target.value);
                    }}
                />
                <span className="rate-value">{rate}</span>
               
                <div className="tooltip">?
                    <span className="tooltiptext">Enter :check
                        <br />ShiftLeft: hint 1 letter
                        <br />ControlLeft: correct 1 letter
                        <br />Insert: speak all
                        <br />ShiftRight: speak error word -{'>'} end
                        <br />ControlRight: speak error word -{'>'} i
                        <br />End: next question
                        <br />Home: start
                        <br />PageUp: hide txt input
                        <br />PageDown: hide all
                        <br />ArrowDown: speak last  </span>
                </div>
                <br />
            </div>
            <div className="">
                <div dangerouslySetInnerHTML={{ __html: answer }}></div>
                <br />
                <input type="text" id='answer' ref={inputAns} onKeyDown={e => handleKeyDown(e)} /><br />
            </div>
        </div>
    );
}

export default ListenTensPract;