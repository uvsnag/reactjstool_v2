import { useEffect, useState, useRef } from "react";
import _ from 'lodash';
import { copyContent } from '../../common/common.js';
import MulAI from '../common/MultiAI.jsx';
import { toggleCollapse } from '../../common/common.js';
import AIBoard from '../common/AIBoard.jsx';

const currSentenceNm = 'current-sentence';
const orgTextNm = 'org-text';

let commonArr = [];
const NextSentence =  ({heightProp}) =>  {
    // let isShowPract = useRef(false)
    const [currentSentence, setCurrentSentence] = useState('');
    const [orgText, setOrgText] = useState('');

    useEffect(() => {
        if (!_.isEmpty(localStorage)) {
            setCurrentSentence(localStorage.getItem(currSentenceNm));
            setOrgText(localStorage.getItem(orgTextNm));
        }
        // toggleCollapse("sentence")
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
    function onHideShow() {
       toggleCollapse("sentence"); 
    //    isShowPract.current = true
    }
    return (
        <div>
            <div id="sentence" className='collapse-content bolder'>
                <div className="container-55">
                    <div>{currentSentence}</div>
                    <div>
                        <AIBoard key={0} index={0} prefix='pract_sent'
                                enableHis={false} heightRes ={140} 
                                isMini = {true} statement ={currentSentence}
                                isShowPract = {true}
                                lastSentence = {null}
                                />
                    </div>
                </div>
                <input type='submit' className="button-12 inline" value="Next" id='btnExecute' onClick={() => onProcess()} />
                <input type='submit' className="button-12 inline" value="Copy" id='btnCoppy' onClick={() => copyContent('note')} />
            </div>
            <input type='submit' className="button-12 inline" value="Source" onClick={() => toggleCollapse("maincontent-nw")} />
            <input type='submit' className="button-12 inline" value="+/-" 
            onClick={() => onHideShow()} />
            <div id="maincontent-nw" className='collapse-content bolder'>
                <textarea id='sentence-text' value={orgText} onChange={(event) => {
                    setOrgText(event.target.value);
                }}
                ></textarea>
            </div>
            <MulAI size = {4} prefix ='nxt' enableHis = {false} heightProp={heightProp}></MulAI>
        </div>
    )

};
export default NextSentence;