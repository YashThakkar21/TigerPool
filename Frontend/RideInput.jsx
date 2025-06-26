//----------------------------------------------------------------------
// RideInput.jsx
// Author: TigerPool
//----------------------------------------------------------------------

import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Alert,
  Modal,
} from "react-bootstrap";
import { Loader } from "@googlemaps/js-api-loader";
import { REACT_APP_GOOGLE_MAPS_API_KEY } from "./config";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import MapModal from "./MapModal.jsx";

//----------------------------------------------------------------------

function RideInput(props) {
  // Defines the states for this page.
  const [username, setUsername] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  // const [pickup, setPickup] = React.useState("");
  // const [dest, setDest] = React.useState("");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [size, setSize] = React.useState(2);
  const pickupInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const [location, setLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0 });
  const updateLocation = (location, lat, lng) => {
    setLocation(location);
    setSelectedLocation({ lat: lat, lng: lng });
    // console.log(selectedLocation);
  };

  const [destination, setDestination] = useState("");
  const [selectedDestination, setSelectedDestination] = useState({
    lat: 0,
    lng: 0,
  });
  const updateDestination = (location, lat, lng) => {
    setDestination(location);
    setSelectedDestination({ lat: lat, lng: lng });
    // console.log(selectedLocation);
  };

  // Variables and functions for showing the helper modal.
  const [showHelp, setShowHelp] = useState(false);
  const handleHelpShow = () => setShowHelp(true);
  const handleHelpClose = () => setShowHelp(false);

  let authenticated = props.a;

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

  // Parses the input for the group size. If the value is outside of the range [2,6],
  // an alert is sent to the user asking them to set it again.
  function parseSize(input) {
    if (Number(input) !== 0 || input === "0") {
      if (Number(input) < 2) {
        alert(
          "Group size must range from from 2-6 occupants, including yourself."
        );
        setSize("2");
        return;
      }
      if (Number(input) > 6) {
        alert(
          "Group size must range from from 2-6 occupants, including yourself."
        );
        setSize("6");
        return;
      }
      setSize(input);
    } else {
      setSize("");
    }
  }

  // If any of the form inputs are not filled in, this function alerts the user and
  // tells them to do so. Otherwise, the form creates an HTTP request to send the
  // data to the server.
  function submitRide() {
    function notFilledOut(message) {
      alert(message);
      return true;
    }
    function handleResponse() {
      if (this.status !== 200) {
        alert("Error: Failed to fetch data from server");
        return;
      }
      setSubmitted(true);
    }

    function handleError() {
      alert("Error: Failed to fetch data from server");
    }

    // Checks that none of the form inputs are empty.
    if (location === "") {
      alert("Provide a Pick Up Location");
      return;
    }
    if (destination === "") {
      alert("Provide a Destination");
      return;
    }
    if (date === "") {
      alert("Provide a Date of Departure");
      return;
    }
    if (time === "") {
      alert("Provide a Time of Departure");
      return;
    }
    if (size === "") {
      alert("Provide a Maximum Group Size");
      return;
    }
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    // Check if selected date and time is in the past
    if (selectedDateTime < now) {
      alert("Departure time cannot be in the past.");
      return;
    }

    // Checks to make sure the group size is within the bounds.
    if (Number(size) < 2) {
      alert(
        "Group size must range from from 2-6 occupants, including yourself."
      );
      setSize("");
      return;
    }
    if (Number(size) > 6) {
      alert(
        "Group size must range from from 2-6 occupants, including yourself."
      );
      setSize("");
      return;
    }
    // console.log("shouldn't reach");

    // Checks to make sure pickup location is valid.
    if (
      Number(selectedLocation.lat) == 0 &&
      Number(selectedLocation.lng) == 0
    ) {
      alert(
        "Select a valid pickup location by using the autocomplete feature or by selecting a location on the map."
      );
      updateLocation("", 0, 0);
      return;
    }
    // Checks tio make sure destination is valid.
    if (
      Number(selectedDestination.lat) == 0 &&
      Number(selectedDestination.lng) == 0
    ) {
      alert(
        "Select a valid destination by using the autocomplete feature or by selecting a location on the map."
      );
      updateDestination("", 0, 0);
      return;
    }

    // Creates the dictionary of form inputs.
    let inputs = {
      pickup: location,
      pickup_lat: selectedLocation.lat,
      pickup_lng: selectedLocation.lng,
      dest: destination,
      dest_lat: selectedDestination.lat,
      dest_lng: selectedDestination.lng,
      date: date,
      time: time,
      size: size,
    };

    // Sends the HTTP request to the server.
    let url =
      "/createdride?inputs=" + encodeURIComponent(JSON.stringify(inputs));
    let request = new XMLHttpRequest();
    request.onload = handleResponse;
    request.onerror = handleError;
    request.open("POST", url);
    request.send();
    return () => {
      request.abort();
    };
  }

  useEffect(() => {
    const loader = new Loader({
      apiKey: REACT_APP_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      if (pickupInputRef.current) {
        const pickupAutocomplete = new window.google.maps.places.Autocomplete(
          pickupInputRef.current,
          {
            types: ["geocode", "establishment"],
            componentRestrictions: { country: "us" },
          }
        );
        pickupAutocomplete.addListener("place_changed", () => {
          const place = pickupAutocomplete.getPlace();
          // console.log(place);
          updateLocation(
            place.formatted_address,
            place.geometry.location.lat(),
            place.geometry.location.lng()
          );
        });
      }

      if (destinationInputRef.current) {
        const destinationAutocomplete =
          new window.google.maps.places.Autocomplete(
            destinationInputRef.current,
            {
              types: ["geocode", "establishment"],
              componentRestrictions: { country: "us" },
            }
          );
        destinationAutocomplete.addListener("place_changed", () => {
          const place = destinationAutocomplete.getPlace();
          updateDestination(
            place.formatted_address,
            place.geometry.location.lat(),
            place.geometry.location.lng()
          );
        });
      }
    });
  }, []);

  // Creates the page which varies depending on whether or not the form has been
  // submitted.
  return (
    <Container className="py-4">
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
            <Modal.Title>The Ride Creation Page</Modal.Title>
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
              This is the Ride Creation Page of TigerPool! Here, you can create
              your own ride which will be displayed to other members of the
              Princeton community on TigerPool. Once you've created a ride, you
              are the owner of that ride and can choose to delete it from the
              Home Page or your Profile page. The information you can select for
              your ride is the same as the information found on the Home Page.
              You can click Create Ride to create your ride once all of the
              information is filled out or return to the Home Page by clicking
              Return to Home.
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
              The Maximum Group Size is the greatest number of people you would
              like to have in your rideshare.
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

      <div className="row g-3">
        <div className="col-md-4 d-flex"></div>
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
        </div>{" "}
      </div>

      <br />

      {!submitted && (
        <Card
          className="shadow-sm"
          style={{
            borderRadius: "15px",
            borderColor: "#6851a4",
            boxShadow: "0 4px 8px rgba(104, 81, 164, 0.2)",
            overflow: "hidden",
            border: "none",
          }}
        >
          <div
            style={{
              backgroundColor: "#6851a4",
              color: "white",
              padding: "1rem",
              borderTopLeftRadius: "15px",
              borderTopRightRadius: "15px",
            }}
          >
            <h5 className="mb-0">Create Your Ride</h5>
          </div>
          <Card.Body
            style={{
              backgroundColor: "#f8f5ff",
              padding: "1.5rem",
              border: "1px solid #6851a4",
              borderTop: "none",
              borderBottomLeftRadius: "15px",
              borderBottomRightRadius: "15px",
            }}
          >
            <Form>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="pickupLocation">
                    <Form.Label style={{ color: "#6851a4" }}>
                      Pickup Location
                    </Form.Label>
                    <div style={{ position: "relative" }}>
                      <Form.Control
                        ref={pickupInputRef}
                        type="text"
                        placeholder="Enter pickup location"
                        value={location}
                        onChange={(event) =>
                          updateLocation(event.target.value, 0, 0)
                        }
                        required
                        style={{
                          borderRadius: "10px",
                          borderColor: "#AA92DD",
                          boxShadow: "0 2px 4px rgba(104, 81, 164, 0.1)",
                          paddingRight: "40px",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                        }}
                      >
                        <MapModal
                          setSelectedLocation={setSelectedLocation}
                          setLocation={setLocation}
                          title="Set Pickup Location"
                        />
                      </div>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="destination">
                    <Form.Label style={{ color: "#6851a4" }}>
                      Destination
                    </Form.Label>
                    <div style={{ position: "relative" }}>
                      <Form.Control
                        ref={destinationInputRef}
                        type="text"
                        placeholder="Enter destination"
                        value={destination}
                        onChange={(event) =>
                          updateDestination(event.target.value, 0, 0)
                        }
                        required
                        style={{
                          borderRadius: "10px",
                          borderColor: "#AA92DD",
                          boxShadow: "0 2px 4px rgba(104, 81, 164, 0.1)",
                          paddingRight: "40px",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                        }}
                      >
                        <MapModal
                          setSelectedLocation={setSelectedDestination}
                          setLocation={setDestination}
                          title="Set Destination"
                        />
                      </div>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="date">
                    <Form.Label style={{ color: "#6851a4" }}>
                      Date of Departure
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={date}
                      min={new Date().toLocaleDateString("en-CA")}
                      onChange={(event) => setDate(event.target.value)}
                      required
                      style={{
                        borderRadius: "10px",
                        borderColor: "#AA92DD",
                        boxShadow: "0 2px 4px rgba(104, 81, 164, 0.1)",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="time">
                    <Form.Label style={{ color: "#6851a4" }}>
                      Time of Departure
                    </Form.Label>
                    <Form.Control
                      type="time"
                      value={time}
                      min={
                        date === new Date().toISOString().split("T")[0]
                          ? new Date().toTimeString().slice(0, 5)
                          : undefined
                      }
                      onChange={(event) => setTime(event.target.value)}
                      required
                      style={{
                        borderRadius: "10px",
                        borderColor: "#AA92DD",
                        boxShadow: "0 2px 4px rgba(104, 81, 164, 0.1)",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="groupSize">
                    <Form.Label style={{ color: "#6851a4" }}>
                      Maximum Group Size (2-6)
                    </Form.Label>
                    <Form.Select
                      type="number"
                      onChange={(event) => setSize(event.target.value)}
                      required
                      style={{
                        borderRadius: "10px",
                        borderColor: "#AA92DD",
                        boxShadow: "0 2px 4px rgba(104, 81, 164, 0.1)",
                      }}
                    >
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-center mt-4">
                <Button
                  variant="primary"
                  onClick={submitRide}
                  style={{
                    backgroundColor: "#6851a4",
                    borderColor: "#6851a4",
                    borderRadius: "8px",
                    padding: "8px 20px",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#7a62b8")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#6851a4")
                  }
                >
                  Create Ride
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
      {submitted && (
        <div className="text-center">
          <div
            className="alert"
            role="alert"
            style={{
              backgroundColor: "#f0ebfa",
              borderColor: "#6851a4",
              color: "#6851a4",
              borderRadius: "15px",
              padding: "20px",
              marginBottom: "20px",
              boxShadow: "0 2px 4px rgba(104, 81, 164, 0.1)",
            }}
          >
            <h4
              className="alert-heading"
              style={{ color: "#6851a4", marginBottom: "10px" }}
            >
              Success!
            </h4>
            <p style={{ marginBottom: "0" }}>
              Your ride has been created successfully.
            </p>
          </div>
          <div className="d-flex justify-content-center gap-3">
            <a
              href="/home"
              className="btn me-2"
              style={{
                backgroundColor: "#6851a4",
                color: "white",
                border: "none",
                padding: "8px 20px",
                borderRadius: "8px",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(104, 81, 164, 0.2)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
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
              <i
                className="bi bi-house-fill"
                style={{ pointerEvents: "none" }}
              ></i>
              <span style={{ pointerEvents: "none" }}>Return to Home</span>
            </a>
            <a
              href="/addride"
              className="btn"
              style={{
                backgroundColor: "transparent",
                color: "#6851a4",
                border: "2px solid #6851a4",
                padding: "8px 20px",
                borderRadius: "8px",
                transition: "all 0.2s ease",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#f0ebfa";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <i
                className="bi bi-plus-circle"
                style={{ pointerEvents: "none" }}
              ></i>
              <span style={{ pointerEvents: "none" }}>Add Another Ride</span>
            </a>
          </div>
        </div>
      )}
    </Container>
  );
}

export default RideInput;
