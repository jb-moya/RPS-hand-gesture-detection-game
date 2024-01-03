// import React, { useEffect } from "react";
// import "./App.css";

// import { eel } from "./eel.js";

// const App = () => {
//   const weight = 640;
//   const height = 480;
//   const enable_video_inference = true;
  
//   const setupWebcam = () => {
//     navigator.mediaDevices.getUserMedia({ video: true })
//       .then(function (stream) {
//         document.getElementById('webcam').srcObject = stream;

//         document.getElementById('webcam').onloadedmetadata = function (e) {
//           document.getElementById('webcam').play();
//         };
//       })
//       .catch(function (err) {
//         console.error('Error accessing webcam:', err);
//       });
//   }

//   const captureFrame = async () => {
//     try {
//       console.log("capturing")

//       let video = document.getElementById('webcam');
//       let canvas = document.getElementById('canvas');
//       let context = canvas.getContext('2d');

//       context.drawImage(video, 0, 0, weight, height);

//       canvas.style.display = 'none';

//       let frameData = canvas.toDataURL('image/jpeg');
//       console.log("frameData: " + frameData)
//       let detectedData = await eel.detect(frameData, weight, height);
//       console.log("frameData: " + frameData)
//       console.log("frameData: " + frameData)
//       console.log("frameData: " + frameData)
//       console.log("frameData: " + frameData)
      
//       context.clearRect(0, 0, canvas.width, canvas.height);

//       canvas.style.display = 'block';

//       console.log("detectedData: " + detectedData)
//       console.log("detectedData: " + detectedData)

//       // for (let box of detectedData) {
//       //   let { x1, y1, x2, y2 } = box.coordinates;
//       //   let className = box.class_name;
//       //   let confidence = box.confidence;

//       //   context.drawImage(video, x1, y1, x2 - x1, y2 - y1, x1, y1, x2 - x1, y2 - y1);
//       //   context.beginPath();
//       //   context.lineWidth = "2";
//       //   context.strokeStyle = "red";
//       //   context.rect(x1, y1, x2 - x1, y2 - y1);
//       //   context.stroke();

//       //   context.font = "16px Arial";
//       //   context.fillStyle = "red";
//       //   context.fillText(`${className} (${confidence})`, x1, y1 - 5);
//       // }

//       if (enable_video_inference) {
//         console.log("UULIT DAPAT")
//         // setTimeout(() => captureFrame(), 1000);
//       }

//       captureFrame();
//     } catch (error) {
//       console.error('Error in captureFrame:', error);
//     }
//   }

//   useEffect(() => {
//     eel.set_host("ws://localhost:8888");
//     eel.hello();
//     eel.hello();
//     eel.hello();
//   }, []);

//   useEffect(() => {
//     if (enable_video_inference) {
//       console.log("a;lskdjhf;lkasjdl;kfjasdl;kfjl;skadfj;lsadkfjsldk;fj")
//       // setupWebcam();
//       // captureFrame();
//     }
//   }, [setupWebcam, captureFrame]);

//   return (
//     <div className={`App`}>
//       <video id="webcam" width="640" height="480" autoPlay></video>
//       <canvas id="canvas" width="640" height="480"></canvas>
//     </div>
//   );
// }

// export default App;

// import React, { Component } from "react";
// import logo from "./logo.svg";
// import "./App.css";

// import { eel } from "./eel.js";

// class App extends Component {
//   constructor(props) {
//     super(props);
//     eel.set_host("ws://localhost:8888");
//     eel.hello();
//   }
//   render() {
//     return (<></>);
//   }
// }

// export default App;

// import React, { useEffect } from "react";
// import logo from "./logo.svg";
// import "./App.css";

// import { eel } from "./eel.js";

// const App = () => {
//   useEffect(() => {
//     eel.set_host("ws://localhost:8888");
//     eel.hello();
//   }, []);

//   return <></>;
// };

// export default App;

import React, { useEffect } from "react";
// import { eel } from "./eel.js";

const App = () => {
  const eel = window["eel"];
  eel.set_host("ws://localhost:8888");
  
  useEffect(() => {

    setTimeout(() => {
      eel.hello();
    }, 1000);
  }, []);


  return <></>;
};

export default App;
