import React, { useEffect, useState } from "react";
// import './styleYoutSub.css';
import _ from 'lodash';


const currSentenceNm = 'current-sentence';
const orgTextNm = 'org-text';
const notetNm = 'note-of-text';
let commonArr = [];
const NextSentence = () => {

    const [currentSentence, setCurrentSentence] = useState('');
    const [orgText, setOrgText] = useState('');
    const [note, setNote] = useState('');


    useEffect(() => {
        if (!_.isEmpty(localStorage)) {
            setCurrentSentence(localStorage.getItem(currSentenceNm));
            setOrgText(localStorage.getItem(orgTextNm));
            setNote(localStorage.getItem(notetNm));
        }
        collapseSentence();
    }, []);

    useEffect(() => {
        localStorage.setItem(currSentenceNm, currentSentence);
    }, [currentSentence]);
    
    useEffect(() => {
        localStorage.setItem(notetNm, note);
    }, [note]);

    useEffect(() => {
        localStorage.setItem(orgTextNm, orgText);
    }, [orgText]);
    function toggleCollapse(id) {
        const content = document.getElementById(id);
        content.classList.toggle('open'); // Add or remove the 'open' class
    }
    function collapseOrgText() {
        toggleCollapse("maincontent-nw")
    }
    function collapseSentence() {
        toggleCollapse("sentence")
    }
    function onProcess() {
        commonArr = orgText.match(/[^.!?]+[.!?]?/g).map(s => s.trim());
        if(commonArr && commonArr.length>0){
            setCurrentSentence(commonArr.shift())
            setOrgText(commonArr.join('\n'));
        }
    }
    const onCoppy = () => {
        let val = document.getElementById('note').value
        navigator.clipboard.writeText(val);
    };
    return (
        <div>
            <div  id="sentence" className='collapse-content'>
                <div>{currentSentence}</div>
            </div>
             <input type='submit' className="button-12 inline" value="Next" id='btnExecute' onClick={() => onProcess()} />
             <input type='submit' className="button-12 inline" value="Copy" id='btnCoppy' onClick={() => onCoppy()} />
             <input type='submit' className="button-12 inline" value="^^^"  onClick={() => collapseSentence()} />
             <br/>
            <textarea id = 'note' className="full-with" value={note} onChange={(event) => {
                    setNote(event.target.value);
                }}
                ></textarea>
            <div onClick={() => collapseOrgText()}>vvv</div>
            <div id="maincontent-nw" className='collapse-content'>
                <textarea id = 'sentence-text' value={orgText} onChange={(event) => {
                    setOrgText(event.target.value);
                }}
                ></textarea>
            </div>
            <div className=" height1000"></div> 
        </div>
    )

};
export default NextSentence;