/* eslint-disable react-hooks/exhaustive-deps */
// this is a tools for studying english
import React, { useEffect, useState } from "react";
import '../../common/style.css';
import '../../common/styleTemplate.css';
import _ from 'lodash';
import { gapi } from 'gapi-script';
import config from '../../common/config.js';
import { load } from './api/sheetDataRepository.js';
import PractWords from './practWords.jsx'
import { FaCircleNotch} from 'react-icons/fa';
import { useSpeechSynthesis } from "react-speech-kit";
import { FaVolumeUp } from 'react-icons/fa';
import { useCookies } from 'react-cookie'

const NotifyAuto = () => {
    const onEnd = () => {
        // You could do something here after speaking has finished
    };
    const { speak, voices } = useSpeechSynthesis({
        onEnd,
    });
    const [items, setItems] = useState([]);
    const [oderRandomS, setOderRandomS] = useState('random');
    const [isLoadQuestion, setIsLoadQuestion] = useState(false);

    const [voiceIndex, setVoiceIndex] = useState(0);
    const [voiceIndexVie, setVoiceIndexVie] = useState(0);
    const [rate, setRate] = useState(0.6);
    const [sheet, setSheet] = useState("");
    const [speakStrEng, setSpeakStrEng] = useState("");
    const [speakStrVie, setSpeakStrVie] = useState("");
    const [strContinue, setStrContinue] = useState("");
    const [lineSheet, setLineSheet] = useState([]);
    const [cookies, setCookie] = useCookies(['cookieContinue']);

    const [isStop, setIsStop] = useState(true);
    const [intervalId, setIntervalId] = useState(-1);
    const [countNotify, setCountNotify] = useState(0);

    const styleFlexRow = { display: 'flex', flexDirection: 'row' };
    const styleContainerRatePitch = {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 12,
    };
    const SPLIT_WORD = ':';
    const IND_SPEAK_NOTI_VOICE = 'noti-voice';
    const IND_SPEAK_NO_VOICE = 'no-voice';
    const IND_SPEAK_NO_NOTI = 'no-noti';
    const IND_SPEAK_NOTI_NO_VIE = 'noti-no-vie';
    const IND_SPEAK_NO_NOTI_NO_VIE = 'no-noti-no-vie';
    const IND_SPEAK_NO_NOTI_ENG = 'noti-eng-voice';
    const IND_SPEAK_ALL_ENG = 'all-eng';
    const IND_SPEAK_NOTI_ENG = 'noti-eng';

    const IND_VALUE_ON = 'On';
    const IND_VALUE_OFF = 'Off';

    /**  */
    useEffect(() => {
        document.getElementById('timeValue').value = '50';
        document.getElementById('pracWord').style.display = "none";
        document.getElementById('control').style.display = "block";
        document.getElementById('notify-control').style.display = "block";
        getDataFromExcel();
        // setLineSheet(getListLineField());
        if (!_.isEmpty(cookies)) {
            setStrContinue(cookies.cookieContinue);
        }
    }, []);
    useEffect(() => {
        voices.forEach((option, index) => {
            if (
                // option.name.includes("Vietnam")||
                option.lang.includes("vi-VN")) {
                setVoiceIndexVie(index);
            }
            if (
                // option.name.includes("English")||option.name.includes("United States")||
                option.lang.includes("en-US")) {
                setVoiceIndex(index);
            }
        });
    }, [voices]);

    useEffect(() => {
        console.log("useEffect [countNotify]");
        let valueTime = document.getElementById('timeValue').value;
        if (!isStop) {
            setIntervalId(setTimeout(() => {
                execute();
                setCountNotify(countNotify + 1);
            }, (valueTime * 1000)));
        }
    }, [countNotify]);

    useEffect(() => {
        getDataFromExcel();
        console.log("useEffect [sheet]");
    }, [sheet]);


    useEffect(() => {
        onGSheetApi();
        console.log("useEffect [items]");
    }, [items]);

    useEffect(() => {
        let expires = new Date()
        expires.setDate(expires.getDate() + 100);
        setCookie('cookieContinue', strContinue, { path: '/', expires })
        console.log('useEffect strContinue');
        console.log(strContinue);
        console.log(cookies);
    }, [strContinue]);

    /** */
    const getDataFromExcel = () => {
        gapi.load("client:auth2", initClient);

    }

    /** */
    const onGSheetApi = () => {
        var arrList = [];
        if (!_.isEmpty(items)) {
            var arrIndexNotNotify = _.isEmpty(strContinue) ? [] : strContinue.split(',').map(Number);
            if (!_.isEmpty(arrIndexNotNotify) && arrIndexNotNotify.length > 0) {
                arrIndexNotNotify.sort((a, b) => b - a);
                let listTemp = _.cloneDeep(items);
                arrIndexNotNotify.forEach(inx => {
                    listTemp.splice(inx, 1);
                });
                setLineSheet(listTemp);
            } else {
                setLineSheet(_.cloneDeep(items));
            }
            for (let i = 0; i < items.length; i++) {
                var item = items[i];
                var meaning = item.vi;
                if (!_.isEmpty(item.customDefine)) {
                    meaning = item.customDefine;
                }
                if (!_.isEmpty(item.eng) && item.eng.length > 0) {
                    if (_.isEmpty(meaning)) {
                        arrList.push(item.eng);
                    } else {
                        arrList.push(item.eng + ' ' + SPLIT_WORD + ' ' + meaning);
                    }
                }
            }
        }
        var strResult = '';
        for (let j = 0; j < arrList.length; j++) {
            if (!_.isEmpty(arrList[j])) {
                strResult += arrList[j];
                strResult += '\n';
            }

        }
        document.getElementById('txtField').value = strResult;
    }

    /** */
    const initClient = () => {
        //custom sheet
        var vsheet = sheet;
        gapi.client.init({
            apiKey: config.apiKey,
            clientId: config.clientId,
            discoveryDocs: config.discoveryDocs,
            scope: config.scope
        })
            .then(() => {
                load(onLoad, vsheet);
            })
    };

    /** */
    const onLoad = (data, error) => {
        if (data) {
            const result = data.items;
            let arr = [];

            result.forEach(item => {
                if (!_.isEmpty(item) && !_.isEmpty(item.eng)) {
                    arr.push(item);
                }
            });

            setItems(arr);
            console.log(arr);
        } else {
            console.log(error);
        }
    };

    /** */
    const execute = () => {
        console.log('onStart2');
        let line = null;

        let oderRandom = document.getElementById("slGenData").value;

        if (oderRandom === 'random') {
            let index = Math.floor(Math.random() * lineSheet.length);
            line = lineSheet[index];
            lineSheet.splice(index, 1);
        } else {
            line = lineSheet[0];
            lineSheet.shift();
        }
        console.log(strContinue);
        let indexOrg = items.findIndex(x => x.eng === line.eng);
        console.log('' + strContinue + (_.isEmpty(strContinue) ? indexOrg.toString() : ',' + indexOrg.toString()));
        const strC = (_.isEmpty(strContinue) ? indexOrg.toString() : String(strContinue) + ',' + indexOrg.toString())
        setStrContinue(strC);
        if (_.isEmpty(lineSheet)) {
            setLineSheet(_.cloneDeep(items));
            setStrContinue('');
        }

        onNotiExc(line);

    };

    /** */
    const onNotiExc = (line) => {
        console.log(line);
        if (!window.Notification) {
            console.log('Browser does not support notifications.');
        } else {
            // check if permission is already granted
            if (Notification.permission === 'granted') {
                // show notification here
                var isSpeak = document.getElementById('slIsUseVoice').value;
                if (!_.isEmpty(line)) {
                    var engStr = line.eng;
                    var viStr = line.vi;
                    if (!_.isEmpty(line.customDefine)) {
                        viStr = line.customDefine;
                    }
                    setSpeakStrEng(engStr);
                    setSpeakStrVie(viStr);

                    //because state is not synchronized, can't use state in this line(in loop)

                    if (_.isEqual(isSpeak, IND_SPEAK_NOTI_VOICE) || _.isEqual(isSpeak, IND_SPEAK_NO_NOTI)
                        || _.isEqual(isSpeak, IND_SPEAK_NOTI_NO_VIE) || _.isEqual(isSpeak, IND_SPEAK_NO_NOTI_NO_VIE)
                        || _.isEqual(isSpeak, IND_SPEAK_NO_NOTI_ENG) || _.isEqual(isSpeak, IND_SPEAK_ALL_ENG)) {

                        speakText(engStr, true);
                    }

                    if (_.isEqual(isSpeak, IND_SPEAK_NOTI_VOICE) || _.isEqual(isSpeak, IND_SPEAK_NO_NOTI)
                        || _.isEqual(isSpeak, IND_SPEAK_NO_NOTI_ENG)) {

                        speakText(viStr, false);
                    }
                    if (_.isEqual(isSpeak, IND_SPEAK_NO_NOTI_ENG) || _.isEqual(isSpeak, IND_SPEAK_ALL_ENG)
                        || _.isEqual(isSpeak, IND_SPEAK_NOTI_ENG)) {
                        var notification = new Notification(engStr);
                    }

                    if (_.isEqual(isSpeak, IND_SPEAK_NOTI_VOICE) || _.isEqual(isSpeak, IND_SPEAK_NO_VOICE)
                        || _.isEqual(isSpeak, IND_SPEAK_NOTI_NO_VIE)) {
                        let str = engStr + ":" + viStr;
                        // eslint-disable-next-line no-redeclare, no-unused-vars
                        var notification = new Notification(str);
                    }

                }
            } else {
                // request permission from user
                Notification.requestPermission().then(function (p) {
                    if (p === 'granted') {
                        // show notification here
                    } else {
                        console.log('User blocked notifications.');
                    }
                }).catch(function (err) {
                    console.error(err);
                });
            }
        }
    }

    /** */
    const onStop = () => {
        setIsStop(true);
        clearInterval(intervalId);
    };
    const onStart = () => {
        if (isStop) {
            setIsStop(false);
            execute();
            setCountNotify(countNotify + 1);
        }
    };

    /** */
    const onShowAll = () => {
        var prac = document.getElementById('control');
        if (prac.style.display === "block") {

            document.getElementById('control').style.display = "none";
        } else {
            document.getElementById('control').style.display = "block";

        }
    };

    /** */
    const onShowPract = () => {
        var prac = document.getElementById('pracWord');
        setIsLoadQuestion(true);

        if (prac.style.display === "block") {

            document.getElementById('pracWord').style.display = "none";
        } else {
            document.getElementById('pracWord').style.display = "block";
            onHideWhenPrac();
        }

    };

    /** */
    const onChangeOrder = (value) => {
        setOderRandomS(value);
    }

    /** */
    const onChangeIsUseVoice = (value) => {
        // setIsUseVoice(value);
        if (_.isEqual(value, IND_SPEAK_NO_VOICE)) {
            document.getElementById('sound-control').style.display = "none";
        } else {
            document.getElementById('sound-control').style.display = "block";
        }
    }

    /** */
    const onHideWhenPrac = () => {
        var prac = document.getElementById('notify-control');
        if (prac.style.display === "block") {
            document.getElementById('notify-control').style.display = "none";
        } else {
            document.getElementById('notify-control').style.display = "block";
        }
    };

    const speakText = (speakStr, isEng) => {

        var vVoice = document.getElementById('voice').value;
        var vVoiceVie = document.getElementById('voiceVie').value;
        var vrate = document.getElementById('rate').value;

        var utterance = new window.SpeechSynthesisUtterance();

        utterance.text = speakStr;
        // utterance.lang = 'en-US';
        utterance.rate = vrate;
        // utterance.pitch = pitch;
        if (isEng) {
            utterance.voice = voices[vVoice];
        } else {
            utterance.voice = voices[vVoiceVie];
        }
        utterance.volume = 1;
        speak(utterance);
    }
    const handleChangeCookie = e => {
        setStrContinue(e.target.value);
    };
    /** */
    return (
        <div>
            <div id='notify-control'>
                <div className='option-noti block' id='control'>
                    <div className='option-left'>
                        <textarea title='f' id='txtField'></textarea>
                        <br />
                    </div>
                    <div className='option-right notify-right'>
                        <select className='button-34' name="sheet" id="slsheet" onChange={(e) => {
                            setSheet(e.target.value)
                        }}>
                            <option value="Words1!A1:C500">Words1</option>
                            <option value="Words2!A1:C500">Words2</option>
                            <option value="Words3!A1:C500">Words3</option>
                            <option value="temp1!A1:C500">temp1</option>
                            <option value="temp2!A1:C500">temp2</option>
                            <option value="Sentence1!A1:C500">Sentence1</option>
                            <option value="Sentence2!A1:C500">Sentence2</option>
                            <option value="Sentence3!A1:C500">Sentence3</option>
                        </select>

                        <select className='button-33' name="genData" id="slGenData" onChange={(e) => {
                            onChangeOrder(e.target.value)
                        }}>
                            <option value="random">random</option>
                            <option value="order">order</option>
                        </select>
                        <select className='button-33' name="isUseVoice" id="slIsUseVoice" onChange={(e) => {
                            onChangeIsUseVoice(e.target.value)
                        }}>
                            <option value={IND_SPEAK_ALL_ENG}>Notify Eng - Voice Eng</option>
                            <option value={IND_SPEAK_NO_NOTI_ENG}>Notify Eng - Voice</option>
                            <option value={IND_SPEAK_NOTI_VOICE}>Notify - Voice</option>
                            <option value={IND_SPEAK_NO_VOICE}>Notify</option>
                            <option value={IND_SPEAK_NO_NOTI}>Voice</option>
                            <option value={IND_SPEAK_NOTI_NO_VIE}>notify - Voice Eng</option>
                            <option value={IND_SPEAK_NO_NOTI_NO_VIE}>Voice Eng</option>
                            <option value={IND_SPEAK_NOTI_ENG}>noti Eng</option>
                        </select>

                        <div id='sound-control'>
                            <div>Voice 1:</div>
                            <select className='button-33'
                                id="voice"
                                name="voice"
                                value={voiceIndex || ''}
                                onChange={(event) => {
                                    setVoiceIndex(event.target.value);
                                }}
                            >
                                <option value="">Default</option>
                                {voices.map((option, index) => (
                                    <option key={option.voiceURI} value={index}>
                                        {`${option.lang} - ${option.name}`}
                                    </option>
                                ))}
                            </select>
                            <div style={styleContainerRatePitch}>
                                <div style={styleFlexRow}>
                                    <label htmlFor="rate">Speed: </label>
                                    <div className="rate-value">{rate}</div>
                                </div>
                                <input
                                    type="range"
                                    min="0.2"
                                    max="2"
                                    defaultValue="0.6"
                                    step="0.1"
                                    id="rate"
                                    onChange={(event) => {
                                        setRate(event.target.value);
                                    }}
                                />
                            </div>
                            <div>Voice 2:</div>
                            <select className='button-33'
                                id="voiceVie"
                                name="voiceVie"
                                value={voiceIndexVie || ''}
                                onChange={(event) => {
                                    setVoiceIndexVie(event.target.value);
                                }}
                            >
                                <option value="">Default</option>
                                {voices.map((option, index) => (
                                    <option key={option.voiceURI} value={index}>
                                        {`${option.lang} - ${option.name}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                </div>
                <div className='control-footer'>
                    <input className='button-41' type='submit' value="Start" id='btnStart' onClick={() => onStart()} />
                    <button className='button-41' id='btnStop' onClick={() => onStop()} >Stop</button>
                    <input className='button-23' type="text" id='timeValue' />
                    <input className='button-33' type='submit' value="Show" id='btnShow' onClick={() => onShowAll()} />
                    <input className='button-33' type='submit' value="Practice" id='btnPract' onClick={() => onShowPract()} />
                    <input className='button-59' type="submit" id='isNotify' value={!isStop ? IND_VALUE_ON : IND_VALUE_OFF} /><br />
                </div>
                <textarea id="strContinue" value={strContinue} onChange={handleChangeCookie}></textarea>
            </div>
            {/* <FaStop/> */}
            {/* <button className='button-12 inline' onClick={() => getDataFromExcel()}><FaRedo/></button> */}
            <div id='pracWord'>
                <PractWords items={items} oderRandom={oderRandomS}
                    speakText={speakText}
                    isLoadQuestion={isLoadQuestion} 
                    getDataFromExcel = {getDataFromExcel}/>
            </div>
            <div> {speakStrEng}:  {speakStrVie}{_.isEmpty(speakStrEng) ? <div></div> : <FaVolumeUp className='iconSound' onClick={() => speakText(speakStrEng, true)} />}</div>
            <div id='btnHideWhenPrac' onClick={() => onHideWhenPrac()} ><FaCircleNotch /></div>
        </div>
    );

}

export default NotifyAuto;