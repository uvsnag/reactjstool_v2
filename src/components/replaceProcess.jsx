// this file is converted from javascript to reactjs so some code is not optimized
//state is not used in this file
import React, { useEffect } from "react";
import '../common/style.css';

const ReplaceProcess = () => {

    useEffect(() => {

        document.getElementById('regex').textContent = 'a^g';
        document.getElementById('splitRegex').value = '`';
        document.getElementById('splitChildRegex').value = '^';
        var inputfile = document.getElementById('inputfile');
        inputfile.style.display = "none";
    },[]);
    
    var split = '\n';

    const onProcess =()=>{
        var ele = document.getElementsByName('typeInput');
        var txtArr = [];
        var typeInput = '';
        var regex = document.getElementById('regex').value;

        for (let i = 0; i < ele.length; i++) {
            if (ele[i].checked)
                typeInput = ele[i].value;
        }
        if (typeInput === 'file') {
            var file = document.getElementById('inputfile');
            var fr = new FileReader();
            fr.onload = function () {
                var lineInputs = this.result.split(split);
                txtArr = processingReplace(lineInputs, regex, txtArr);
            }
            fr.onloadend = function () {
                console.log(txtArr);
                document.getElementById('output').textContent = txtArr.join(split);
            }

            fr.readAsText(file.files[0]);
        } else {
            var txtIntput = document.getElementById('txtIntput').value;

            var lineInputs = txtIntput.split(split);
            txtArr = processingReplace(lineInputs, regex, txtArr);
            document.getElementById('output').textContent = txtArr.join(split);

        }
    };

    function processingReplace(lineInputs, regex, txtArr) {
        var trSplitLine = document.getElementById('splitRegex').value;
        var trSplitElement = document.getElementById('splitChildRegex').value;
        for (var i = 0; i < lineInputs.length; i++) {
            if (regex !== '') {

                var trLines = regex.split(trSplitLine);
                var trResult = lineInputs[i];
                for (var trLine = 0; trLine < trLines.length; trLine++) {
                    var trElements = trLines[trLine].split(trSplitElement);
                    trResult = trResult.replaceAll(trElements[0], trElements[1]);
                }
                txtArr.push(trResult);
            }
        }
        return txtArr;
    }
    const onChooseText =() =>{
        var txtIntput = document.getElementById('txtIntput');
        var inputfile = document.getElementById('inputfile');
        inputfile.style.display = "none";
        txtIntput.style.display = "block";

    };
    const onChooseRadio =() =>{
        var txtIntput = document.getElementById('txtIntput');
        var inputfile = document.getElementById('inputfile');
        inputfile.style.display = "block";
        txtIntput.style.display = "none";

    };
return(
    <div>
        <div class='option block'>
        <div>
            <div id="rdTypeInput">
                <input type="radio" id="rdFile" name="typeInput" value="file" onClick={() => onChooseRadio()}/> File
                <input type="radio" id="rdText" name="typeInput" value="text" checked="checked" onClick={() => onChooseText()}/> Text
            </div>
            <br/>
            {/* <!-- <input type="text" id="splitInput"> --> */}
            <br/>
            <input type="text" id="splitRegex"/>
            <br/>
            <input type="text" id="splitChildRegex"/>
        </div>
    </div>
    <div class='dataInput block'>
        <div class='option-left'>
            <div>input</div>
            <input type="file" accept="text/plain" name="inputfile" id="inputfile"/>
            <textarea id='txtIntput'></textarea>
        </div>
        <div class='option-right'>
            <div>#$%^*()</div>
            <textarea id='regex'></textarea>
            <br/>
        </div>
    </div>
    <br/>
    <input type='submit' id='execute' value='exc' onClick={() => onProcess()}/>
    <div class='block'>
        <p>result:</p>
        <textarea id='output'></textarea>
    </div>
    </div>

)
}
export default ReplaceProcess;