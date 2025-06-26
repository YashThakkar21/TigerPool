//----------------------------------------------------------------------
// AppHome.jsx
// Author: TigerPool
//----------------------------------------------------------------------

import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import GetRides from "./GetRides.jsx";
import { Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

//----------------------------------------------------------------------

function AppHome() {
  return (
    <div style={{ backgroundColor: '#AA92DD', minHeight: '100vh' }}>
      <Header a={true}/>
      <Container className="pb-4 position-relative">
        <div className="my-4">
          <GetRides a={true} />
        </div>
        <div className="sticky-bottom d-flex justify-content-center" style={{bottom: '20px', zIndex: 1000 }}>
          <Button 
            href="/addride" 
            variant="primary" 
            className="shadow-lg"
            style={{ 
              backgroundColor: '#6851a4',
              borderColor: '#6851a4',
              color: 'white',
              borderRadius: '8px',
              padding: '8px 20px',
              transition: 'background-color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#7a62b8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#6851a4'}
          >
            Create New Ride <i className="bi bi-plus-circle-fill"></i>
          </Button>
        </div>
        <Footer/>
      </Container>
    </div>
  );
}

//----------------------------------------------------------------------

export default AppHome;
