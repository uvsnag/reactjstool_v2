// import { useState } from 'react';

// export const useImageUploader = () => {
//     const COLS = 3
//     const ROWS = 3
//     const [cols, setCols] = useState(null);
//     const [rows, setRows] = useState(null);
//     const [image1, setImage1] = useState(null);
//     const [image2, setImage2] = useState(null);
//     const [gridImages, setGridImages] = useState([]);

//     const handleCangeCols = (e) => {
//         setCols(URL.createObjectURL(e.target.files[0]));
//     };

//     const handleImage1Upload = (e) => {
//         setImage1(URL.createObjectURL(e.target.files[0]));
//     };

//     const handleImage2Upload = (e) => {
//         setImage2(URL.createObjectURL(e.target.files[0]));
//     };

//     const generateGrid = () => {
//         if (!image1 || !image2) return;

//         let images = Array(8).fill(image1);  // Create an array of 8 image1
//         const randomIndex = Math.floor(Math.random() * (COLS*ROWS));
//         images.splice(randomIndex, 0, image2);  // Insert image2 at a random position
//         setGridImages(images);
//     };

//     return {
//         image1,
//         image2,
//         gridImages,
//         handleImage1Upload,
//         handleImage2Upload,
//         generateGrid,
//         COLS,
//         ROWS
//     };
// };
