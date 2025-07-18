// this file is converted from javascript to reactjs so some code is not optimized
import React, { useEffect, useState } from "react";
import '../../common/style.css';
import { checkType, replaceArr, randomDate, formatDate, checkIncludesArr } from "../../common/common.js";
import _ from 'lodash';

const SqlProcess = () => {
    // const NEW_LINE = '\n';
    const SPLIT_LINE_INPUT_FIELD = '^';
    const INDENT_BEGIN_FIELD_LENGTH = '(';
    const INDENT_FIELD_LENGTH_END = ')';
    const INDENT_COMMA = ',';
    const INDENT_SPACE = ' ';
    const DATA_NULL = 'NULL';
    const CREATE_TABLE = 'CREATE TABLE';

    const ARR_NOT_FIELDNAME = [' FOREIGN KEY ', 'PRIMARY ', CREATE_TABLE + ' ', 'ENGINE=', 'ENGINE =', 'CHARSET =', 
         'CHARSET=' , 'SEGMENT', ' CREATION ', 'REFERENCES "', 'CONSTRAINT "'];
    const INDENT_FIELD_NAME = ['"', '`', `'`];

    const NUMBER_TYPE = [' NUMBER', ' NUMERIC', ' LONG', ' INT', ' INTEGER', ' TINYINT', ' BIGINT', ' DECIMAL'
    , ' FLOAT', ' REAL', ' SMALLMONEY', ' MONEY', ' SMALLINT'];
    const DATE_TYPE = [' DATE', ' TIMESTAMP', ' DATETIME', ' TIME', ' SMALLDATETIME', ' DATETIME2', ' DATETIMEOFFSET '];
    const NOT_NULL = ['NOT NULL'];
    const ARR_REPLACE_LENGHT = ['CHAR'];

    const [defaultValueInt, setDefaultValueInt] = useState(3);
    const [lineNumber, setLineNumber] = useState(1);
    const [dataCharFixed, setDataCharFixed] = useState('|');
    //const [dataCharUnique, setDataCharUnique] = useState('*');//for changeable on screen
    const dataCharUnique ='*'
    const [tableName, setTableName] = useState('');
    const [replaceFrom, setReplaceFrom] = useState('');
    const [replaceTo, setReplaceTo] = useState('');
    const [result, setResult] = useState('');

    const [uniqueMap, setUniqueMap] = useState(new Map());

    const STR_INSERT_INTO = 'INSERT INTO ';
    const STR_VALUE = ') VALUES (';
    const STR_UPDATE = 'UPDATE ';
    const STR_SET = ' SET ';
    const STR_WHERE = ' WHERE ';
    const STR_DELETE_FROM = 'DELETE FROM ';
    const STR_SELECT = 'SELECT ';
    const STR_FROM = ' FROM ';

    useEffect(() => {
        document.getElementById('txtField').textContent = '"FFSFD" NUMBER(3,0|fgfgfgd|),';
        document.getElementById('dataTemplate').value = '?';

    }, []);

    const getListLineField = () => {

        var txtField = document.getElementById('txtField').value;
        txtField = txtField.replaceAll('\n', SPLIT_LINE_INPUT_FIELD)
        var lineInputs = txtField.split(SPLIT_LINE_INPUT_FIELD);
        return lineInputs;
    }
    const onProcess = () => {
        var chkDeleteOldData = document.getElementsByClassName('chkDeleteOldData');
        var sqlResult = '';
        var cmbType = document.getElementById("cmbType").value;

        if (cmbType === 'ddl') {
            var lineInputs = getListLineField();
            for (var i = 1; i <= lineNumber; i++) {
                sqlResult += genDataInput(lineInputs) + '\n';
            }
            if (chkDeleteOldData[0].checked) {
                setResult(sqlResult);
            } else {
                setResult(result + '\n' + sqlResult);
            }
        }
    }
    const getStrWithUpperCaseOption = (str) => {
        var cmbTypeChar = document.getElementById("cmbTypeChar").value;
        return ((cmbTypeChar === 'upper') ? str : str.toLowerCase());
    }
    const getTableName = (lineInputs) => {
        var formatFieldName = document.getElementById('cmbformatFeildName').value;
        var tableNameDefault = null;
        //getname
        if (checkIncludesArr(lineInputs[0], [CREATE_TABLE,], false)) {
            var arrayRepl = [CREATE_TABLE, '('];
            tableNameDefault = replaceArr(lineInputs[0], arrayRepl, '').trim();
            if (formatFieldName === 'delete') {
                tableNameDefault = replaceArr(tableNameDefault, INDENT_FIELD_NAME, '');
            }
        }
        return ((_.isNull(tableName) || tableName.length === 0) ? tableNameDefault : tableName);
    }
    const onGenCodeSql = () => {
        var dataTemplate = document.getElementById('dataTemplate').value;
        var chkDeleteOldData = document.getElementsByClassName('chkDeleteOldData');
        var lineInputs = getListLineField();
        var cmbSql = document.getElementById("cmbSql").value;
        var resultStr = '';

        switch (cmbSql) {
            case 'insert':
                resultStr = genFieldNameInsert(lineInputs);
                resultStr += getStrWithUpperCaseOption(STR_VALUE);
                for (let i = 0; i < lineInputs.length; i++) {
                    if (checkLineIsField(lineInputs[i])) {
                        resultStr += `${dataTemplate},`;
                    }
                }
                resultStr = resultStr.substring(0, resultStr.length - 1) + ');';
                break;
            case 'update':
                var arrFieldName = getArrayFieldName(lineInputs);
                resultStr = getStrWithUpperCaseOption(STR_UPDATE);
                resultStr += getTableName(lineInputs);
                resultStr += getStrWithUpperCaseOption(STR_SET);
                for (let i = 0; i < arrFieldName.length; i++) {
                    var fieldName = arrFieldName[i];
                    resultStr += (fieldName + ' = ' + dataTemplate);
                    resultStr += (i === arrFieldName.length - 1) ? '' : ', ';
                }
                resultStr += getStrWithUpperCaseOption(STR_WHERE);
                break;
            case 'delete':
                resultStr = getStrWithUpperCaseOption(STR_DELETE_FROM);
                resultStr += getTableName(lineInputs);
                resultStr += getStrWithUpperCaseOption(STR_WHERE);
                break;
            case 'select':
                var arrFieldNameS = getArrayFieldName(lineInputs);
                resultStr = getStrWithUpperCaseOption(STR_SELECT);
                for (let i = 0; i < arrFieldNameS.length; i++) {
                    var fieldNameS = arrFieldNameS[i];
                    resultStr += fieldNameS;
                    resultStr += (i === arrFieldNameS.length - 1) ? '' : ', ';
                }
                resultStr += getStrWithUpperCaseOption(STR_FROM);
                resultStr += getTableName(lineInputs);
                resultStr += getStrWithUpperCaseOption(STR_WHERE);
                break;
            default:
                break;
        }
        if (chkDeleteOldData[0].checked) {
            setResult(resultStr);
        } else {
            setResult(result + '\n' + resultStr);
        }
    }

    const checkLineIsField = (trLine) => {
        if (trLine.trim().length === 0 || checkIncludesArr(trLine, ARR_NOT_FIELDNAME, false)) {
            return false;
        }
        return true;
    }
    const getArrayFieldName = (lineInputs) => {
        var formatFieldName = document.getElementById('cmbformatFeildName').value;
        var arrFieldName = [];
        for (var i = 0; i < lineInputs.length; i++) {
            var trLine = lineInputs[i].trim();
            if (checkLineIsField(trLine)) {
                var fieldName = trLine.substring(0, trLine.indexOf(INDENT_SPACE));
                if (formatFieldName === 'delete') {
                    fieldName = replaceArr(fieldName, INDENT_FIELD_NAME, '');
                }
                if(fieldName.trim().startsWith('(')){
                    fieldName = fieldName.trim().substring(1);
                }
                arrFieldName.push(fieldName.trim());
            }
        }
        return arrFieldName;
    }
    const genFieldNameInsert = (lineInputs) => {
        // var flagComa = false;
        var sqlResult = getStrWithUpperCaseOption(STR_INSERT_INTO) + getTableName(lineInputs) + '(';
        var arrFieldName = getArrayFieldName(lineInputs);
        for (var i = 0; i < arrFieldName.length; i++) {
            var fieldName = arrFieldName[i].trim();
            sqlResult += fieldName;
            sqlResult += (i === arrFieldName.length - 1) ? '' : ', ';
        }
        return sqlResult;
    }

    function genDataInput(lineInputs) {
        if (_.isEmpty(lineInputs)) {
            return;
        }
        var cmbTypeChar = document.getElementById("cmbTypeChar").value;
        var sqlResult = genFieldNameInsert(lineInputs);

        sqlResult += ((cmbTypeChar === 'upper') ? STR_VALUE : STR_VALUE.toLowerCase());
        var flagComa = false;
        for (var j = 0; j < lineInputs.length; j++) {
            var trLine = lineInputs[j].trim().toUpperCase();
            var typeNumber = false;
            // var notNull = false;
            if (checkLineIsField(trLine)) {

                var indentComData = dataCharFixed;
                var dataStr = '';
                var lengthData = 0;
                if (trLine.includes(indentComData)) {
                    var orgLine = lineInputs[j].trim();
                    dataStr = orgLine.substring(orgLine.indexOf(indentComData) + 1, orgLine.lastIndexOf(indentComData));
                } else if (trLine.includes(dataCharUnique)) {
                    let fieldName = trLine.substring(0, trLine.indexOf(INDENT_SPACE));
                    let strValueField = "";
                    strValueField = uniqueMap.get(fieldName);
                    if (_.isEmpty(strValueField)) {
                        let intValue = trLine.substring(trLine.indexOf(dataCharUnique) + 1, trLine.lastIndexOf(dataCharUnique));
                        setUniqueMap(uniqueMap.set(fieldName, String(intValue)));
                        dataStr = String(intValue);
                    } else {
                        let arrValue = strValueField.split(',');
                        let arrValueInt = arrValue.map(Number);
                        let maxvalue = Math.max.apply(Math, arrValueInt) + 1;

                        setUniqueMap(uniqueMap.set(fieldName, strValueField + ',' + (maxvalue)));
                        dataStr = String(maxvalue);
                    }
                 if (!checkType(trLine, NUMBER_TYPE)) {
                    dataStr = 'a'+dataStr;
                 }
                } else {
                    if (checkType(trLine, NOT_NULL)) {
                        // notNull = true;
                        trLine = replaceArr(trLine, NOT_NULL, '');
                    }
                    trLine = trLine.trim();
                    if (trLine.substring(trLine.length - 1, trLine.length) !== INDENT_COMMA) {
                        trLine = trLine + INDENT_COMMA;
                    }
                    var randomTemplateStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    if (checkType(trLine, NUMBER_TYPE)) {
                        randomTemplateStr = '123456789';
                        typeNumber = true;
                        lengthData = defaultValueInt;
                    }
                    if (checkType(trLine, DATE_TYPE)) {
                        dataStr = formatDate(randomDate(new Date(2012, 0, 1), new Date()));
                    } else {
                        if (trLine.split(",").length - 1 === 2) {
                            dataStr = genNuberWComman(trLine, randomTemplateStr);
                        } else {

                            if (lengthData === 0) {
                                trLine = trLine.trim();
                                lengthData = trLine.substring(trLine.lastIndexOf(INDENT_BEGIN_FIELD_LENGTH) + 1, trLine.indexOf(INDENT_FIELD_LENGTH_END));
                                lengthData= replaceArr(lengthData, ARR_REPLACE_LENGHT, '').trim();
                            }
                            dataStr = randomStr(lengthData, randomTemplateStr);
                        }
                    }
                    var numOfCharater = document.getElementById("numOfCharater").value;
                    if (numOfCharater === DATA_NULL) {
                        dataStr = DATA_NULL;
                    }

                }
                if (flagComa === true) {
                    sqlResult += ', ';
                }
                flagComa = true
                if (dataStr.toUpperCase() === DATA_NULL) {
                    typeNumber = true;
                }
                sqlResult += typeNumber ? dataStr : '\'' + dataStr + '\'';

            }

        }
        sqlResult += ');';

        return sqlResult;
    }

    function genNuberWComman(trLine, randomTemplateStr) {
        var dataStr = '';
        var firstNumber = trLine.substring(trLine.lastIndexOf(INDENT_BEGIN_FIELD_LENGTH) + 1, trLine.indexOf(INDENT_COMMA));
        var secondNumber = trLine.substring(trLine.indexOf(INDENT_COMMA) + 1, trLine.indexOf(INDENT_FIELD_LENGTH_END));
        secondNumber = replaceArr(secondNumber, ARR_REPLACE_LENGHT, '').trim();
        var data1 = randomStr(firstNumber - secondNumber - 1, randomTemplateStr);
        var data2 = randomStr(secondNumber, randomTemplateStr);

        dataStr = data2 !== 0 ? data1 + '.' + data2 : data1;

        var numOfCharater = document.getElementById("numOfCharater").value;
        if (numOfCharater === '1') {
            dataStr = data1;
        }
        if (numOfCharater === 'mid' && data1 > 1) {
            dataStr = dataStr.substring(1, dataStr.length);
        }
        return dataStr;
    }
    function randomStr(lengthData, randomTemplateStr) {
        var dataStr = '';
        var numOfCharater = document.getElementById("numOfCharater").value;
        if (numOfCharater === 'mid' && numOfCharater > 1) {
            lengthData = lengthData / 2;
        }
        if (numOfCharater === '1') {
            lengthData = 1;
        }

        for (var i = 0; i < lengthData; i++) {
            dataStr += randomTemplateStr.charAt(Math.floor(Math.random() * randomTemplateStr.length));
        }
        return dataStr;
    }
    const onClearOuput = () => {
        setResult('');
        setUniqueMap(new Map());
    };
    const onClearField = () => {
        document.getElementById('txtField').value = '';
    };
    async function pasteData() {
        document.getElementById('txtField').value = await navigator.clipboard.readText();
    };
    const onCoppyOutput = () => {
        navigator.clipboard.writeText(result);
    };
    const replace = () => {
        if (!_.isEmpty(replaceFrom) && !_.isEmpty(replaceTo)) {
            setResult(result.replaceAll(replaceFrom, replaceTo))
        }
    };
    const handleChange = (value, typeName) => {

        switch (typeName) {
            case 'defaultValueInt':
                setDefaultValueInt(value);
                break;
            case 'lineNumber':
                setLineNumber(value);
                break;
            case 'dataCharFixed':
                setDataCharFixed(value);
                break;
            case 'tableName':
                setTableName(value);
                break;
            case 'replace-from':
                setReplaceFrom(value);
                break;
            case 'replace-to':
                setReplaceTo(value);
                break;
            default:
                break;
        }
    }

    return (
        <div className="sql-body">

            <div className='option block' >
                <div className='option-left'>
                    <b>Field:</b>
                    <textarea id='txtField'></textarea>
                    <br />
                    <b>type:</b>
                    <select name="cmbType" id="cmbType">
                        <option value="ddl">ddl</option>
                        {/* <!-- <option value="excel">excel</option> --> */}
                    </select>
                    <input type="text" value={dataCharFixed}
                        onChange={(e) => {
                            handleChange(e.target.value, "dataCharFixed")
                        }} />
                    <input type='submit' value="Clear" id='btnCleanField' onClick={() => onClearField()} />
                    <input type='submit' value="Paste" id='btnPasteField' onClick={() => pasteData()} />
                </div>
                <div className='option-right'>
                    <div>Table Name(leave it empty If have CREATE TABLE statement):</div>
                    <input type="text" id="txtTableName" value={tableName}
                        onChange={(e) => {
                            handleChange(e.target.value, "tableName")
                        }} />
                    <br />
                    <div>Default value Int lenght:</div>
                    <input type="text" value={defaultValueInt}
                        onChange={(e) => {
                            handleChange(e.target.value, "defaultValueInt")
                        }} />
                    <br />
                    <div>Line number:</div>
                    <input type='number' value={lineNumber}
                        onChange={(e) => {
                            handleChange(e.target.value, "lineNumber")
                        }} />
                    <br />
                    <div>
                        <select name="numOfCharater" id="numOfCharater">
                            <option value="max">max</option>
                            <option value="mid">mid</option>
                            <option value="1">1</option>
                            <option value="NULL">NULL</option>
                        </select>
                    </div>
                    <div>
                        <select name="formatDate" id="formatDate">
                            <option value="yyyy-mm-dd">yyyy-mm-dd</option>
                            <option value="yyyy/mm/dd">yyyy/mm/dd</option>
                            <option value="yyyymmdd">yyyymmdd</option>
                            <option value="dd-mm-yyyy">dd-mm-yyyy</option>
                            <option value="dd/mm/yyyy">dd/mm/yyyy</option>
                            <option value="ddmmyyyy">ddmmyyyy</option>
                        </select>
                    </div>
                    <div>
                        <select name="cmbformatFeildName" id="cmbformatFeildName">
                            <option value="none">none</option>
                            <option value="delete">Delete format indent</option>
                        </select>
                    </div>
                    <select name="cmbTypeChar" id="cmbTypeChar">
                        <option value="upper">Upper</option>
                        <option value="lower">Lower</option>
                    </select>
                    <input type='submit' value="exc" id='btnExecute' onClick={() => onProcess()} />
                    <br />
                    <div>----------</div>
                    <div>
                        <select name="cmbSql" id="cmbSql">
                            <option value="insert">insert</option>
                            <option value="update">update</option>
                            <option value="delete">delete</option>
                            <option value="select">select</option>
                        </select>
                    </div>
                    <div>Data template:</div>
                    <input type="text" id='dataTemplate' />

                    <br />
                    <input type='submit' value="genCodeSql" id='btnGenCodeSql' onClick={() => onGenCodeSql()} />
                </div>
            </div>
            <div class="tooltip">???
                <span class="tooltiptext">Coppy full character DLL and paste into Field<br /><br /> | - data set cứng. VD: "COL" NUMBER(3,0|abc|) - data =abc ,<br /> * -unique gia tri tự tăng. VD: "FFSFD" NUMBER(3,0*2*) , inititial value =2. Clear textbox để reset gia tri ban dau </span>
            </div>
            <div className='block '>
                <input type='submit' value="Clear" id='btnClean' onClick={() => onClearOuput()} />
                <input className='chkDeleteOldData' type='checkbox' />
                <input type='submit' value="Copy" id='btnCoppy' onClick={() => onCoppyOutput()} />
                <div>Replace</div>
                <input type='text' value={replaceFrom}
                    onChange={(e) => {
                        handleChange(e.target.value, "replace-from")
                    }} />
                <div> to</div>
                <input type='text' value={replaceTo}
                    onChange={(e) => {
                        handleChange(e.target.value, "replace-to")
                    }} />
                <input type='submit' value="replace" id='btnCoppy' onClick={() => replace()} />
                {/* <!-- <p>result:</p> --> */}
                <textarea id='output' value={result}></textarea>
                <br /><br /><br />
                <textarea id='tmp'></textarea>
            </div>

        </div>
    );
}

export default SqlProcess;