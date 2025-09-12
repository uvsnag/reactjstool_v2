/* eslint-disable react-hooks/exhaustive-deps */
// this is a tools for studying english
import { useEffect, useState } from "react";
import '../../common/style.css';
import '../../common/style-template.css';
import _ from 'lodash';
import MulAI from '../common/MultiAI.jsx';
import NotifyAuto from '../learning/NotifyAutoE.jsx';
// import SpeechRecogn from '../recognize-text/RecognizeText.jsx';
import VoiceToText from '../common/VoiceToText.jsx';
import NextSentence from '../learning/NextSentence.jsx';
import YoutubeSub from '../YTSub/VideoYtSub.jsx';
import { toggleCollapse } from '../../common/common.js';

const Board1 = () => {
 const [prompt, setPrompt] = useState("");
    /**  */
    useEffect(() => {
        toggleCollapse("ai-section");
    }, []);
    return (
        <div className="">
            <div className="title-board" onClick={() => toggleCollapse("pract-section")}>Practice</div>
            <div className="container-64 collapse-content" id="pract-section">

                <NotifyAuto></NotifyAuto>
                <div>
                    <div className="title-board" onClick={() => toggleCollapse("speed-section")}>Speed</div>
                    <div id="speed-section" className='collapse-content '>
                        <textarea className='width-93'
                            rows="5"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <br />
                        <VoiceToText setText={setPrompt} index={"board1"}></VoiceToText>
                    </div>
                </div>
            </div>
            <div className="title-board" onClick={() => toggleCollapse("ai-section")}>AI</div>

            <div id="ai-section" className='collapse-content '>
                <NextSentence heightProp = {300}></NextSentence>
            </div>
            <div className="title-board" onClick={() => toggleCollapse("yt-section")}>YT</div>

            <div id="yt-section" className='collapse-content bolder'>
                <YoutubeSub></YoutubeSub>
            </div>

        </div>
    );

}

export default Board1;