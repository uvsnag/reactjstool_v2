import { useEffect, useState } from "react";
import AICk from './AIBoard';
import StackBtn from './StackButton';
import './style-common-module.css';

const MulAI = ({size, prefix, enableHis}) => {
    const [numAI, setNumAI] = useState(size);
    const [column, setColumn] = useState(4);
    const [height, setHeight] = useState(400);

    useEffect(() => {
    }, []);

    useEffect(() => {

    }, [column]);

    function clearAllLog(){
        document.querySelectorAll('div.response-ai').forEach(el => el.innerHTML = '');
    }
    return (
        <div>
            <div>
                <span>Instances:</span>
                <input type="number" className="width-30" value={numAI} onChange={(event) => {
                    setNumAI(event.target.value);
                }} />
                <StackBtn onUp={() =>  setNumAI(numAI + 1)} onDown={() =>  setNumAI(numAI - 1)}></StackBtn>
                <span>Cols:</span>
                <input type="number" className="width-30" value={column} onChange={(event) => {
                    setColumn(event.target.value);
                }} />
                <StackBtn onUp={()=> setColumn(column + 1)} onDown={()=> setColumn(column - 1)}></StackBtn>
                <button onClick={() => clearAllLog()} className="button-12 inline">Clear All</button>
                <i>{height}</i>
                <input className="width-220 range-color"
                    type="range"
                    min="10"
                    max="800"
                    defaultValue="400"
                    step="5"
                    // id="height"
                    onChange={(event) => {
                        setHeight(event.target.value);
                    }}
                />

            </div>
            <div class='container-block'>
                {/* Create an array of a specific length and then map over it */}
                {Array.from({ length: numAI }).map((_, index) => (
                    <div className={`block block-${column}cols`}><AICk key={index} index={index} prefix={prefix}
                    enableHis={enableHis} heightRes ={height} /></div>
                ))}

            </div>
        </div>
    )

};
export default MulAI;