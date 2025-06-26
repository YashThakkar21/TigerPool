//----------------------------------------------------------------------
// add_ride_script.js
// Author: TigerPool
//----------------------------------------------------------------------

import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import AppAddRide from "./AppAddRide.jsx";

//----------------------------------------------------------------------

let domRoot = document.getElementById("root");
let reactRoot = createRoot(domRoot);

reactRoot.render(
  <React.StrictMode>
    <AppAddRide />
  </React.StrictMode>
);
