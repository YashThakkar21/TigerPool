//----------------------------------------------------------------------
// main.js
// Author: Bob Dondero
//----------------------------------------------------------------------

import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot }  from 'react-dom/client';
import App from './App.jsx';

//----------------------------------------------------------------------

let domRoot = document.getElementById('root');
let reactRoot = createRoot(domRoot);

reactRoot.render(
   <React.StrictMode>
      <App />
   </React.StrictMode>
);
