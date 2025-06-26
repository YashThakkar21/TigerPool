//----------------------------------------------------------------------
// Header.jsx
// Author: TigerPool
//----------------------------------------------------------------------

import React from "react";
import { Container } from "react-bootstrap";

//----------------------------------------------------------------------

function Header(props) {
  let authenticated = props.a;

  return (
    <div style={{ backgroundColor: "#AA92DD", padding: "1rem 0 0.5rem 0" }}>
      <Container>
        <div
          className="d-flex align-items-center justify-content-between"
          style={{ marginTop: "1rem" }}
        >
          {/* Left side spacer */}
          <div style={{ width: "100px" }}></div>

          {/* Centered title */}
          <div className="flex-grow-1 text-center">
            <h1 style={{ margin: 0 }}>
              <a
                href="/home"
                style={{ color: "white", textDecoration: "none" }}
              >
                <strong>TigerPool</strong>
              </a>
            </h1>
          </div>

          <div className="d-flex justify-content-end" style={{ flexShrink: 0 }}>
            {authenticated && (
              <a
                href="/logoutcas"
                className="btn"
                style={{
                  backgroundColor: "#e57373",
                  color: "white",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 4px rgba(229, 115, 115, 0.2)",
                }}
              >
                Log out{" "}
                <i
                  className="bi bi-box-arrow-right"
                  style={{ color: "white" }}
                ></i>
              </a>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Header;
