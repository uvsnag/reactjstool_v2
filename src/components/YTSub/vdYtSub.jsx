import React, { useEffect, useState } from "react";
import './styleYoutSub.css';
import _ from 'lodash';
import { Sub } from './subtitle.jsx'
import { useCookies } from 'react-cookie'

let player;
let interval;
let currentTime;
let startTime = 0;
let nextTime = 100000;
let oldClickClass = null;
let isReplay = true;
let modeReplay = '';
let mode = '';
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

    const [arrSub, setArrSub] = useState([]);
    const [widthYt, setWidthYt] = useState(1080);
    const [heightYt, setHeightYt] = useState(720);
    const [customLoopAs, setCustomLoopAs] = useState("");
    const [customLoopBs, setCustomLoopBs] = useState("");
    const [size, setSize] = useState(390);
    const [height, setHeight] = useState(10);
    const [top, setTop] = useState(0);

    const [url, setUrl] = useState("");
    const [sub, setSub] = useState("");


    const COLOR_NONE = "";
    const COLOR_CURRENT_BACKGROUND = "#580e0e";

    const MODE_NOMAL = 'NOMAL';
    const MODE_FOCUS_SUB = 'FOCUS_SUB';
    const MODE_FOCUS_SUB2 = 'FOCUS_SUB2';

    const REPLAY_NO = 'REPLACE_NO';
    const REPLAY_YES = 'REPLACE_YES';



    const LOOP_CUSTOM = 'LOOP_CUSTOM';
    const LOOP_NONE = 'LOOP_NONE';

    const NOT_VALUE_TIME = 1;
    const FIXED_VALUE = 3;
    const TIME_MAIN_INTERVAL = 1000;

    const SIZE_1200X700 = '1200X700';
    const SIZE_900X630 = '900X630';
    const SIZE_800X560 = '800X560';
    const SIZE_640X390 = '640X390';
    const SIZE_400X280 = '400X280';
    const SIZE_300X210 = '300X210';
    const SIZE_150X120 = '150X120';
    const SIZE_100X80 = '100X80';
    const SIZE_70X50 = '70X50';
    const SIZE_1X1 = '1X1';
    const SIZE_CUSTOM = 'custom';

    useEffect(() => {
        if (!_.isEmpty(localStorage)) {
            setUrl(localStorage.getItem(urlCookieNm));
            setSub(localStorage.getItem(subCookieNm));
        }

        if (!window.YT) { // If not, load the script asynchronously
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';

            // onYouTubeIframeAPIReady will load the video after the script is loaded
            window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        } else { // If script is already there, load the video directly
            // loadVideo();
            onYouTubeIframeAPIReady();
        }
        document.getElementById(`cus-loop-control`).style.display = "block";
        document.getElementById(`timemisus`).value = 2;
        mode = MODE_NOMAL;
        customLoopMode = LOOP_CUSTOM;
        customLoopAVal = NOT_VALUE_TIME;
        customLoopBVal = NOT_VALUE_TIME;
        modeReplay = REPLAY_YES;
        return () => {
            clearInterval(interval);
            clearInterval(intervalCusLoop);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const handleSizeChange = (event) => {
        let valueSz = event.target.value;
        setSize(valueSz); // Set the size based on the slider value
        setHeight(10); // Set the size based on the slider value
        setTop(0); // Set the size based on the slider value
        setAttTop(0);
        player.setSize(valueSz * 1.7, valueSz);
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
            height: 390,
            width: 640,
            videoId: "",
            playerVars: {
                'playsinline': 1
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
                currentTime = currTime;
                let currentSubEle = null;
                let offsetOgr = document.getElementById(`sub-item0:00`);
                let arrTimeNums = arrTime.map(itm => {
                    return {
                        str: itm,
                        num: Number(itm.replaceAll(":", ""))
                    }
                })



                let currTm = Number(`${hour}${mmss}`.replaceAll(":", ""));
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
                        break;
                    }

                }

                if (currentSubEle && offsetOgr) {
                    let MINUS_TOP = _.isEqual(mode, MODE_FOCUS_SUB) ? -10 :
                        document.getElementById(`sub-control`).offsetHeight / 3;
                    let distanTop = (offsetOgr) ? offsetOgr.offsetTop : 0;
                    var scrollDiv = currentSubEle.offsetTop - distanTop - MINUS_TOP;
                    let subControl = document.getElementById('sub-control');
                    subControl.scrollTo({ top: (scrollDiv), behavior: 'smooth' });
                }

                if (_.isEqual(customLoopMode, LOOP_NONE) && _.isEqual(currentTime, nextTime.toString()) && isReplay === true && modeReplay === REPLAY_YES) {
                    player.seekTo(startTime, true)
                }
            }
        }, TIME_MAIN_INTERVAL);

    }

    const onChangeWith = (value) => {
        setWidthYt(value);
        setHeightYt(value * 0.7);
    };
    const loadSub = () => {
        var txtSub = document.getElementById('media-sub').value;
        var lineSubArr = txtSub.split('\n');
        let count = 1;
        let tempTime = '';
        let arrTemp = [];
        arrTime = []
        lineSubArr.forEach((line, index) => {
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
        startTime = time.split(':').reduce((acc, time) => (60 * acc) + +time);
        indexOfCurrSub = arrSub.length - 1;

        for (let i = 0; i < arrSub.length; i++) {
            if (_.isEqual(arrSub[i].time, time)) {
                indexOfCurrSub = i;
            }
        }
        nextTime = arrSub[indexOfCurrSub + 1].time.split(':').reduce((acc, time) => (60 * acc) + +time);

        player.seekTo(startTime, true);

    };
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
    const onChangeSize = (value) => {
        switch (value) {
            case SIZE_1200X700:
                player.setSize(1200, 700);
                break;
            case SIZE_900X630:
                player.setSize(900, 630);
                break;
            case SIZE_800X560:
                player.setSize(800, 650);
                break;
            case SIZE_640X390:
                player.setSize(640, 390);
                break;
            case SIZE_300X210:
                player.setSize(300, 210);
                break;
            case SIZE_150X120:
                player.setSize(150, 120);
                break;
            case SIZE_100X80:
                player.setSize(100, 80);
                break;
            case SIZE_70X50:
                player.setSize(70, 50);
                break;
            case SIZE_400X280:
                player.setSize(400, 280);
                break;
            case SIZE_1X1:
                player.setSize(1, 1);
                break;
            case SIZE_CUSTOM:
                player.setSize(widthYt, heightYt);
                break;
            default:
                console.log("Error: Not have data to set size!");
                break;
        }
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
        startTime = arrSub[indexOfCurrSub].time.split(':').reduce((acc, time) => (60 * acc) + +time);
        nextTime = arrSub[indexOfCurrSub + 1].time.split(':').reduce((acc, time) => (60 * acc) + +time);
        player.seekTo(startTime, true);
    }
    const onPrevLine = (e) => {
        if (indexOfCurrSub > 0) {
            indexOfCurrSub--;
            startTime = arrSub[indexOfCurrSub].time.split(':').reduce((acc, time) => (60 * acc) + +time);
            nextTime = arrSub[indexOfCurrSub + 1].time.split(':').reduce((acc, time) => (60 * acc) + +time);
            player.seekTo(startTime, true);
        }
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
        player.seekTo(Number(currTime - Number(timemisus)), true);
    }
    const next = () => {
        let currTime = player.getCurrentTime();
        let timemisus = document.getElementById('timemisus').value;
        player.seekTo(Number(currTime + Number(timemisus)), true);
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
    const onControlKeyListen = (e) => {
        console.log(e.nativeEvent.code)
        if (e.key === 'ArrowLeft') {
            onPrevLine()
        }
        if (e.key === 'ArrowRight') {
            onNextLine()
        }
        if (e.key === 'ArrowDown') {
            onStartStop(e);
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
            if (isReplay === true && modeReplay === REPLAY_YES && customLoopAVal > 1 && customLoopBVal > 1) {
                createInteval();
            }
        }
    }

    const createInteval = () => {
        let periodLoop = customLoopBVal - customLoopAVal
        // console.log(periodLoop)
        player.seekTo(customLoopAVal, true)
        intervalCusLoop = setInterval(() => {
            if (customLoopAVal == NOT_VALUE_TIME || customLoopBVal == NOT_VALUE_TIME) {
                clearInterval(intervalCusLoop);
                return
            }
            // console.log('loop')
            if (_.isEqual(customLoopMode, LOOP_CUSTOM)) {
                // let cusCurrentTime = player.getCurrentTime().toFixed(FIXED_VALUE);
                if (isReplay === true && modeReplay === REPLAY_YES) {
                    console.log("replay at:" + customLoopAVal);
                    player.seekTo(customLoopAVal, true)
                }
            }
        }, periodLoop * 1000);
    }

    const onChangeLoop = () => {
        onClearCusLoop();
        customLoopMode = (customLoopMode === LOOP_CUSTOM) ? LOOP_NONE : LOOP_CUSTOM;

        if (customLoopMode === LOOP_NONE) {
            document.getElementById(`cus-loop-control`).style.display = "none";
            console.log("destroy intervalCusLoop:" + intervalCusLoop);
            clearInterval(intervalCusLoop);
        } else {
            document.getElementById(`cus-loop-control`).style.display = "block";
        }

    }
    const onShowAll = () => {
        document.getElementById('hide1').style.display = "block";
        document.getElementById('hide2').style.display = "block";
    }
    const onHideAll = () => {

        document.getElementById('hide1').style.display = "none";
        document.getElementById('hide2').style.display = "none";
    }
    const onChangeMode = (value) => {
        mode = value;
        switch (mode) {
            case MODE_NOMAL:
                document.getElementById(`sub-control`).style.height = '300px';
                break;
            case MODE_FOCUS_SUB:
                document.getElementById(`sub-control`).style.height = '30px';
                // document.getElementById('vd-control').style.display = "none";
                break;
            case MODE_FOCUS_SUB2:
                document.getElementById(`sub-control`).style.height = '100px';
                // document.getElementById('vd-control').style.display = "none";
                break;
            default:
                console.log("Error: Not have data to set mode!");
                break;
        }

    }
    function toggleCollapse(id) {
        const content = document.getElementById(id);
        content.classList.toggle('open'); // Add or remove the 'open' class
    }
    function collapseMobile() {
        toggleCollapse("mobile-control")
    }
    function collapsecontrol() {
        toggleCollapse("hide2")
    }
    function collapseControlFrame() {
        toggleCollapse("hide-control-frame")
    }
    return (
        <div className="" id="main-content">
            <div class="sidebar-cus">
                <input className="width-60" placeholder="control-form" onKeyDown={e => onControlKey(e)} /> <input className="width-30" id="timemisus" />
                <span onClick={() => collapseControlFrame()}>+/-</span>
                <div id="hide-control-frame" class="collapse-content">
                    <input type="range" className="range-input" id="size" name="vol" min="0" max="1000" value={size} onChange={handleSizeChange}></input><br />
                    <input type="range" className="range-input" id="size" name="vol" min="5" max="20" value={height} onChange={handleMaskMedia}></input><br />
                    <input type="range" className="range-input" id="size" name="vol" min="5" max="700" value={top} onChange={handleTop}></input><br />
                </div>

            </div>
            <div id="maincontent-yt" className='media-left '>
        
                <div id='vd-control'>

                    {/* <div className="mask-media"></div> */}
                    <div id="player"></div><br />

                </div>
                <div onClick={() => collapseMobile()}>Control</div>
                <div id="mobile-control" className="collapse-content ">
                    <input type='submit' className="margin-zr" value="<" onClick={() => previous()} />
                    <input type='submit' className=" margin-zr" value="||" onClick={() => onStartStop()} />
                    <input type='submit' className=" margin-zr" value=">" onClick={() => next()} /><br />
                    <input type='submit' className="button-12 margin-zr" value="Change times" onClick={() => changeTime()} />
                    <input type='submit' className=" margin-zr" value="Add point" onClick={() => onAddPoint()} />
                    <input type='submit' className=" margin-zr" value="clear" onClick={() => onClearCusLoop()} />
                    <input type='submit' className="button-12 margin-zr" value="Remove Info" onClick={() => removeLogo()} />
                    <input type='submit' className="button-12 margin-zr" value="+/-" onClick={() => onShowHideVideo()} />
                    <input type="text" id="txtSrcMedia" value={url} onKeyDown={e => handleKeyDown(e)} onChange={(event) => {
                        setUrl(event.target.value);
                    }} />
                    <input type='submit' className="button-12 margin-zr" value="Load" id='btnExecute' onClick={() => onProcess()} />
                </div>
                <div onClick={() => collapsecontrol()}>Sub</div>
                <div id="hide2" class="collapse-content">
                    <div id='cus-loop-control'>
                        {/* <div>{customLoopAs}{_.isEmpty(customLoopAs) ? '' : '-'}{customLoopBs}</div> */}
                        
                        <input type="text" value={customLoopAs} onChange={(event) => {
                            setCustomLoopAs(event.target.value);
                        }} 
                         onBlur={handleBlurA}/>
                        <input type='submit' value="^" onClick={() => changeTimeLoop(true,true)} />
                        <input type='submit' value="v" onClick={() => changeTimeLoop(true,false)} />
                        <span>-</span>
                        <input type="text" value={customLoopBs} onChange={(event) => {
                            setCustomLoopBs(event.target.value);
                        }} 
                        onBlur={handleBlurB}/>
                        <input type='submit' value="^" onClick={() => changeTimeLoop(false,true)} />
                        <input type='submit' value="v" onClick={() => changeTimeLoop(false,false)} />
                      
                    </div>
                    <div id="hide1">
                    </div>
                    {/* <input type='submit' className="button-12" value="|>" onClick={() => onStartStop()} /> */}
                    <div class="tooltip">???
                        <span class="tooltiptext">
                            arrow , and Crtl: clear/ shift: loop
                        </span>
                    </div>

                    <div id='subline-control'>
                        <select onChange={(e) => {
                            onChangeMode(e.target.value)
                        }}>
                            <option value={MODE_NOMAL}>Nomal</option>
                            <option value={MODE_FOCUS_SUB}>Focus</option>
                            <option value={MODE_FOCUS_SUB2}>Focus2</option>
                        </select>
                        <select onChange={(e) => {
                            modeReplay = e.target.value;
                        }}>
                            <option value={REPLAY_YES}>REPLAY_YES</option>
                            <option value={REPLAY_NO}>REPLAY_NO</option>
                        </select>
                        <input type='submit' value="Continue" onClick={() => onChangeReplay()} />

                        <input className="width-30" placeholder="control-form" onKeyDown={e => onControlKeyListen(e)} />
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
            <div className=" height1000"></div>
        </div>
    )

};
export default YoutubeSub;