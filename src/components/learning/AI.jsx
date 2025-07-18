import  { useEffect } from "react";
import _ from 'lodash';
import MulAI from '../common/MultiAI.jsx';

const AI = () => {


    useEffect(() => {
    }, []);

    return (
        <div>
            <MulAI size = {3} prefix ='ai' enableHis = {true}></MulAI>
        </div>
    )

};
export default AI;