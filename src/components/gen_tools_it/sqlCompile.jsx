// this file is converted from javascript to reactjs so some code is not optimized
import React, { useEffect, useState } from "react";
import '../../common/style.css';
import { checkType, replaceArr, randomDate, formatDate, checkIncludesArr } from "../../common/common.js";
import _ from 'lodash';

const ERROR = 'ERROR';
const INT_CHAR = '@i@';
const SqlCompile = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        // document.getElementById('txtSql').textContent = `2020-03-03 09:41:27.057 DEBUG 10495 --- [io-50006-exec-1] c.f.t.d.m.M.countByExample               : ==>  Preparing: SELECT count(*) FROM MessageRecivers WHERE ((ReciverId = ? and ReadStats = ? and ReciverMessageFolder <> ?)) 
        // 2020-03-03 09:41:27.066 DEBUG 10495 --- [io-50006-exec-1] c.f.t.d.m.M.countByExample               : ==> Parameters: 58(Long), 0(Short), 1(Short)`

    }, []);

    const extractSqlQuery = (inputLog) => {
        setMessage('');
        inputLog = document.getElementById('txtSql').value.trim();
        const arrStatement = inputLog.split('\n');
        if(!arrStatement || arrStatement.length != 2){
            showMessage('Invalid statement');
            return;
        }

        let sqlStatement = arrStatement[0];
        let paramStatement = arrStatement[1];

        const SPLIT_SQL_STATEMENT = 'Preparing: ';
        const SPLIT_PARAM_STATEMENT = 'Parameters: ';


         sqlStatement = getStatementBaseOnSplitMark(sqlStatement, SPLIT_SQL_STATEMENT);
         paramStatement = getStatementBaseOnSplitMark(paramStatement, SPLIT_PARAM_STATEMENT);

         if(paramStatement[paramStatement.length-1] != ')'){
            showMessage('Warning: End of statement is not ")"');
         }
        let parametersArr = extractArguments(paramStatement);
        if(ERROR == parametersArr){
            return;
        }
        console.log(sqlStatement);
        console.log(paramStatement);
        console.log(parametersArr);
        const replacedQuery = sqlStatement.split("?").map((_, index) => {
            if (index === 0) return _;
            let str = parametersArr[index - 1];
            return (str.includes(INT_CHAR)?`${str.replaceAll(INT_CHAR, '')}`:`'${str}'`) + _;
        }).join("");
        console.log(replacedQuery)
        document.getElementById('txtresult').textContent = replacedQuery;
        onCoppyOutput();
    }

    const extractArguments = (inputLog) => {
        let arrStrReplace = ["(String)"]
        let arrStrReplaceNumber = ["(Double)","(Integer)"]
        let cusType = document.getElementById('cus-type').value.trim();
        if (!_.isEmpty(cusType)){
            let arrExtType = cusType.split(',')
            for (let tp of arrExtType){
                arrStrReplace.push(`(${tp})`)
            }
            console.log(arrStrReplace)
        }

        // const values = inputLog.split(',').map((val) => val.trim().split(/\((.*?)\)/)[0]);
        // let res = values.map((val) => isNaN(val) ? val : Number(val));

        let res = inputLog.split('), ').map((val) =>{
            if (val[val.length - 1] != ')') {
                val = val + ')';
            }
            if (!checkIncludesArr(val, arrStrReplace, true) && !checkIncludesArr(val, arrStrReplaceNumber, true)) {
                showMessage('Data type is not defined:' + val);
                return ERROR;
            }
            let resTemp = replaceArr(val.trim(), arrStrReplace, "");
            return replaceArr(resTemp, arrStrReplaceNumber, INT_CHAR);
        });

        return res;

    }

    const getStatementBaseOnSplitMark = (statement, splitMark) =>{
        const startIndex = statement.indexOf(splitMark) + splitMark.length;
        return statement.substring(startIndex, statement.length).trim();
    }
    const onCoppyOutput = () =>{
        navigator.clipboard.writeText(document.getElementById('txtresult').value);
    };
    const showMessage = (mes)=>{
        setMessage(mes)
        alert(mes);
    }

    return (
        <div>
            <div className="sql-body">
                <input type = 'text' class='' id='cus-type'></input>
                <a data-toggle="tooltip" title="add more type of param (format input ex: Int,Long) - CODE WILL NOT REMOVE THE SPACE">?</a>
                <div class='message-sql-compile'>{message}</div>
                <textarea class='area-sql' id='txtSql'></textarea><br />
                <input type='submit' value = 'Gen' onClick={() => extractSqlQuery()} />
                {/* <input type='submit' value="Copy" onClick={() => onCoppyOutput()}/> */}
                <textarea class='area-sql' id='txtresult'></textarea>
            </div>
        </div>
    );
}

export default SqlCompile;