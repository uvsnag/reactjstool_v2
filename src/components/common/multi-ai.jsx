import { useEffect } from "react";
import _ from 'lodash';
import AICk from './ai-board';
import './style-common-module.css';

const MulAI = (props) => {

    useEffect(() => {
    }, []);
    return (
        <div class ='container-block'>
            {/* Create an array of a specific length and then map over it */}
            {Array.from({ length: props.size - 1 }).map((_, index) => (
                <div class = 'block'><AICk key={index} index={index} /></div>
            ))}

        </div>
    )

};
export default MulAI;