// this file is converted from javascript to reactjs so some code is not optimized
import React, { useEffect } from "react";
import '../common/style.css';

const MediaProcess = () => {
    useEffect(() => {
        document.getElementById('txtWidth').value = '640';
        document.getElementById('txtHeight').value = '390';

    }, []);

    const onProcess = () => {
        var txtSrcMedia = document.getElementById('txtSrcMedia').value;
        var url = txtSrcMedia;
        if (txtSrcMedia.indexOf('|') !== 0) {
            url = 'https://www.youtube.com/embed/' + txtSrcMedia.substring(txtSrcMedia.lastIndexOf('/') + 1, txtSrcMedia.length).trim();
        } else {
            url = url.substring(1, url.length);
        }
        document.getElementById('iFMedia').src = url;
    };
    const onResize = () => {
        var txtWidth = document.getElementById('txtWidth');
        var txtWidthValue = txtWidth.value;
        var txtHeight = document.getElementById('txtHeight').value;
        document.getElementById('iFMedia').setAttribute("style", `width:${txtWidthValue}px; height:${txtHeight}px`);
    };
    const onPressBtnVerySmall = () => {
        document.getElementById('iFMedia').setAttribute("style", `width:100px; height:80px`);
    };
    const onPressBtnSmall = () => {
        document.getElementById('iFMedia').setAttribute("style", `width:70px; height:50px`);
    };
    const onPressBtnMedium = () => {
        document.getElementById('iFMedia').setAttribute("style", `width:1200px; height:700px`);
    };
    const onPressBtnBig = () => {
        document.getElementById('iFMedia').setAttribute("style", `width:100%; height:1500px`);
    };
    const onHideAll = () => {
        document.getElementById('control').style.display = "none";
    };
    const onShowAll = () => {
        document.getElementById('control').style.display = "block";
    };
    const onChangeWith = (value) => {
        document.getElementById('txtHeight').value = value * 0.7;
    };

    return (
        <div>
            <iframe title="this is a video, clear!" width="420" height="315" id='iFMedia' src="">
            </iframe> <br />
            <div id='control'>
                <input type="text" id="txtSrcMedia" /> <br />
                <input type='submit' value="Load" id='btnExecute' onClick={() => onProcess()} />
                <br />
                <div class='option'>
                    <div class='option-left'>
                        <p>width:</p>
                        <input type="text" id="txtWidth" onChange={(e) => {
                            onChangeWith(e.target.value)
                        }}
                        />
                        <p>Height:</p>
                        <input type="text" id="txtHeight" />
                        <br />
                        <input type='submit' value="Resize" id='btnResize' onClick={() => onResize()} />
                    </div>
                    <div class='option-right'> <br />
                        <input type='submit' value="100x80" id='btnVerySmall' onClick={() => onPressBtnVerySmall()} />
                        <input type='submit' value="70x50" id='btnSmall' onClick={() => onPressBtnSmall()} />
                        <input type='submit' value="1200x700" id='btnMedium' onClick={() => onPressBtnMedium()} />
                        <input type='submit' value="100%" id='btnBig' onClick={() => onPressBtnBig()} />
                        <br /><br />
                        <textarea id='temp'></textarea>
                    </div>
                </div>
                <input type='submit' value="H" id='btnHide' onClick={() => onHideAll()} />
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <input type='submit' value="S" id='btnShow' onClick={() => onShowAll()} />

        </div>
    )

};
export default MediaProcess;