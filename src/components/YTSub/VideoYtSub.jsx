import { useEffect, useState } from "react";
import './style-yout-sub.css';
import _ from 'lodash';
import { Sub } from './Subtitle.jsx'
import { toggleCollapse } from '../../common/common.js';
import MulAI from '../common/MultiAI.jsx';
import StackBtn from '../common/StackButton.jsx';
let player;
let interval;
let oldClickClass = null;
let isReplay = true;
let indexOfCurrSub = 0;

let customLoopMode = null;
let customLoopAVal = null;
let customLoopBVal = null;
let intervalCusLoop;

var arrTime = [];
const urlCookieNm = 'lis-url';
const subCookieNm = 'lis-sub';
console.log("int..ed variables");
const YoutubeSub = () => {
    const REPLAY_NO = 'REPLACE_NO';
    const REPLAY_YES = 'REPLACE_YES';
    const [arrSub, setArrSub] = useState([]);
    const [customLoopAs, setCustomLoopAs] = useState("");
    const [customLoopBs, setCustomLoopBs] = useState("");
    const [size, setSize] = useState(390);
    const [height, setHeight] = useState(10);
    const [top, setTop] = useState(0);
    const [subHeight, setSubHeight] = useState(300);

    const [modeReplay, setModeReplay] = useState(REPLAY_NO);

    const [url, setUrl] = useState("");
    const [sub, setSub] = useState("");

    const LOOP_CUSTOM = 'LOOP_CUSTOM';

    const NOT_VALUE_TIME = 1;
    const FIXED_VALUE = 3;
    const TIME_MAIN_INTERVAL = 500;

    
    useEffect(() => {
        if (!_.isEmpty(localStorage)) {
            setUrl(localStorage.getItem(urlCookieNm));
            setSub(localStorage.getItem(subCookieNm));
        }

        if (!window.YT) { // If not, load the script asynchronously
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';

            window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        } else { // If script is already there, load the video directly
            onYouTubeIframeAPIReady();
        }
        toggleCollapse("mobile-control");
        toggleCollapse("hide2");
        document.getElementById(`cus-loop-control`).style.display = "block";
        document.getElementById(`timemisus`).value = 2;
        customLoopMode = LOOP_CUSTOM;
        customLoopAVal = NOT_VALUE_TIME;
        customLoopBVal = NOT_VALUE_TIME;
        return () => {
            clearInterval(interval);
            clearInterval(intervalCusLoop);
        };

    }, []);
    useEffect(() => {
        if (_.isEmpty(arrSub)) {
            document.getElementById('subline-control').style.display = "none";
        } else {
            document.getElementById('subline-control').style.display = "block";
        }
    }, [arrSub]);

    useEffect(() => {
        localStorage.setItem(urlCookieNm, url);
    }, [url]);

    const handleBlurA = () => {
        if (customLoopAs) {
            customLoopAVal = Number(customLoopAs);
            clearInterval(intervalCusLoop);
            createInteval();
        }
    };
    const handleBlurB = () => {
        if (customLoopBs) {
            customLoopBVal = Number(customLoopBs);
            clearInterval(intervalCusLoop);
            createInteval();
        }
    };

    const changeTimeLoop = (isStart, isCre) => {
        const SECOND_UNIT = 0.1;
        if (isStart) {
            let value = (Number(customLoopAs) + (isCre ? (SECOND_UNIT) : (-SECOND_UNIT))).toFixed(FIXED_VALUE);
            setCustomLoopAs(value);
            clearInterval(intervalCusLoop);
            customLoopAVal = value;
            createInteval();
        } else {
            let value = (Number(customLoopBs) + (isCre ? (SECOND_UNIT) : (-SECOND_UNIT))).toFixed(FIXED_VALUE);
            setCustomLoopBs(value);
            clearInterval(intervalCusLoop);
            customLoopBVal = value;
            createInteval();
        }
    }


    useEffect(() => {
        localStorage.setItem(subCookieNm, sub);
    }, [sub]);

    useEffect(() => {
        localStorage.setItem(subCookieNm, sub);
        document.getElementById(`sub-control`).style.height = `${subHeight}px`;
    }, [subHeight]);

    const handleSizeChange = (event) => {
        let valueSz = event.target.value;
        setSize(valueSz); // Set the size based on the slider value
        setHeight(10); // Set the size based on the slider value
        setTop(0); // Set the size based on the slider value
        setAttTop(0);
        player.setSize(valueSz * 1.7, valueSz);
    };
    const handleSubChange = (event) => {
        setSubHeight(event.target.value); 
    };
    const handleMaskMedia = (event) => {
        console.log(size)
        setHeight(event.target.value)
        player.setSize(size * 1.7, size * Number(event.target.value / 10));
    };
    const handleTop = (event) => {
        let valueSz = event.target.value;
        setAttTop(valueSz);
    };
    const setAttTop = (valueSz) => {
        setTop(valueSz)
        const div = document.getElementById('main-content');
        div.style.top = `-${valueSz}px`
    }
    const onYouTubeIframeAPIReady = () => {
        player = new window.YT.Player('player', {
            height: 390 / 3,
            width: 640 / 3,
            videoId: "",
            playerVars: {
                fs: 0,
                iv_load_policy: 3,
                'playsinline': 1,
                modestbranding: 0,
                controls: 0
            },
            events: {
                'onReady': onPlayerReady,
            }
        });
    }
    const onPlayerReady = (event) => {
        event.target.playVideo();

        interval = setInterval(() => {
            if (player.getPlayerState() === 1) {
                let currTime = player.getCurrentTime().toString();
                if (currTime.includes(".")) {
                    currTime = currTime.substring(0, currTime.lastIndexOf("."));
                }

                let min = Math.floor(player.getCurrentTime() / 60);
                let sec = Math.floor((player.getCurrentTime() % 60));
                let hour = 0;
                if (min > 60) {
                    hour = Math.floor(min / 60);
                    min = Math.floor(min % 60);
                }
                let mmss = sec > 9 ? `${min}:${sec}` : `${min}:0${sec}`;
                if (hour > 0) {
                    mmss = `${hour}:${mmss}`
                }
                let currentSubEle = null;
                let offsetOgr = document.getElementById(`sub-item0:00`);
                let arrTimeNums = arrTime.map(itm => {
                    return {
                        str: itm,
                        num: Number(itm.replaceAll(":", "")),
                        timeS:toSeconds(itm),
                    }
                })

                let currTm = Number(`${mmss}`.replaceAll(":", ""));
                console.log(currTm)
                for (let i = 0; i < arrTimeNums.length; i++) {
                    if (currTm < arrTimeNums[i].num) {
                        let oldClass = document.getElementById(`${oldClickClass}`)
                        if (oldClass) {
                            oldClass.classList.remove("active");
                        }
                        mmss = arrTimeNums[i >= 1 ? i - 1 : i].str;
                        console.log(arrTimeNums[i > 1 ? i - 1 : i])
                        console.log(mmss)
                        currentSubEle = document.getElementById(`sub-item${mmss}`);
                        currentSubEle.classList.add("active");
                        oldClickClass = `sub-item${mmss}`;

                                const el = document.querySelector('.sub-item.active');

                        let periodLoop = i == 0 ? arrTimeNums[i].timeS : arrTimeNums[i].timeS - arrTimeNums[i - 1].timeS;
                        // let periodLoop = i == 0 ? getTimeFromSub(arrTimeNums[i].str) : getTimeFromSub(arrTimeNums[i].str) - getTimeFromSub(arrTimeNums[i - 1].str);
                        console.log( arrTimeNums[i-1])
                        console.log( arrTimeNums[i])
                        console.log(periodLoop)
                        currentSubEle.style.animationDuration = periodLoop + 's';


                        break;
                    }

                }

                if (currentSubEle && offsetOgr) {
                    let MINUS_TOP =  document.getElementById(`sub-control`).offsetHeight / 3;
                    let distanTop = (offsetOgr) ? offsetOgr.offsetTop : 0;
                    var scrollDiv = currentSubEle.offsetTop - distanTop - MINUS_TOP;
                    let subControl = document.getElementById('sub-control');
                    subControl.scrollTo({ top: (scrollDiv), behavior: 'smooth' });
                }

            }
        }, TIME_MAIN_INTERVAL);

    }

    function toSeconds(timeStr) {
        const parts = timeStr.split(':').map(Number);

        if (parts.length === 1) {
            // SS
            return parts[0];
        } else if (parts.length === 2) {
            // MM:SS
            const [m, s] = parts;
            return m * 60 + s;
        } else if (parts.length === 3) {
            // HH:MM:SS
            const [h, m, s] = parts;
            return h * 3600 + m * 60 + s;
        } else {
            throw new Error("Invalid time format");
        }
    }

    const loadSub = () => {
        var txtSub = document.getElementById('media-sub').value;
        var lineSubArr = txtSub.split('\n');
        let count = 1;
        let tempTime = '';
        let arrTemp = [];
        arrTime = []
        let istime =false;

        const timeRegex = /^\d{1,2}:\d{2}/;

        // let array = lineSubArr.filter((line, index) => {
        //     if (index % 2 === 0) {           // odd index
        //         return timeRegex.test(line);  // must start with HH:MM
        //     }
        //     return true;                    // keep even lines
        // });


        lineSubArr.forEach((line, index) => {
            if(!istime && !timeRegex.test(line)){
                return;
            }
            if (timeRegex.test(line)) {
                istime = true;
            }else{
                istime = false;
            }
            let lineSub = line.trim();
            if (count === 1) {
                tempTime = lineSub;
                arrTime.push(tempTime);
            }
            if (count === 2) {
                arrTemp.push(new Sub(tempTime, lineSub));
                count = 0;
            }
            count++;

        });

        setArrSub(arrTemp);
        if (!_.isEmpty(arrTemp)) {
            document.getElementById('load-sub').style.display = "none";
        }
    };

    const LineSub = (props) => {
        return (
            <div role='button' className={`sub-item`} id={`sub-item${props.time}`} onClick={(e) => onClickSub(props.time, props.value)}>
                {props.time}: {props.value}
            </div>
        )
    }
    const onClickSub = (time, value) => {
        console.log("=====onClickSub=====");
        isReplay = true;
        indexOfCurrSub = arrSub.length - 1;

        for (let i = 0; i < arrSub.length; i++) {
            if (_.isEqual(arrSub[i].time, time)) {
                indexOfCurrSub = i;
            }
        }
        if (modeReplay === REPLAY_YES) {
            loopSub(arrSub[indexOfCurrSub], arrSub[indexOfCurrSub + 1]);
        } else {
            let startTime = getTimeFromSub(arrSub[indexOfCurrSub]);
            // player.seekTo(startTime, true)
            onReplay(startTime)
        }

    };
    const onReplay = (startTime)=>{
          player.seekTo(startTime, true);
    }
    const onProcess = () => {
        var txtSrcMedia = document.getElementById('txtSrcMedia').value;
        var url = txtSrcMedia.substring(txtSrcMedia.lastIndexOf('=') + 1, txtSrcMedia.length).trim();
        player.loadVideoById(url, 0);

    };
    const removeLogo = () => {
        var icon = document.querySelectorAll(".ytp-player-content.ytp-iv-player-content");
        if (icon && icon[0]) {
            icon[0].style.display = "none";
        }
        console.log(`document.querySelectorAll(".ytp-player-content.ytp-iv-player-content")[0].style.display="none"`);
        navigator.clipboard.writeText(`document.querySelectorAll(".ytp-player-content.ytp-iv-player-content")[0].style.display="none"`);
    }
    const onChangeReplay = () => {
        isReplay = false;
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onProcess();
        }
    }
    const onShowHide = (e) => {
        let elm = document.getElementById('load-sub');
        if (elm && elm.style.display === "none") {
            elm.style.display = "block";
        } else {
            elm.style.display = "none";
        }
    }
    const onShowHideVideo = (e) => {
        let elm = document.getElementById('vd-control');
        if (elm && elm.style.display === "none") {
            elm.style.display = "block";
        } else {
            elm.style.display = "none";
        }
    }
    const onNextLine = (e) => {
        indexOfCurrSub++;
        loopSub(arrSub[indexOfCurrSub], arrSub[indexOfCurrSub + 1]);
    }
    const onPrevLine = (e) => {
        if (indexOfCurrSub > 0) {
            indexOfCurrSub--;
            loopSub(arrSub[indexOfCurrSub], arrSub[indexOfCurrSub + 1]);
        }
    }
    const loopSub = (currtSub, nextSub) => {
        customLoopAVal = getTimeFromSub(currtSub);
        customLoopBVal = getTimeFromSub(nextSub);
        setCustomLoopBs(customLoopBVal)
        setCustomLoopAs(customLoopAVal)
        clearInterval(intervalCusLoop);
        createInteval();
    }
    const getTimeFromSub = (sub) => {
        return sub?.time.split(':').reduce((acc, time) => (60 * acc) + +time)?.toFixed(FIXED_VALUE);
    }


    const onStartStop = (e) => {
        if (player.getVideoUrl() === "https://www.youtube.com/watch") {
            onProcess();
        }
        if (player.getPlayerState() !== 1) {
            player.playVideo();
        } else {
            player.pauseVideo();
        }
        console.log(player);
    }

    const previous = () => {
        let currTime = player.getCurrentTime();
        let timemisus = document.getElementById('timemisus').value;
        // player.seekTo(Number(currTime - Number(timemisus)), true);
         onReplay(Number(currTime - Number(timemisus)))
    }
    const next = () => {
        let currTime = player.getCurrentTime();
        let timemisus = document.getElementById('timemisus').value;
        // player.seekTo(Number(currTime + Number(timemisus)), true);
        onReplay(Number(currTime + Number(timemisus)))
    }
    const changeTime = () => {
        let timemisus = document.getElementById('timemisus').value;
        if (timemisus == "1") {
            document.getElementById('timemisus').value = 2;
        } else if (timemisus == "2") {
            document.getElementById('timemisus').value = 3;
        } else if (timemisus == "3") {
            document.getElementById('timemisus').value = 1;
        } else {
            document.getElementById('timemisus').value = 3;
        }
    }
    const onControlKey = (e) => {
        console.log(e.key)
        if (e.key === 'ArrowLeft') {
            previous();
        }
        if (e.key === 'ArrowRight') {
            next();
        }
        if (e.key === 'ArrowDown') {
            onStartStop(e);
        }
        if (e.key === 'ArrowUp') {
            changeTime();

        }
        if (e.key === 'Shift') {
            onAddPoint()
        }
        if (e.key === 'Control') {
            onClearCusLoop()
        }
        if (!Number.isNaN(Number(e.key))) {
            document.getElementById('timemisus').value = Number(e.key)
        }
    }

    const onClearCusLoop = () => {
        customLoopAVal = NOT_VALUE_TIME;
        customLoopBVal = NOT_VALUE_TIME;
        setCustomLoopAs("");
        setCustomLoopBs("");
    }
    const onAddPoint = () => {
        if (customLoopAVal !== NOT_VALUE_TIME && customLoopBVal !== NOT_VALUE_TIME) {
            onClearCusLoop();
        }

        if (customLoopAVal === NOT_VALUE_TIME) {
            customLoopAVal = player.getCurrentTime().toFixed(FIXED_VALUE);
            setCustomLoopAs(customLoopAVal);
            console.log("destroy intervalCusLoop:" + intervalCusLoop);
            clearInterval(intervalCusLoop);
        } else {
            customLoopBVal = player.getCurrentTime().toFixed(FIXED_VALUE);
            setCustomLoopBs(customLoopBVal);
            if (isReplay === true
                && customLoopAVal > 1 && customLoopBVal > 1) {
                createInteval();
            }
        }
    }

    const createInteval = () => {
        let periodLoop = customLoopBVal - customLoopAVal
        // player.seekTo(customLoopAVal, true)
         onReplay(customLoopAVal)
        intervalCusLoop = setInterval(() => {
            if (customLoopAVal == NOT_VALUE_TIME || customLoopBVal == NOT_VALUE_TIME) {
                clearInterval(intervalCusLoop);
                return
            }
            if (_.isEqual(customLoopMode, LOOP_CUSTOM)) {
                if (isReplay === true
                ) {
                    console.log("replay at:" + customLoopAVal);
                    // player.seekTo(customLoopAVal, true)
                    onReplay(customLoopAVal)
                }
            }
        }, periodLoop * 1000);
    }

    const onShowAll = () => {
        document.getElementById('hide1').style.display = "block";
        document.getElementById('hide2').style.display = "block";
    }
    const onHideAll = () => {

        document.getElementById('hide1').style.display = "none";
        document.getElementById('hide2').style.display = "none";
    }
    return (
        <div className="yt-sub" id="main-content" tabIndex={0} onKeyDown={e => onControlKey(e)} >
            <div id="maincontent-yt" className='media-left '>

                <div id='vd-control'>

                    <div id="player"></div><br />

                </div>
                <div>
                    <input className="width-30" id="timemisus" />
                    <span onClick={() => toggleCollapse("hide-control-frame")}>+/-</span>
                    <div id="hide-control-frame" class="collapse-content bolder">
                        <input type="range" className="range-input" id="size" name="vol" min="0" max="1000" value={size} onChange={handleSizeChange}></input><br />
                        <input type="range" className="range-input" id="size" name="vol" min="5" max="20" value={height} onChange={handleMaskMedia}></input><br />
                        <input type="range" className="range-input" id="size" name="vol" min="5" max="700" value={top} onChange={handleTop}></input><br />
                    </div>

                </div>
                <div className="width-100" onClick={() => toggleCollapse("mobile-control")}>Control</div>
                <div id="mobile-control" className="collapse-content bolder">
                    <input type="text" id="txtSrcMedia" value={url} onKeyDown={e => handleKeyDown(e)} onChange={(event) => {
                        setUrl(event.target.value);
                    }} />
                    <input type='submit' className="button-12 inline" value="Load" id='btnExecute' onClick={() => onProcess()} />
                    <input type='submit' className="button-12 inline" value="Remove Info" onClick={() => removeLogo()} />
                    <input type='submit' className="button-12 inline" value="+/-" onClick={() => onShowHideVideo()} /><br />

                    <input type='submit' className='button-12 inline' value="<" onClick={() => previous()} />
                    <input type='submit' className='button-12 inline' value="||" onClick={() => onStartStop()} />
                    <input type='submit' className='button-12 inline' value=">" onClick={() => next()} />
                    <input type='submit' className="button-12 inline" value="Change times" onClick={() => changeTime()} /><br />

                    <input type='submit' className='button-12 inline' value="Add point" onClick={() => onAddPoint()} />
                    <input type='submit' className='button-12 inline' value="clear" onClick={() => onClearCusLoop()} />
                </div>
                <div className="width-100" onClick={() => toggleCollapse("hide2")}>Sub</div>
                <div id="hide2" class="collapse-content bolder">
                    <div id='cus-loop-control' >

                        <input type="text" value={customLoopAs} onChange={(event) => {
                            setCustomLoopAs(event.target.value);
                        }}
                            onBlur={handleBlurA} />
                        <StackBtn onUp={() => changeTimeLoop(true, true)} onDown={() => changeTimeLoop(true, false)}></StackBtn>
                        <span>-</span>
                        <input type="text" value={customLoopBs} onChange={(event) => {
                            setCustomLoopBs(event.target.value);
                        }}
                            onBlur={handleBlurB} />
                        <StackBtn onUp={() => changeTimeLoop(false, true)} onDown={() => changeTimeLoop(false, false)}></StackBtn>

                    </div>
                    <div id="hide1">
                    </div>
                    <div class="tooltip">???
                        <span class="tooltiptext">
                            arrow , and Crtl: clear/ shift: loop
                        </span>
                    </div>

                    <div id='subline-control'>
                        <input type="range" className="range-input" id="size" name="vol" min="30" max="500" value={subHeight} onChange={handleSubChange}></input>
                        <br/>
                        <select value={modeReplay} onChange={(e) => {
                            setModeReplay(e.target.value);
                        }}>
                            <option value={REPLAY_YES}>REPLAY_YES</option>
                            <option value={REPLAY_NO}>REPLAY_NO</option>
                        </select>
                        <input type='submit' value="Continue" onClick={() => onChangeReplay()} />

                        {/* <input className="width-30" placeholder="control-form" onKeyDown={e => onControlKeyListen(e)} /> */}
                        <input type='submit' value="<<" onClick={() => onPrevLine()} />
                        <input type='submit' value=">>" onClick={() => onNextLine()} />
                        <div id='sub-control' >
                            {arrSub.map((item, index) => <LineSub key={`${item.time}${item.value}`}
                                time={item.time}
                                value={item.value}
                            />)}
                        </div>
                        <input type='submit' value="+/-" onClick={() => onShowHide()} />
                    </div>

                    <div className='option-right'> <br />
                    </div>
                    <div id='load-sub'>

                        <input type='submit' className="button-12 margin-zr" value="loadSub" id='btnLoadSube' onClick={() => loadSub()} /><br />
                        <textarea id='media-sub' value={sub} onChange={(event) => {
                            setSub(event.target.value);
                        }}
                        ></textarea>
                    </div>

                    <br />
                    <input type='submit' value="H" id='btnHide' onClick={() => onHideAll()} />
                    <input type='submit' value="S" id='btnShow' onClick={() => onShowAll()} />

                </div>
            </div>
            {/* <input type='submit' className="button-12 inline" value="AI" onClick={() => toggleCollapse("ai-section")} />

            <div id="ai-section" className='collapse-content bolder'>
                <MulAI size={1} prefix='lis-yt' enableHis={true}></MulAI>
            </div> */}
        </div>
    )

};
export default YoutubeSub;