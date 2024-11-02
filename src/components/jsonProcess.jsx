// this file is converted from javascript to reactjs so some code is not optimized
import React, { useEffect, useState } from "react";
import '../common/style.css';
import {checkType,  randomDate, formatDate} from "../common/common.js";

const JsonProcess = () => {
    const NEW_LINE = '\n';
    const QUOTES = '"';
    const TAB = '   ';
    const COLON = ':';
    const COMMA = ',';
    const END_LINE = ';';

    var splitLineInputField = '\n';
    var indentSpace = ' ';

    const NUMBER_TYPES = ['Integer ', 'Long ', 'Float '];
    const STRING_TYPES = ['String '];
    const DATE_TYPES = ['Date ', 'Timestamp'];
    const LIST_TYPES = ['List', 'Array'];

    const COMMENT_INDENT = ['//', '/*'];

    const NUMBER_IND = '1';
    const STRING_IND = '2';
    const DATE_IND = '3';
    const OTHER_IND = '4';
    const LIST_IND = '5';
    const ALREADY_HAS_DATA = '6';
    const [dataChar, setDataChar] = useState('|');
    const [masterName, setMasterName] = useState('');
    const [dataLength, setDataLength] = useState(1);

    useEffect(() => {
        document.getElementById('txtField').textContent = 'private Integer inputPsnCd;4';

    },[]);

    const onProcess=()=>{
    // executeBtn.addEventListener('click', () => {

        var jsonResult = '';
        var txtField = document.getElementById('txtField').value;
        var lineInputs = txtField.split(splitLineInputField);
        jsonResult += genData(lineInputs) + '\n';
        document.getElementById('output').value += jsonResult;
    };

    function genData(lineInputs) {
        var indentComData = dataChar;
        var txtMainElementName = masterName;

        var jsonResult = '{' + NEW_LINE;
        jsonResult += TAB + QUOTES + txtMainElementName + QUOTES + COLON + '{' + NEW_LINE;
        for (var j = 0; j < lineInputs.length; j++) {
            var dataStr = '';
            var trLine = lineInputs[j].trim();
            var typeData = getTypeData(trLine);
            if (trLine.includes(indentComData)) {
                var orgLine = lineInputs[j].trim();
                dataStr = orgLine.substring(orgLine.indexOf(indentComData) + 1, orgLine.lastIndexOf(indentComData));
                if (typeData === STRING_IND || typeData === DATE_IND) {
                    dataStr = QUOTES + dataStr + QUOTES;
                }

                typeData = ALREADY_HAS_DATA;
            }



            if (checkType(trLine, COMMENT_INDENT)) {
                trLine = trLine.substring(0, trLine.indexOf('/'));
                trLine = trLine.trim();
            }
            var length = 0;
            length = trLine.substring(trLine.lastIndexOf(END_LINE) + 1, trLine.length).trim();
            if (length.length === 0) {
                length = dataLength;
            }
            if (trLine.length > 0) {
                trLine = trLine.substring(trLine.lastIndexOf(indentSpace), trLine.lastIndexOf(END_LINE));
                if (trLine.trim().length > 0) {

                    var randomTemplateStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

                    jsonResult += TAB + TAB + QUOTES + trLine.trim() + QUOTES + COLON
                    if (typeData === NUMBER_IND) {
                        randomTemplateStr = '123456789';
                    }

                    if (typeData === DATE_IND) {
                        dataStr = QUOTES + formatDate(randomDate(new Date(2012, 0, 1), new Date())) + QUOTES;
                    }
                    if (typeData === STRING_IND || typeData === NUMBER_IND) {

                        dataStr = randomStr(length, randomTemplateStr, typeData);
                    }

                    if (typeData === LIST_IND) {
                        dataStr = '[' + NEW_LINE + NEW_LINE + TAB + TAB + ']';
                    }

                    if (typeData === OTHER_IND) {
                        dataStr = 'OTHER'
                    }

                    jsonResult += dataStr.trim() + COMMA + NEW_LINE;

                }
            }

        }
        jsonResult = jsonResult.substring(0, jsonResult.length - 2) + NEW_LINE;
        jsonResult += TAB + '}' + NEW_LINE + '}';

        return jsonResult;
    }

    function getTypeData(trLine) {
        if (checkType(trLine, NUMBER_TYPES)) {
            return NUMBER_IND;
        }
        if (checkType(trLine, STRING_TYPES)) {
            return STRING_IND;
        }
        if (checkType(trLine, DATE_TYPES)) {
            return DATE_IND;
        }
        if (checkType(trLine, LIST_TYPES)) {
            return LIST_IND;
        }
        return OTHER_IND;

    }
    function randomStr(lengthData, randomTemplateStr, typeData) {
        var dataStr = '';
        for (var i = 0; i < lengthData; i++) {
            dataStr += randomTemplateStr.charAt(Math.floor(Math.random() * randomTemplateStr.length));
        }
        if (typeData === STRING_IND) {
            dataStr = QUOTES + dataStr + QUOTES;
        }
        return dataStr;
    }
    const onClearOuput = () =>{
        document.getElementById('output').value = '';
    };
    const onClearField = () =>{
        document.getElementById('txtField').value = '';
    };
    async function pasteData() {
        document.getElementById('txtField').value = await navigator.clipboard.readText();
    }
    const onCoppyOutput = () =>{
        navigator.clipboard.writeText(document.getElementById('output').value);
    };
    const handleChange = (value, typeName) => {

        switch (typeName) {
            case 'dataLength':
                setDataLength(value);
                break;
            case 'masterName':
                setMasterName(value);
                break;
            case 'dataChar':
                setDataChar(value);
                break;
            default:
                break;
        }
    }
    return (
<div>
<div className='option block'>
        <div className='option-left'>
            {/* <!-- <b>Field:</b> --> */}
            <textarea id='txtField'></textarea>
            <br/>
            <input type="text" value={dataChar} onChange={(e) => {
                handleChange(e.target.value, "dataChar")
            }} />
            <input type='submit' value="Clear" onClick={() => onClearField()}/>
            <input type='submit' value="Paste" onClick={() => pasteData()}/>
        </div>
        <div className='option-right'>
        <p>Name:</p> 
            <input type="text" value={masterName} 
            onChange={(e) => {
                handleChange(e.target.value, "masterName")
            }} />
            <br/>
            <p>Default Length:</p> 
            <input type="text" value={dataLength}   onChange={(e) => {
                handleChange(e.target.value, "dataLength")
            }} />
            <br/>
            <br/>
            <select name="formatDate" id="formatDate">
                <option value="yyyy-mm-dd">yyyy-mm-dd</option>
                <option value="yyyy/mm/dd">yyyy/mm/dd</option>
                <option value="yyyymmdd">yyyymmdd</option>
                <option value="dd-mm-yyyy">dd-mm-yyyy</option>
                <option value="dd/mm/yyyy">dd/mm/yyyy</option>
                <option value="ddmmyyyy">ddmmyyyy</option>
            </select>
            <br/>
            <br/>
            <input type='submit' value="exc" onClick={() => onProcess()}/>
        </div>
    </div>

    <div className='block '>
        <input type='submit' value="Clear" onClick={() => onClearOuput()}/>
        <input type='submit' value="Copy" onClick={() => onCoppyOutput()}/>
        {/* <!-- <p>result:</p> --> */}
        <textarea id='output'></textarea>
        <br/><br/><br/>
        <textarea id='tmp'></textarea>
    </div>


</div>

    )
}
export default JsonProcess;