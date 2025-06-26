//----------------------------------------------------------------------
// AppAddRide.jsx
// Author: TigerPool
//----------------------------------------------------------------------

import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import RideInput from "./RideInput.jsx";

//----------------------------------------------------------------------

function AppAddRide() {
  return (
    <div style={{ backgroundColor: '#AA92DD', minHeight: '100vh' }}>
      <Header a={true}  />
      <RideInput a={true} />
      <Footer a={true} />
    </div>
  );
}

//----------------------------------------------------------------------

export default AppAddRide;
