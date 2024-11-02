// this is a tools for studying english
import React, { useEffect, useState } from "react";
import '../../common/style.css';
import _ from 'lodash';
import '../../common/styleTemplate.css';
import { FaRegFrown, FaRegSmile, FaVolumeUp } from 'react-icons/fa';
import { gapi } from 'gapi-script';
import config from '../../common/config.js';
import { loadListenSheet } from './api/sheetDataRepository.js';
import { useSpeechSynthesis } from "react-speech-kit";
const ListenPract = () => {
    const styleFlexRow = { display: 'flex', flexDirection: 'row' };
    const styleContainerRatePitch = {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 12,
    };
    const ALL_WORDS = "-1";
    const sheet = config.listen.sheetDefault;

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [errorMs, setErrorMs] = useState("");
    const [showAns, setShowAns] = useState('');

    const [items, setItems] = useState([]);
    const [classItems, setClassItems] = useState([]);
   // const [sheet, setSheet] = useState(config.listen.sheetDefault);
    const [voiceIndex, setVoiceIndex] = useState(0);
    const [indexClass, setIndexClass] = useState();
    const [ansList, setAnsList] = useState([]);
    const [ansListTemp, setAnsListTemp] = useState([]);
    const [rate, setRate] = useState(0.9);
    const [lastAnsw, setLastAnsw] = useState('');

    const onEnd = () => {
        // You could do something here after speaking has finished
    };
    const { speak, voices } = useSpeechSynthesis({
        onEnd,
    });


    useEffect(() => {
        getDataFromExcel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (_.isEqual(indexClass, ALL_WORDS)) {
            let itemAns = ansList.filter(item => {
                return item.eng === question;
            });
            let arr = ansList.filter(item => {
                return item.classItem === itemAns[0].classItem;
            });
            setAnsListTemp(arr);
        } else {
            setAnsListTemp(ansList);
        }
        window.addEventListener('keydown', e => {
            console.log(e.code);
            if (e.code === "Space") {
                speakText(question, true);
            }

          });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [question]);

    useEffect(() => {
        onChangeQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ansList]);
    useEffect(() => {
        if (_.isEmpty(items)) {
            return;
        }
        let indexTemp = -1;
        let arrClassItem = [];
        items.forEach((item) => {
            if (!_.isEmpty(item.classItem) && item.classItem !== indexTemp) {
                arrClassItem.push(item);
                indexTemp = item.classItem;
            }
        });

        setClassItems(arrClassItem);
        setIndexClass(ALL_WORDS);
    }, [items]);
    useEffect(() => {
        voices.forEach((option, index) => {
            if (
                // option.name.includes("English")||option.name.includes("United States")||
                option.lang.includes("en-US")) {
                setVoiceIndex(index);
            }
        });
    }, [voices]);

    useEffect(() => {
        if (!_.isEmpty(answer)) {
            onCheck();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [answer]);

    useEffect(() => {
        let arrAnsList = [];
        if (indexClass === ALL_WORDS) {
            arrAnsList = items;
        } else {
            items.forEach(item => {
                if (item.classItem === indexClass) {
                    arrAnsList.push(item);
                }
            });
        }
        setAnsList(arrAnsList);
        // eslint-disable-next-line
    }, [indexClass]);
    /** */
    const getDataFromExcel = () => {
        gapi.load("client:auth2", initClient);

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
                loadListenSheet(onLoad, vsheet);
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



    const onChangeQuestion = () => {
        if (!_.isEmpty(ansList)) {
            let ans = ansList[(Math.random() * ansList.length) | 0];
            setQuestion(ans.eng);
            speakText(ans.eng, true);
            setShowAns("");
            setAnswer("");
        }
    };
    const onCheck = () => {
        if (!_.isNull(answer)) {
            if (answer.trim().toUpperCase() === question.toUpperCase().trim()) {
                onChangeQuestion();
                setErrorMs('correct!');
                document.getElementById('answer').value = "";
                setLastAnsw(answer);
            } else {
                setErrorMs('wrong!');
            }
        }
    };

    const onShow = () => {
        if (_.isEmpty(showAns)) {
            setShowAns(question);
        } else {
            setShowAns("");
        }
    }
    const speakText = (speakStr, isEng) => {
        var vVoice = document.getElementById('voice').value;
        var vrate = document.getElementById('rate').value;
        var utterance = new window.SpeechSynthesisUtterance();

        utterance.text = speakStr;
        // utterance.lang = 'en-US';
        utterance.rate = vrate;
        if (isEng) {
            utterance.voice = voices[vVoice];
        }
        utterance.volume = 1;
        speak(utterance);
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setAnswer(e.target.value)
        }
    }
    const changeAns = (e) => {
        setAnswer(e.target.value);
    }
    return (
        <div className='prac'>
            <div className="">
                <select className='button-33' name="isUseVoice" onChange={(e) => {
                    setIndexClass(e.target.value)
                }}>
                    <option value={ALL_WORDS}>All Word</option>
                    {classItems.map((item) => (
                        <option value={item.classItem} key={item.eng}>
                            {`${item.eng}`}
                        </option>
                    ))}
                </select>
                <select className='button-33 inline'
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
                <div>{_.isEmpty(question) ? <div></div> : <FaVolumeUp className='iconSound' onClick={() => speakText(question, true)} />}</div>
            </div>
            <input type="text" id='answer' onKeyDown={e => handleKeyDown(e)} />
            <br />
            <select className='button-33' id='answerCmb' onChange={(e) => {
                changeAns(e)
            }}
                value={answer || ''}
            > <option value="">Choose</option>
                {ansListTemp.map((item) => (
                    <option value={item.eng} key={item.eng}>
                        {`${item.eng}`}
                    </option>
                ))}
            </select>
            <br />
            <div className='msg'>{errorMs === 'wrong!' ? <FaRegFrown /> : <FaRegSmile />}</div>
            {errorMs}<br />
            <input className='button-33' type='submit' value="Check" id='btnSubmit' onClick={() => onCheck()} />
            {ansListTemp.map((item) => (
                    <div key={item.eng}>
                        {`${item.eng}`}<FaVolumeUp className='iconSound' onClick={() => speakText(item.eng, true)} />
                    </div>
            ))}
            <input className='button-12' type='submit' value="Show Ans" id='btnShowAns' onClick={() => onShow()} />
            <div>{showAns}</div>
            <div>{_.isEmpty(lastAnsw) ? <div></div> : <div>Last : {lastAnsw}<FaVolumeUp className='iconSound' onClick={() => speakText(lastAnsw, true)} /></div>} </div>
           
        </div>
    );
}

export default ListenPract;