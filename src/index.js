import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SqlProcess from './components/gen_tools_it/sqlProcess'
import JsonProcess from './components/jsonProcess.jsx'
import SqlCompile from './components/gen_tools_it/sqlCompile'
import ReplaceProcess from './components/replaceProcess.jsx'
import MediaProcess from './components/mediaProcess.jsx'
import NotifyAuto from './components/Elearning/notifyAuto.jsx'
import ListenPract from './components/Elearning/listenPract.jsx'
import ListenTensPract from './components/Elearning/listenTensPract.jsx'
import YoutubeSub from './components/YTSub/vdYtSub'
import NextSentence from './components/Elearning/next-sent.jsx'
import ImageGridGenerator from './components/yout_tools/ImageGridGenerator.jsx'
import ScreenCapture from './components/yout_tools/ScreenCapture.jsx'
import SpeechRecogn from './components/recognize_text/recognizeText'
import RedirectUrl from './components/RedirectUrl'
import reportWebVitals from './reportWebVitals';
import { FaHome } from 'react-icons/fa';
import {Link, Route,  Routes, BrowserRouter, HashRouter } from "react-router-dom";
const handleCheckboxDarkChange = (e) => {
  const targetDiv = document.getElementById("root");
  if (targetDiv) {
      if (e.target.checked) {
          targetDiv.classList.add("dark-90");
      } else {
          targetDiv.classList.remove("dark-90");
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
