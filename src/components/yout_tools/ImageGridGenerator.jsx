import React from 'react';
import { useState, useRef } from 'react';
import { useImageUploader } from './useImageUploader';
import '../../common/style.css';
import html2canvas from 'html2canvas';

let lstImg = null;
let invert = ['N', 'Y']
let randomForInvert = 0;
const ImageGridGenerator = () => {
    const [cols, setCols] = useState(5);
    const [rows, setRows] = useState(6);
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [gridImages, setGridImages] = useState([]);
    const [color, setColor] = useState('#ffffff'); // Default color
    const [options, setOptions] = useState(['short', 'long']);
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [selectedInvertOption, setSelectedInvertOption] = useState(invert[0]);
    const handleColorChange = (e) => {
        setColor(e.target.value);
    };

    const handleCangeCols = (e) => {
        setCols(e.target.value);
    };
    const handleSetRows = (e) => {
        setRows(e.target.value);
    };

    const handleImage1Upload = (e) => {
        console.log()
        let fileLst = e.target.files;
        if (fileLst.length > 1) {
            setImage1(URL.createObjectURL(e.target.files[0]));
            setImage2(URL.createObjectURL(e.target.files[1]));
            console.log(fileLst)
            lstImg = fileLst;
        } else {
            setImage1(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleImage2Upload = (e) => {
        setImage2(URL.createObjectURL(e.target.files[0]));
    };

    const generateGrid = () => {
        setImagetoGrig(image1, image2)
    };
    const tableRef = useRef(null);

    const captureAndSaveAllTable = async () => {
        console.log(lstImg)
        if (!lstImg) {
            return;
        }
        if (selectedInvertOption === 'Y') {
            for (let file of Array.from(lstImg)) {
                setImagetoGrig(URL.createObjectURL(file), null)
                await delay(200); // 20
                await saveTable()
            }
        } else {
            let newArr = Array.from(lstImg).map(itm => {
                let nameWithoutExtension = itm.name.split('.').slice(0, -1).join('.');
                itm.subNm = nameWithoutExtension.slice(0, -1);
                return itm
            })
            const grouped = newArr.reduce((acc, file) => {
                if (!acc[file.subNm]) {
                    acc[file.subNm] = [];
                }
                acc[file.subNm].push(file);
                return acc;
            }, {});
            console.log(Object.values(grouped))
            for (let element of Object.values(grouped)) {
                if ((element.length != 2)) {
                    alert('image is not 2 object');
                }
                let file1, file2

                for (let file of element) {
                    let nameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
                    let lastChar = nameWithoutExtension.slice(-1);
                    if (lastChar == 'a') {
                        // setImage1(URL.createObjectURL(file));
                        file1 = URL.createObjectURL(file);
                    } else {
                        // setImage2(URL.createObjectURL(file));
                        file2 = URL.createObjectURL(file);
                    }
                    console.log(file)
                }
                setImagetoGrig(file1, file2)
                await delay(200); // 20
                await saveTable()
            }
        }
    };
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const captureAndSaveTable = async () => {
        saveTable()
    };
    const saveTable = async () => {
        console.log(tableRef)
        if (tableRef.current) {
            const canvas = await html2canvas(tableRef.current);
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'table-screenshot.png';
            link.click();
        }
    };
    const setImagetoGrig = (file1, file2) => {
        if ((!file1 || !file2) && selectedInvertOption != 'Y') {
            alert('some images is null');
            return
        };
        let images;
        if (selectedInvertOption === 'Y') {
            images = Array(cols * rows).fill(file1);
            randomForInvert = Math.floor(Math.random() * (cols * rows));
        } else {
            images = Array(cols * rows - 1).fill(file1);  // Create an array of 8 image1
            const randomIndex = Math.floor(Math.random() * (cols * rows));
            images.splice(randomIndex, 0, file2);  // Insert image2 at a random position
        }
        setGridImages(images);
    };
    const handleChangeType = (e) => {
        setSelectedOption(e.target.value);
        if ('short' === e.target.value) {
            setRows(6);
            setCols(5);
        }
        if ('long' === e.target.value) {
            setRows(6);
            setCols(12);
        }
    };
    const handleChangeInvert = (e) => {
        setSelectedInvertOption(e.target.value);
    };

    return (
        <div>
            <div className="option block">
                {/* <h1>Image Grid Generator</h1> */}
                <div >
                    <span>Invert:</span>
                    <select value={selectedInvertOption} onChange={handleChangeInvert}>
                        {invert.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select><br />
                    <span>Type video:</span>
                    <select value={selectedOption} onChange={handleChangeType}>
                        {options.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select><br/>
                    <span>Bgr-color:</span> <input
                        type="color"
                        value={color}
                        onChange={handleColorChange}
                        style={{ margin: '20px', width: '100px', height: '50px' }}
                    />
                </div>
                <div >
                <span>Cols:</span> <input type="number" value={cols} onChange={handleCangeCols} /><br />
                <span>Rows:</span><input type="number" value={rows} onChange={handleSetRows} /><br />
                -------------<br/>
                    <input type="file" multiple accept="image/*" onChange={handleImage1Upload} /><br />
                    <input type="file" accept="image/*" onChange={handleImage2Upload} />
                </div>
            </div>
            <div>
                <button onClick={generateGrid}> Generate </button>
                <button onClick={captureAndSaveTable} style={{ marginTop: '20px' }}>Save</button>
                <button onClick={captureAndSaveAllTable} style={{ marginTop: '20px' }}>Save All</button>
            </div>

            <div>
                <div ref={tableRef} style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '10px', marginTop: '20px', marginLeft: '50px', marginBottom: '50px', width: 'fit-content', padding: '10px', backgroundColor: `${color}` }}>
                    {
                        gridImages.map((imgSrc, index) => (
                            <div key={index} style={{ border: '0px solid #ddd', padding: '0px' }}>
                                <img className={`${(selectedInvertOption === 'Y' && randomForInvert === index) ? "flip" : ""}`} src={imgSrc} alt={`grid-item-${index}`} style={{ width: '120px', height: 'auto' }} />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default ImageGridGenerator;
