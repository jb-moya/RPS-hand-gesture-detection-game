import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { CursorPositionProvider } from './CursorPositionDetection.js';

ReactDOM.render(
  <CursorPositionProvider>
    <App />
  </CursorPositionProvider>, 
  document.getElementById('root'));
registerServiceWorker();


// ReactDOM.render(<App />, 
//   document.getElementById('root'));
// registerServiceWorker();
