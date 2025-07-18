import { useEffect, useState } from "react";
import AICk from './AIBoard';
import './style-common-module.css';

const MulAI = ({size, prefix}) => {
    const [numAI, setNumAI] = useState(size);
    const [column, setColumn] = useState(3);

    useEffect(() => {
    }, []);

    useEffect(() => {

    }, [column]);
    return (
        <div>
            <div>
                <span>Instances:</span>
                <input type="number" className="width-30" value={numAI} onChange={(event) => {
                    if (event.target.value < 10) {
                        setNumAI(event.target.value);
                    }
                }} />
                <span>Cols:</span>
                <input type="number" className="width-30" value={column} onChange={(event) => {
                    if (event.target.value <= 5 && event.target.value> 0) {
                        setColumn(event.target.value);
                    }
                }} />
            </div>
            <div class='container-block'>
                {/* Create an array of a specific length and then map over it */}
                {Array.from({ length: numAI }).map((_, index) => (
                    <div className={`block block-${column}cols`}><AICk key={index} index={index} prefix={prefix} /></div>
                ))}

            </div>
        </div>
    )

};
export default MulAI;