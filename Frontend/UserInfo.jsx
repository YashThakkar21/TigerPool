//----------------------------------------------------------------------
// UserInfo.jsx
// Author: TigerPool
//----------------------------------------------------------------------

import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

//----------------------------------------------------------------------

function UserInfo(props) {
  let authenticated = props.a;

  const [username, setUsername] = React.useState("");

  // Variables and functions for showing the helper modal.
  const [showHelp, setShowHelp] = useState(false);
  const handleHelpShow = () => setShowHelp(true);
  const handleHelpClose = () => setShowHelp(false);

  function fetchUserName() {
    function handleResponse() {
      if (this.status !== 200) {
        alert("Error: Failed to fetch data from server");
        return;
      }
      setUsername(this.response);
    }
    function handleError() {
      alert("Error: Failed to fetch data from server");
    }
    let url = "/getusername";
    let request = new XMLHttpRequest();
    request.onload = handleResponse;
    request.onerror = handleError;
    request.open("GET", url);
    request.send();
  }
  if (authenticated) {
    React.useEffect(fetchUserName, []);
  }

  return (
    <div>
      {
        <Modal
          show={showHelp}
          onHide={handleHelpClose}
          centered
          contentClassName="custom-modal"
          style={{
            borderRadius: "15px",
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
            <Modal.Title>The Profile Page</Modal.Title>
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
            <h3>Summary:</h3>
            <p style={{ color: "black" }}>
              This is your Profile Page of TigerPool! Here, you can find all of
              the rides you are currently in from either joining them or
              creating them under the Current Rides tab as well as all of the
              rides you have joined or created in the past under the Previous
              Rides tab. You can interact with any rides you are currently in
              just as you would on the Home Page. You can return to the Home
              page by clicking Return to Home.
            </p>

            <hr />

            <h3>Sorting:</h3>
            <p style={{ color: "black" }}>
              You can sort the ordering of the rides in ascending or descending
              order by their Pickup Location, Destination, Ride Date, Ride Time,
              or Occupants by pressing on the category title.
            </p>

            <hr />

            <h3>Ride Information:</h3>
            <p style={{ color: "black" }}>
              The Pickup Location is the place where you would like to meet up
              to start your rideshare with the other group members.
            </p>
            <p style={{ color: "black" }}>
              The Destination is the place where you would like to take the
              rideshare to.
            </p>
            <p style={{ color: "black" }}>
              The Ride Date is the day the ride will take place.
            </p>
            <p style={{ color: "black" }}>
              The Ride Time is the time at which you would like to meet up with
              the other group members to start your rideshare.
            </p>
            <p style={{ color: "black" }}>
              The Occupants display how many people are currently in a ride as
              well as the maximum number of people that can join that ride.
            </p>
            <p style={{ color: "black" }}>
              The possible Actions are Leave if you no longer wish to be a part
              of a ride you previously joined and Delete if you no longer want
              to be a part of a ride you previously created. Leaving or Deleting
              a ride will notify all other members in that ride of your decision
              by email. You cannot join a ride on this page, since you are
              already in all of the displayed rides.
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
              onClick={handleHelpClose}
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
      }

      <div className="container mt-4">
        <div className="row g-3">
          <div className="col-md-4 d-flex justify-content-center"></div>
          {/* Centered Help Text */}
          <div className="col-md-4 d-flex justify-content-center">
            <button
              onClick={handleHelpShow}
              style={{
                background: "none",
                border: "none",
                color: "white",
                textDecoration: "underline",
                cursor: "pointer",
                fontSize: "0.95rem",
              }}
            >
              Unsure of what to do next? Click here for help!
            </button>
          </div>

          <div className="col-md-4 d-flex justify-content-end">
            <a
              href="/home"
              className="btn"
              style={{
                borderColor: "#AA92DD",
                color: "white",
                borderRadius: "8px",
                padding: "8px 20px",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#6851a4";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "#AA92DD";
              }}
            >
              <i
                className="bi bi-house-fill"
                style={{ pointerEvents: "none" }}
              ></i>
              <span style={{ pointerEvents: "none" }}>Return to Home</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
