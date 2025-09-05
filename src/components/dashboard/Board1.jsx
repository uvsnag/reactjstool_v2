/* eslint-disable react-hooks/exhaustive-deps */
// this is a tools for studying english
import { useEffect, useState } from "react";
import '../../common/style.css';
import '../../common/style-template.css';
import _ from 'lodash';
import MulAI from '../common/MultiAI.jsx';
import NotifyAuto from '../learning/NotifyAutoE.jsx';
import SpeechRecogn from '../recognize-text/RecognizeText.jsx';
import NextSentence from '../learning/NextSentence.jsx';
import YoutubeSub from '../YTSub/VideoYtSub.jsx';
import { toggleCollapse } from '../../common/common.js';

const Board1 = () => {

    /**  */
    useEffect(() => {
    }, []);
    return (
        <div className="">
            <div className="container-64">

            <NotifyAuto></NotifyAuto>
            <SpeechRecogn></SpeechRecogn>
            </div>
            <div  onClick={() => toggleCollapse("ai-section")}>AI</div>

            <div id="ai-section" className='collapse-content '>
                {/* <MulAI size={2} prefix='board1' enableHis={false}></MulAI> */}
                <NextSentence></NextSentence>
            </div>
              <div  onClick={() => toggleCollapse("yt-section")}>YT</div>
            {/* <input type='submit' className="button-12 inline" value="YT-Sub" onClick={() => toggleCollapse("yt-section")} /> */}

            <div id="yt-section" className='collapse-content bolder'>
                <YoutubeSub></YoutubeSub>
            </div>
          
        </div>
    );

}

export default Board1;