//----------------------------------------------------------------------
// App.jsx
// Author: TigerPool
//----------------------------------------------------------------------

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

//----------------------------------------------------------------------

function App() {
  const [showPolicy, setShowPolicy] = useState(false);
  const handleShow = () => setShowPolicy(true);
  const handleClose = () => setShowPolicy(false);

  return (
    <div
      style={{
        backgroundColor: "#AA92DD",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "2.75rem",
            fontWeight: "600",
            marginBottom: "0.3rem",
            color: "white",
          }}
        >
          Welcome to TigerPool
        </h1>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "300",
            marginBottom: "2.0rem",
            color: "white",
          }}
        >
          Ridesharing Made Easy
        </h1>
        <h2
          style={{
            fontSize: "1.2rem",
            fontWeight: "200",
            marginBottom: "2.5rem",
            color: "white",
          }}
        >
          TigerPool is a ride planning application which lets you find trips
          other members of the Princeton community are planning on taking and
          would like to split the cost for through ridesharing. If you can't
          find a ride that suits your schedule, you can create your own and wait
          for people to join!
        </h2>
        <a
          href="/home"
          className="btn btn-primary"
          style={{
            backgroundColor: "#6851a4",
            borderColor: "#6851a4",
            padding: "12px 30px",
            fontSize: "1.1rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(104, 81, 164, 0.2)",
            transition: "all 0.2s ease",
            display: "inline-block",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#7a62b8";
            e.target.style.boxShadow = "0 4px 8px rgba(104, 81, 164, 0.3)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#6851a4";
            e.target.style.boxShadow = "0 2px 4px rgba(104, 81, 164, 0.2)";
          }}
        >
          Click here to login
        </a>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={handleShow}
          style={{
            background: "none",
            border: "none",
            color: "white",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Privacy Policy
        </button>
      </div>

      <Modal
        show={showPolicy}
        onHide={handleClose}
        centered
        contentClassName="custom-modal"
        style={{
          borderRadius: "15px",
          overflow: "hidden",
          backgroundColor: "transparent",
          padding: "0",
          border: "none",
          boxShadow: "none",
        }}
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#6851a4",
            color: "white",
            border: "none",
            padding: "1rem",
            margin: "0",
          }}
        >
          <Modal.Title>Privacy Policy</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "#f8f5ff",
            padding: "20px",
            margin: "0",
            border: "none",
            borderBottomLeftRadius: "15px",
            borderBottomRightRadius: "15px",
            color: "black",
          }}
        >
          <p style={{ color: "black" }}>
            TigerPool values your privacy. This application collects only the
            data necessary to facilitate ride sharing and never shares your
            information with third parties.
          </p>
          <p style={{ color: "black" }}>
            By using TigerPool, you agree to our practices regarding data use
            and storage. If you have concerns, please contact <a href="mailto:cs-tigerpool@princeton.edu">cs-tigerpool@princeton.edu</a>.
          </p>
          <p style={{ color: "black" }}>
           When using TigerPool you are bound by Princeton University's Rights, Rules and Responsibilities. Please act accordingly. 
          </p>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: "#f8f5ff",
            borderTop: "none",
            borderBottomLeftRadius: "15px",
            borderBottomRightRadius: "15px",
            padding: "15px 20px",
            margin: "0",
            border: "none",
          }}
        >
          <Button
            variant="primary"
            onClick={handleClose}
            style={{
              backgroundColor: "#6851a4",
              borderColor: "#6851a4",
              borderRadius: "15px",
              padding: "8px 20px",
            }}
          >
            Close
          </Button>
        </Modal.Footer>
        <style>{`
          .modal-header .btn-close {
            filter: invert(1);
            background-color: transparent;
          }
        `}</style>
      </Modal>
    </div>
  );
}

//----------------------------------------------------------------------

export default App;
