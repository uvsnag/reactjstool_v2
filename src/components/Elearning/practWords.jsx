// this is a tools for studying english
import React, { useEffect, useState, useRef  } from "react";
import '../../common/style.css';
import _ from 'lodash';
import '../../common/styleTemplate.css';
import { FaVolumeUp, FaRedo, FaVolumeMute } from 'react-icons/fa';
import { validateArrStrCheck, arrStrCheckToStr} from "../Elearning/commonElearn";

let lastEngVar = ''
let arrLineTemp = [];
let isCheckedRevert = false;
const PractWords = (props) => {

    const MODE_NONE = 'None'
    const MODE_SPEAKE_CHANGE_QUST = 'Speak';

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [showAns, setShowAns] = useState('');
    const [lastEng, setLastEng] = useState('');
    const [lastVie, setLastVie] = useState('');
    const [mode, setMode] = useState(MODE_NONE);
    const [randomAns, setRandomAns] = useState([]);
    const inputAns = useRef(null)


    useEffect(() => {
        console.log("useEffect []");
        
    }, []);
    useEffect(() => {

        arrLineTemp = [];
        onChangeQuestion()
    }, [props.items]);

    useEffect(() => {
        if (props.isLoadQuestion) {
            onChangeQuestion();
        }

        inputAns.current.focus()
        // eslint-disable-next-line
    }, [props.isLoadQuestion]);
   

    const onChangeQuestion = () => {
        let randomAns = new Set();
        isCheckedRevert = document.getElementById("revertAsw").checked;
        
        if (!_.isEmpty(props.items)) {
            let item = null;
            let arrTemp = _.isEmpty(arrLineTemp) ? _.cloneDeep(props.items) : _.cloneDeep(arrLineTemp);
            let fullanswers = _.cloneDeep(props.items)
            if (props.oderRandom === 'random') {
                const validOptions = arrTemp.filter(item => item.eng !== lastEngVar);

                let index = Math.floor(Math.random() * validOptions.length);
                item = validOptions[index];
                arrTemp = arrTemp.filter(it => it.eng != item.eng)

            } else {
                item = arrTemp[0];
                arrTemp.shift();
            }
            // setArrLineTemp(arrTemp);
            arrLineTemp = arrTemp;
            console.log('arrTemp:', arrTemp)
            console.log('item:', item)
            let quest = '';
            if (_.isEmpty(item.customDefine)) {
                // setQuestion(item.vi);
                quest = item.vi;
            } else {
                quest = item.customDefine;
                // setQuestion(item.customDefine);
            }
            if(isCheckedRevert){
                setAnswer(quest);
                setQuestion(item.eng);
                randomAns.add(quest);
            }else{
                setAnswer(item.eng);
                setQuestion(quest);
                randomAns.add(item.eng);
            }
            setShowAns("");
            let numAnsw = Number(document.getElementById('num-of-ans').value);
            numAnsw = numAnsw > fullanswers.length ? fullanswers.length : numAnsw;
            while (randomAns.size < numAnsw) {
                let randId = Math.floor(Math.random() * fullanswers.length);
                if (isCheckedRevert) {
                    quest = '';
                    if (_.isEmpty(fullanswers[randId].customDefine)) {
                        quest = fullanswers[randId].vi;
                    } else {
                        quest = fullanswers[randId].customDefine;
                    }
                    randomAns.add(quest);
                } else {
                    randomAns.add(fullanswers[randId].eng);
                }
            }
        }
        setRandomAns([...randomAns].sort());
    };
    const onCheck = () => {
        // const isChecked = document.getElementById("revertAsw").checked;
        var ans = document.getElementById('answer').value;
        if(_.isEmpty(ans)){
            ans = document.getElementById('combo-answer').value
        }
        if (!_.isNull(ans) && !_.isNull(answer)) {
            var answ = answer.replaceAll('.', '');
            if (ans.trim().toUpperCase() === answ.toUpperCase().trim()) {
                /* setErrorMs('correct!'); */
                document.getElementById('answer').value = "";
                if (isCheckedRevert) {
                    lastEngVar = question;
                     setLastEng(question);
                     setLastVie(answer);
                     
                }else{
                    lastEngVar = answer;
                    setLastEng(answer);
                    setLastVie(question);
                }
                if(mode === MODE_SPEAKE_CHANGE_QUST){
                    if(isCheckedRevert){
                        props.speakText(question, true);
                    }else{
                        props.speakText(answer, true);
                    }
                }
                onChangeQuestion();
            } else {
                let arr = validateArrStrCheck(ans, answer, 0)
                setShowAns(arrStrCheckToStr(arr))
                /* setErrorMs('wrong!'); */
            }
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onCheck();
        }
        if (e.nativeEvent.code === 'ShiftLeft') {
            onShow();
        }
        if (e.nativeEvent.code === 'ShiftRight') {
            props.speakText(lastEng, true);
        }
        if (e.nativeEvent.code === 'ControlLeft') {
            props.speakText(answer, true);
        }
        if (e.nativeEvent.code === 'ControlRight') {
            setMode(mode===MODE_NONE?MODE_SPEAKE_CHANGE_QUST:MODE_NONE);
        }
        if (e.nativeEvent.code === 'End') {
            onChangeQuestion();
        }
        if (e.nativeEvent.code === 'Home') {
            props.getDataFromExcel();
        }
    }
    const onShow = () => {
        if (_.isEmpty(showAns)) {
            setShowAns(answer);
        } else {
            setShowAns("");
        }
        
    }

    return (
        <div className='prac'>
           
            <div>{_.isEmpty(lastEng) ? <div></div> : <i> {lastEng} : {lastVie}<FaVolumeUp className='iconSound' onClick={() => props.speakText(lastEng, true)} />  </i>}
             </div>
             <select className='button-33 inline ' name="sheet" id="slsheet" onChange={(e) => {
                            props.setSheet(e.target.value)
                        }}>
                            {props.SHEET_NAME.map((option, index) => (
                                <option key={option.range} value={option.range}>
                                    {`${option.name}`}
                                </option>
                            ))}
                        </select>
            <input type="number" className='width-30'id='num-of-ans' defaultValue={3}  />
            <label><input id = 'revertAsw' type="checkbox" defaultChecked={false}/>⇆</label>
           
            <input className='button-12 inline' type='submit' value="Show Ans" id='btnShowAns' onClick={() => onShow()} />
            <button className='button-12 inline' onClick={() => setMode(mode === MODE_NONE ? MODE_SPEAKE_CHANGE_QUST : MODE_NONE)}>{mode === MODE_NONE ? <FaVolumeMute /> : <FaVolumeUp />}</button>
            <button className='button-12 inline' onClick={() => props.getDataFromExcel()}><FaRedo /></button>
             
            <br />
            <div>{question}</div><br />
            {/* <div>{showAns}{_.isEmpty(showAns) ? <div></div> : <FaVolumeUp className='iconSound' onClick={() => props.speakText(showAns, true)} />}</div> */}
            <div className="" dangerouslySetInnerHTML={{__html: showAns}}></div>
            <input type="text" id='answer' ref={inputAns} onKeyDown={e => handleKeyDown(e)} /><br />
            <select className='button-33'
                id="combo-answer"
                name="combo-ans"
                onChange={(event) => {
                    onCheck();
                }}
            >
                <option value=""></option>
                {randomAns.map((ans, index) => (
                    <option key={ans} value={ans}>
                        {`${ans}`}
                    </option>
                ))}
            </select>
           {/*  <div className='msg'>{errorMs === 'wrong!' ? <FaRegFrown /> : <FaRegSmile />}</div> */}
           
           <input className='button-12 inline' type='submit' value="Check" id='btnSubmit' onClick={() => onCheck()} />
            
            <br/>
            {/* <div >
                
            </div> */}
        </div>
    );
}

export default PractWords;