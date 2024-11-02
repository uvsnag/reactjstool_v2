import { Link } from "react-router-dom";

function App() {
  return (

      <div className="App">
        <ul className = 'mst-menu'>
        <li className = 'mst-menu-li'><Link to="/sqlcompile">sqlcompile</Link></li>
        <li className = 'mst-menu-li'><Link to="/sql">sql</Link></li>
        <li className = 'mst-menu-li'><Link to="/json">json</Link></li>
        <li className = 'mst-menu-li'><Link to="/replace">replace</Link></li>
        <li className = 'mst-menu-li'><Link to="/tip_management">tip-management</Link></li>
        <li className = 'mst-menu-li'><Link to="/media">media</Link></li>
        <li className = 'mst-menu-li'><Link to="/notify">notify</Link></li>
        <li className = 'mst-menu-li'><Link to="/listen">listenWordPrac</Link></li>
        <li className = 'mst-menu-li'><Link to="/youtube-sub">youtube-sub</Link></li>
        <li className = 'mst-menu-li'><Link to="/listenTens">listenPassagePrac</Link></li>
        <li className = 'mst-menu-li'><Link to="/voiceToText">VoiceToText</Link></li>
        <li className = 'mst-menu-li'><Link to="/ImageGridGenerator">ImageGridGenerator</Link></li>
        <li className = 'mst-menu-li'><Link to="/ScreenCapture">ScreenCaptureToImgageYT</Link></li>
        </ul>
    </div>
    
  );
}

export default App;
