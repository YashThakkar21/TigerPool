//----------------------------------------------------------------------
// Footer.jsx
// Author: TigerPool
//----------------------------------------------------------------------

import React from "react";

//----------------------------------------------------------------------

function Footer(props) {
  let authenticated = props.a;

 


  return (
    <div className="container text-center py-4" style={{ color: 'white' }}>
      <p className="mb-0" style={{ fontSize: '1.1rem', fontWeight: '500' }}>
        {"Created by TigerPool"}
      </p>
    </div>
  );
}

export default Footer;
