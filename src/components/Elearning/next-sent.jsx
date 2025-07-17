import React, { useEffect, useState } from "react";
import _ from 'lodash';
import { copyContent } from '../../common/common.js';
import AICk from '../common/ai-board.jsx';
import MulAI from '../common//multi-ai.jsx';
import { toggleCollapse } from '../../common/common.js';

const currSentenceNm = 'current-sentence';
const orgTextNm = 'org-text';

let commonArr = [];
const NextSentence = () => {

    const [currentSentence, setCurrentSentence] = useState('');
    const [orgText, setOrgText] = useState('');

    useEffect(() => {
        if (!_.isEmpty(localStorage)) {
            setCurrentSentence(localStorage.getItem(currSentenceNm));
            setOrgText(localStorage.getItem(orgTextNm));
        }
        toggleCollapse("sentence")
    }, []);

    useEffect(() => {
        localStorage.setItem(currSentenceNm, currentSentence);
    }, [currentSentence]);

    useEffect(() => {
        localStorage.setItem(orgTextNm, orgText);
    }, [orgText]);

    function onProcess() {
        commonArr = orgText.match(/[^.!?]+[.!?]?/g).map(s => s.trim());
        if (commonArr && commonArr.length > 0) {
            setCurrentSentence(commonArr.shift())
            setOrgText(commonArr.join('\n'));
        }
    }
    return (
        <div>
            <div id="sentence" className='collapse-content'>
                <div>{currentSentence}</div>
            </div>
            <input type='submit' className="button-12 inline" value="Next" id='btnExecute' onClick={() => onProcess()} />
            <input type='submit' className="button-12 inline" value="Copy" id='btnCoppy' onClick={() => copyContent('note')} />
            <input type='submit' className="button-12 inline" value="^^^" onClick={() => toggleCollapse("sentence")} />
            <div onClick={() => toggleCollapse("maincontent-nw")}>vvv</div>
            <div id="maincontent-nw" className='collapse-content'>
                <textarea id='sentence-text' value={orgText} onChange={(event) => {
                    setOrgText(event.target.value);
                }}
                ></textarea>
            </div>
            <MulAI size = {3}></MulAI>
            <div className=" height1000"></div>
        </div>
    )

};
export default NextSentence;