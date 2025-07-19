import { useEffect } from "react";
import './style-common-module.css';

const StackBtn = ({onUp, onDown}) => {

    useEffect(() => {
    }, []);

    return (

        <div className="inline-block offset-top-10">

            <div className="button-stack">
                <button className="cmm-btn" onClick={() => onUp()}>▲</button>
                <button className="cmm-btn" onClick={() => onDown()}>▼</button>
            </div>
        </div>
    )

};
export default StackBtn;