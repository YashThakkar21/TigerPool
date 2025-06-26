//----------------------------------------------------------------------
// home_script.js
// Author: TigerPool
//----------------------------------------------------------------------

import React from "react";
import { createRoot } from "react-dom/client";
import GetRides from "./GetRides.jsx";
import AppHome from "./AppHome.jsx";

let domRoot = document.getElementById("root");
let reactRoot = createRoot(domRoot);

reactRoot.render(
  <React.StrictMode>
    <AppHome />
  </React.StrictMode>
);
