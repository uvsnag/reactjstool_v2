import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toggleCollapse, KEY_GPT_NM, KEY_GEMINI_NM, KEY_GOOGLE_SHEET_NM } from './common/common.js';
function App() {

  const [gemKey, setGemKey] = useState(null);
  const [gptKey, setGptKey] = useState(null);
  const [googleSheetKey, setGoogleSheetKey] = useState(null);
  useEffect(() => {
    let locGem = localStorage.getItem(KEY_GEMINI_NM);
    let locgpt = localStorage.getItem(KEY_GPT_NM);
    let locGoogleSheet = localStorage.getItem(KEY_GOOGLE_SHEET_NM);
    setGemKey(locGem);
    setGptKey(locgpt);
    setGoogleSheetKey(locGoogleSheet);
  }, []);
  useEffect(() => {
    if (gemKey) {
      localStorage.setItem(KEY_GEMINI_NM, gemKey);
    }

  }, [gemKey]);

  useEffect(() => {
    if (gptKey) {
      localStorage.setItem(KEY_GPT_NM, gptKey);
    }
  }, [gptKey]);

  useEffect(() => {
    if (googleSheetKey) {
      localStorage.setItem(KEY_GOOGLE_SHEET_NM, googleSheetKey);
    }
  }, [googleSheetKey]);

  return (

    <div className="App">
      <span>Coding:</span>
      <ul className='mst-menu'>
        <li className='mst-menu-li'><Link to="/sqlcompile">SQL Compile</Link></li>
        <li className='mst-menu-li'><Link to="/sql">Sql Generator</Link></li>
        <li className='mst-menu-li'><Link to="/json">Json Generator</Link></li>
        <li className='mst-menu-li'><Link to="/replace">Replace Tool</Link></li>
      </ul>
      <span>Eng:</span>
      <ul className='mst-menu'>
        <li className='mst-menu-li'><Link to="/notify">Notify</Link></li>
        <li className='mst-menu-li'><Link to="/youtube-sub">YT-Sub</Link></li>
        <li className='mst-menu-li'><Link to="/next-sent">Next-Sentence</Link></li>
        <li className='mst-menu-li'><Link to="/listen">Listen Word Prac</Link></li>
        <li className='mst-menu-li'><Link to="/listenTens">Listen Passage Prac</Link></li>
        <li className='mst-menu-li'><Link to="/voiceToText">Speed To Text</Link></li>
      </ul>
      <span>Board:</span>
      <ul className='mst-menu'>
        <li className='mst-menu-li'><Link to="/board1">Board1</Link></li>
      </ul>
      <span>Other:</span>
      <ul className='mst-menu'>
        <li className='mst-menu-li'><Link to="/ai">AI</Link></li>
        <li className='mst-menu-li'><Link to="/media">Media</Link></li>
        <li className='mst-menu-li'><Link to="/ImageGridGenerator">Image Grid Generator</Link></li>
        <li className='mst-menu-li'><Link to="/ScreenCapture">Screen Capture To Image YT</Link></li>
        <li className='mst-menu-li' onClick={() => toggleCollapse(`config`)}>Config</li>
      </ul>
      <div id='config' className='collapse-content bolder' >
        <span>gem:</span>
        <input type="text" value={gemKey} onChange={(event) => {
          setGemKey(event.target.value);
        }} placeholder="gem" />
         <span>gpt:</span>
        <input type="text" value={gptKey} onChange={(event) => {
          setGptKey(event.target.value);
        }} placeholder="gpt" /><br />
         <span>Google sheet:</span>
        <input type="text" value={googleSheetKey} onChange={(event) => {
          setGoogleSheetKey(event.target.value);
        }} placeholder="google sheet key" /><br />
      </div>
    </div>
    
  );
}

export default App;
