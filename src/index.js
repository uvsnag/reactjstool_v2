import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SqlProcess from './components/gen-tools-it/SqlProcessCK.jsx'
import JsonProcess from './components/gen-tools-it/JsonProcess.jsx'
import SqlCompile from './components/gen-tools-it/SqlCompileCK.jsx'
import ReplaceProcess from './components/gen-tools-it/ReplaceProcess.jsx'
import MediaProcess from './components/YTSub/MediaProcess.jsx'
import NotifyAuto from './components/learning/NotifyAutoE.jsx'
import ListenPract from './components/learning/ListenPractice.jsx'
import ListenTensPract from './components/learning/ListenTensPractice.jsx'
import YoutubeSub from './components/YTSub/VideoYtSub.jsx'
import NextSentence from './components/learning/NextSentence.jsx'
import AI from './components/learning/AI.jsx'
import ImageGridGenerator from './components/yout-tools/ImageGridGenerator.jsx'
import ScreenCapture from './components/yout-tools/ScreenCapture.jsx'
import SpeechRecogn from './components/recognize-text/RecognizeText.jsx'
import RedirectUrl from './components/RedirectUrl'
import reportWebVitals from './reportWebVitals';
import { FaHome } from 'react-icons/fa';
import {Link, Route,  Routes, HashRouter } from "react-router-dom";
const handleCheckboxDarkChange = (e) => {
  // const targetDiv = document.getElementById("root");
  const bodyElement = document.body;
  if (bodyElement) {
      if (e.target.checked) {
          bodyElement.classList.add("dark-90");
      } else {
          bodyElement.classList.remove("dark-90");
      }
  }
};
ReactDOM.render(
  <React.StrictMode>
     <HashRouter >
    <div><Link to="/"><FaHome/></Link>
    <label><input type="checkbox" onChange={handleCheckboxDarkChange} defaultChecked={false}/>Dark mode</label>
    </div>
    <br/>
    <Routes>
        <Route exact path="/" element={<App/>} />
         <Route path="/sql" element={<SqlProcess/>} />
         <Route path="/json" element={<JsonProcess/>} />
         <Route path="/replace" element={<ReplaceProcess/>} />
         <Route path="/media" element={<MediaProcess/>} />
         <Route path="/notify" element={<NotifyAuto/>} />
         <Route path="/tip_management" element={<RedirectUrl url="https://uvsnag.github.io/tip_management_for_nodejs/" />} />
         <Route path="/listen" element={<ListenPract/>} />
         <Route path="/listenTens" element={<ListenTensPract/>} />
         <Route path="/youtube-sub" element={<YoutubeSub/>} />
         <Route path="/next-sent" element={<NextSentence/>} />
         <Route path="/ai" element={<AI/>} />
         <Route path="/voiceToText" element={<SpeechRecogn/>} />
         <Route path="/sqlcompile" element={<SqlCompile/>} />
         <Route path="/ImageGridGenerator" element={<ImageGridGenerator/>} />
         <Route path="/ScreenCapture" element={<ScreenCapture/>} />
          
      </Routes>
    </HashRouter >
    {/* <App /> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
