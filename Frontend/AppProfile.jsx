//----------------------------------------------------------------------
// AppProfile.jsx
// Author: TigerPool
//----------------------------------------------------------------------

import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import UserInfo from "./UserInfo.jsx";
import GetMyRides from "./GetMyRides.jsx"

//----------------------------------------------------------------------

function AppProfile() {
  return (
    <div style={{ backgroundColor: '#AA92DD', minHeight: '100vh' }}>
      <Header a={true} />
      <UserInfo a={true} />
      <GetMyRides a={true} />
      <Footer a={true} />
    </div>
  );
}

//----------------------------------------------------------------------

export default AppProfile;
