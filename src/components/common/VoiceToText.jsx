import React, { useEffect, useState } from "react";
import { MdHearing } from 'react-icons/md';
import { FaMicrophone } from 'react-icons/fa';
import _ from 'lodash';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";


const VoiceToText = ({setText}) => {

    const { transcript
        , resetTranscript
        , listening
        , browserSupportsSpeechRecognition
        , isMicrophoneAvailable
        , interimTranscript
        , finalTranscript } = useSpeechRecognition();



    const [isStartRecord, setIsStartRecord] = useState(false);
    useEffect(() => {
        setText(transcript);
    }, [transcript]);
    useEffect(() => {
        if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
            alert("Browser does not support speech to text");
        }
    }, []);


    const startListening = () => {
        setIsStartRecord(true);
        console.log('Start recoding...');
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
        setTimeout(() => {
            console.log(transcript)
        }, 1000);
    }
    const stopListening = () => {
        setIsStartRecord(false);
        console.log('Stoped record');
        SpeechRecognition.stopListening();
    }
    const processRecord = () => {
        isStartRecord ? stopListening() : startListening()
    }
    return (
            <button className='button-12 inline' onClick={() => processRecord()}> {isStartRecord ? <MdHearing /> : <FaMicrophone />} </button>
    )

};
export default VoiceToText;