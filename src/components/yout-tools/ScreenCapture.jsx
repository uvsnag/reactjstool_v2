import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import _ from 'lodash';


let lstImg = null;
const MAR_X = 50;
const MAR_Y = 82;
const ScreenCapture = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState({ startX: 0, startY: 0, endX: 0, endY: 0 });
  const [screenshot, setScreenshot] = useState(null);
  const captureAreaRef = useRef(null);
  const [image1, setImage1] = useState(null);
  const [color, setColor] = useState('#e1566b'); // Default color
  const [colorHight, setColorHight] = useState('#dcc4a8'); // Default color
  const tableRef = useRef(null);
  const [options, setOptions] = useState(['Vie', 'Eng']);
  const [selectedOption, setSelectedOption] = useState(options[0]);


  const handleColorChange = (e) => {
    setColor(e.target.value);
  };
  const handleColorChangeHight = (e) => {
    setColorHight(e.target.value);
  };
  const handleChangeType = (e) => {
    setSelectedOption(e.target.value);
    if ('Vie' === e.target.value) {
      setColor('#e1566b')
    }
    if ('Eng' === e.target.value) {
      setColor('#93de56')
    }
};
  const handleMouseDown = (e) => {
    setIsSelecting(true);
    setSelection({
      startX: e.pageX - MAR_X,
      startY: e.pageY - MAR_Y,
      endX: e.pageX - MAR_X,
      endY: e.pageY - MAR_Y
    });
  };
  const handleMouseMove = (e) => {
    if (!isSelecting) return;
    setSelection((prev) => ({
      ...prev,
      endX: e.pageX - MAR_X,
      endY: e.pageY - MAR_Y
    }));
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    takeScreenshot();
  };

  const takeScreenshot = () => {
    const element = captureAreaRef.current;
    const { startX, startY, endX, endY } = selection;
    const buff= 2
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);
    const x = Math.min(startX+buff, endX+buff);
    const y = Math.min(startY+buff, endY+buff);

    // Sử dụng html2canvas để chụp ảnh
    html2canvas(element, {
      x,
      y,
      width,
      height
    }).then((canvas) => {
      setScreenshot(canvas.toDataURL('image/png'));
    });
  };
  const handleImage1Upload = (e) => {
    let fileLst = e.target.files;
    lstImg = Array.from(fileLst);
    setImage1(URL.createObjectURL(fileLst[0]))
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
const next = () => {
  console.log(lstImg)
  if (!_.isEmpty(lstImg)) {
    lstImg.shift();
  }
  if(!_.isEmpty(lstImg)){
    setImage1(URL.createObjectURL(lstImg[0]))
  }
};
const saveAndNext = async () => {
  await saveTable()
  next()
};
  return (
    <div>
       <select value={selectedOption} onChange={handleChangeType}>
                        {options.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
        <span>Bgr-color:</span> <input
        type="color"
        value={color}
        onChange={handleColorChange}
        style={{ width: '50px', height: '20px' }}
      />
        <span>HiLight:</span> <input
        type="color"
        value={colorHight}
        onChange={handleColorChangeHight}
        style={{ width: '50px', height: '20px' }}
      />
      <input type="file" multiple accept="image/*" onChange={handleImage1Upload} />
      <button onClick={next}> Next </button>
      <button onClick={saveAndNext}> Save&Next </button>
      {/* Div để hiển thị ảnh chụp */}
      <div className=''>
        <div style={{float: 'left', width: '700px'}}>
          <div className='user-select-none'
            ref={captureAreaRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              width: '660px', height: '850px', border: '1px solid #000', position: 'relative',
              marginTop: '20px', marginLeft: '50px',
            }}
          >
            {/* <p>Chọn vùng để chụp ảnh màn hình.</p> */}
            <img src={image1} draggable="false" style={{ width: '660px', height: 'auto' }} />
            {/* Hiển thị khung chọn vùng */}
            {isSelecting && (
              <div
                style={{
                  position: 'absolute',
                  top: Math.min(selection.startY, selection.endY),
                  left: Math.min(selection.startX, selection.endX),
                  width: Math.abs(selection.endX - selection.startX),
                  height: Math.abs(selection.endY - selection.startY),
                  border: '1px dashed red',
                  // backgroundColor: 'rgba(255, 0, 0, 0.3)',
                }}
              />
            )}
          </div>
        </div>
        <div style={{float: 'right', width: '630px', marginRight: '260px'}}>
          {screenshot && (
            <div ref={tableRef} style = {{backgroundColor: `${color}`}}>
              {/* <h3>Ảnh chụp màn hình:</h3> */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom :'20px'}}>
                <img style={{ width: '370px', height: 'auto', border: `10px solid ${colorHight}` }} src={screenshot} alt="Screenshot" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom :'20px'}}>
                <img src={image1} draggable="false" style={{ width: '600px', height: 'auto', clipPath: 'inset(0px 0px 35px 0px)'}} />
              </div>
            {/* <div style = {{width: '100%', backgroundColor:'red', zIndex:9999, position:'absolute',
              height:40
            }}></div> */}
            </div>
          )}
        </div>
      </div>
    
    </div>
  );
};

export default ScreenCapture;
