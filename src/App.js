import { Link } from "react-router-dom";

function App() {
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
      <span>Other:</span>
      <ul className='mst-menu'>
        <li className='mst-menu-li'><Link to="/ai">AI</Link></li>
        <li className='mst-menu-li'><Link to="/media">Media</Link></li>
        <li className='mst-menu-li'><Link to="/ImageGridGenerator">Image Grid Generator</Link></li>
        <li className='mst-menu-li'><Link to="/ScreenCapture">Screen Capture To Image YT</Link></li>
      </ul>
    </div>
    
  );
}

export default App;
