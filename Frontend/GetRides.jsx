//----------------------------------------------------------------------
// GetRides.jsx
// Author: TigerPool
//----------------------------------------------------------------------

import React, { useEffect, useState, useRef, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Loader } from "@googlemaps/js-api-loader";
import { REACT_APP_GOOGLE_MAPS_API_KEY } from "./config";

import { Button, Modal } from "react-bootstrap";
import MapModal from "./MapModal.jsx";

//----------------------------------------------------------------------

function GetRides(props) {
  // Defines the states of this page
  const [submitted, setSubmitted] = React.useState(false);
  const [joinedRide, setJoined] = React.useState(false);
  const [leftRide, setLeft] = React.useState(false);
  const [deletedRide, setDel] = React.useState(false);
  const [rides, setRides] = useState([]);

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

  const [pickupRad, setPickupRad] = useState("");
  const [destRad, setDestRad] = useState("");
  const [date, setDate] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [username, setUsername] = React.useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const pickupInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const [pickupAutocomplete, setPickupAutocomplete] = useState(null);
  const [destinationAutocomplete, setDestinationAutocomplete] = useState(null);
  const [users, setUsers] = React.useState([]);

  const [ride_id, setRideId] = useState(0);
  const [usersLoaded, setUsersLoaded] = useState(true);

  const [show, setShow] = useState(false);

  // Variables and functions for showing the helper modal.
  const [showHelp, setShowHelp] = useState(false);
  const handleHelpShow = () => setShowHelp(true);
  const handleHelpClose = () => setShowHelp(false);

  // const clear = () => {
  //   setLocation("");
  //   setDestination("");
  //   setSelectedLocation({ lat: 0, lng: 0 });
  //   setSelectedDestination({ lat: 0, lng: 0 });
  //   setPickupRad("");
  //   setDestRad("");
  //   setDestRad("");
  //   setDate("")
  //   setTimeFrom(null)
  //   setTimeTo(null);
  //   matchRides();
  // };

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  let authenticated = props.a;

  function matchRides() {
    let pickup_rad = pickupRad;
    let dest_rad = destRad;
    if (location == "") {
      selectedLocation.lat = 0;
      selectedLocation.lng = 0;
    } else {
      if (pickupRad == "") {
        pickup_rad = "1";
        setPickupRad("1");
      } else if (Number(pickupRad) < 1) {
        setPickupRad("");
        alert("Pickup Location Radius must be greater than 1 mile!");
        return;
      }
    }
    if (destination == "") {
      selectedDestination.lat = 0;
      selectedDestination.lng = 0;
    } else {
      if (destRad == "") {
        dest_rad = "1";
        setDestRad("1");
      } else if (Number(destRad) < 1) {
        setDestRad("");
        alert("Destination Radius must be greater than 1 mile!");
        return;
      }
    }
    const queryParams = new URLSearchParams({
      pickup_location: location,
      pickup_lat: selectedLocation.lat,
      pickup_lng: selectedLocation.lng,
      pickup_rad: pickup_rad,
      ride_destination: destination,
      dest_lat: selectedDestination.lat,
      dest_lng: selectedDestination.lng,
      dest_rad: dest_rad,
      ride_date: date,
      time_from: timeFrom,
      time_to: timeTo,
    });

    // console.log(queryParams.toString());

    fetch(`/rides?${queryParams.toString()}`)
      .then((response) => response.json())
      .then((data) => setRides(data))
      .catch((error) => console.error("Error fetching filtered rides:", error));
  }

  function makeButton(button_stat, ride_id) {
    // The ride is full.
    if (button_stat === 0) {
      return "(Full)";
    }
    // Make the Join button.
    if (button_stat === 1) {
      return (
        <input
          type="submit"
          value="Join"
          onClick={(event) => {
            joinRide(ride_id);
          }}
          style={{
            backgroundColor: "#6851a4",
            borderColor: "#6851a4",
            color: "white",
            padding: "5px 15px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#7a62b8")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#6851a4")}
        />
      );
    }
    // Make the Leave button.
    if (button_stat === 2) {
      return (
        <input
          type="submit"
          value="Leave"
          onClick={(event) => {
            leaveRide(ride_id);
          }}
          style={{
            backgroundColor: "#AA92DD",
            borderColor: "#AA92DD",
            color: "white",
            padding: "5px 15px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#b8a3e3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#AA92DD")}
        />
      );
    }
    // Make the Delete button.
    if (button_stat === 3) {
      return (
        <input
          type="submit"
          value="Delete"
          onClick={(event) => {
            delRide(ride_id);
          }}
          style={{
            backgroundColor: "#e57373",
            borderColor: "#e57373",
            color: "white",
            padding: "5px 15px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#ef9a9a")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#e57373")}
        />
      );
    }
    return "Error";
  }

  function get_users_in_ride(ride_id) {
    setUsersLoaded(false);
    fetch("/getusersinride?ride_id=" + ride_id)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setUsersLoaded(true);
      })
      .catch((error) => console.error("Error fetching rides:", error));
  }
  useEffect(() => {
    if (show === true) {
      get_users_in_ride(ride_id);
    }
  }, [show]);

  function joinRide(ride_id) {
    function handleResponse() {
      if (this.status !== 200) {
        alert("Error: Failed to fetch data from server");
        return;
      }
      setSubmitted(true);
      setJoined(true);
      setLeft(false);
      setDel(false);
    }

    function handleError() {
      alert("Error: Failed to fetch data from server");
    }
    // Sends the HTTP request to the server.
    if (!window.confirm("Are you sure you want to join the ride?")) {
      return;
    }
    let url = "/joinride?ride_id=" + encodeURIComponent(ride_id);
    let request = new XMLHttpRequest();
    request.onload = handleResponse;
    request.onerror = handleError;
    request.open("POST", url);
    request.send();
    return () => {
      request.abort();
    };
  }

  function leaveRide(ride_id) {
    function handleResponse() {
      if (this.status !== 200) {
        alert("Error: Failed to fetch data from server");
        return;
      }
      setSubmitted(true);
      setJoined(false);
      setLeft(true);
      setDel(false);
    }

    function handleError() {
      alert("Error: Failed to fetch data from server");
    }
    if (!window.confirm("Are you sure you want to leave this ride?")) {
      return;
    }
    // Sends the HTTP request to the server.
    let url = "/leaveride?ride_id=" + encodeURIComponent(ride_id);
    let request = new XMLHttpRequest();
    request.onload = handleResponse;
    request.onerror = handleError;
    request.open("POST", url);
    request.send();
    return () => {
      request.abort();
    };
  }

  function delRide(ride_id) {
    function handleResponse() {
      if (this.status !== 200) {
        alert("Error: Failed to fetch data from server");
        return;
      }
      setSubmitted(true);
      setJoined(false);
      setLeft(false);
      setDel(true);
    }

    function handleError() {
      alert("Error: Failed to fetch data from server");
    }

    if (!window.confirm("Are you sure you want to delete this ride?")) {
      return;
    }
    // Sends the HTTP request to the server.
    let url = "/delride?ride_id=" + encodeURIComponent(ride_id);
    let request = new XMLHttpRequest();
    request.onload = handleResponse;
    request.onerror = handleError;
    request.open("POST", url);
    request.send();
    return () => {
      request.abort();
    };
  }

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

  useEffect(() => {
    fetch("/rides")
      .then((response) => response.json())
      .then((data) => setRides(data))
      .catch((error) => console.error("Error fetching rides:", error));
  }, []);

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
          updateLocation(
            place.formatted_address,
            place.geometry.location.lat(),
            place.geometry.location.lng()
          );
        });
        setPickupAutocomplete(pickupAutocomplete);
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
        setDestinationAutocomplete(destinationAutocomplete);
      }
    });
  }, []);

  const sortedRides = React.useMemo(() => {
    let sortableRides = [...rides];
    if (sortConfig.key !== null) {
      sortableRides.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableRides;
  }, [rides, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return "↕";
    }
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

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
            <Modal.Title>The Home Page</Modal.Title>
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
              This is the Home Page of TigerPool! Here, you can find all of the
              rides other members of the Princeton community have created in the
              table below. You can filter the displayed rides using the form at
              the top, create your own ride with the Create Ride button at the
              bottom, or access your profile by clicking on your netID.
            </p>

            <hr />

            <h3>Filtering:</h3>
            <p style={{ color: "black" }}>
              At the top of the Home Page is the Search Rides form. Here, you
              can fill in any of the fields of the rides and filter which rides
              are shown to you. Not all fields of Search Rides need to be filled
              out, just click the Match button and the rides corresponding to
              any applied filters will be shown! When filtering for a pickup
              location or destination, the desired radius around the
              corresponding location can be chosen, and any rides within that
              radius will be displayed.
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
              The possible Actions are Join if you would like to join the
              displayed ride, Leave if you no longer wish to be a part of a ride
              you previously joined, and Delete if you no longer want to be a
              part of a ride you previously created. Leaving or Deleting a ride
              will notify all other members in that ride of your decision by
              email.
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

      {
        <Modal
          show={show}
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
            <Modal.Title>Current Riders</Modal.Title>
          </Modal.Header>

          <Modal.Body
            style={{
              backgroundColor: "#f8f5ff",
              padding: "20px",
              margin: "0",
              border: "none",
              borderBottomLeftRadius: "15px",
              borderBottomRightRadius: "15px",
            }}
          >
            {!usersLoaded ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center">No riders found</div>
            ) : (
              users.map((user, index) => (
                <div
                  key={index}
                  style={{
                    padding: "10px",
                    marginBottom: "15px",
                    backgroundColor: "white",
                    borderRadius: "15px",
                    boxShadow: "0 2px 4px rgba(104, 81, 164, 0.1)",
                  }}
                >
                  {user.creator + user.user + "@princeton.edu"}
                </div>
              ))
            )}
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
            <span class="me-auto">*Ride Owner</span>
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
      }
      <div className="container mt-4">
        {!submitted && !joinedRide && !leftRide && !deletedRide && (
          <div>
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
                  href="/profile"
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
                    className="bi bi-person-circle"
                    style={{ pointerEvents: "none" }}
                  ></i>
                  <span style={{ pointerEvents: "none" }}>{username}</span>
                </a>
              </div>
            </div>

            <br />

            <div
              className="card mb-4"
              style={{
                borderColor: "#6851a4",
                boxShadow: "0 4px 8px rgba(104, 81, 164, 0.2)",
                borderRadius: "15px",
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
                <h5 className="mb-0">Search Rides</h5>
              </div>
              <div
                className="card-body"
                style={{
                  backgroundColor: "#f8f5ff",
                  padding: "1.5rem",
                  border: "1px solid #6851a4",
                  borderTop: "none",
                  borderBottomLeftRadius: "15px",
                  borderBottomRightRadius: "15px",
                }}
              >
                <div className="row g-3">
                  <div className="col-md-3">
                    <div
                      style={{
                        color: "#6851a4",
                        marginBottom: "0.5rem",
                        fontWeight: "500",
                      }}
                    >
                      Pickup Location
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div
                      style={{
                        color: "#6851a4",
                        marginBottom: "0.5rem",
                        fontWeight: "500",
                      }}
                    >
                      Destination
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div
                      style={{
                        color: "#6851a4",
                        marginBottom: "0.5rem",
                        fontWeight: "500",
                      }}
                    >
                      Date
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div
                      style={{
                        color: "#6851a4",
                        marginBottom: "0.5rem",
                        fontWeight: "500",
                      }}
                    >
                      Departure Time Range
                    </div>
                  </div>
                  <div className="col-md-1"></div>
                </div>
                <div className="row g-3">
                  <div className="col-md-3">
                    <div style={{ position: "relative" }}>
                      <input
                        ref={pickupInputRef}
                        type="text"
                        className="form-control"
                        placeholder="Pickup Location"
                        name="location"
                        value={location}
                        onChange={(event) => {
                          setLocation(event.target.value);
                        }}
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
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Search Radius (Miles)"
                      name="pickup_rad"
                      value={pickupRad}
                      onChange={(event) => {
                        setPickupRad(event.target.value);
                      }}
                      style={{
                        borderRadius: "10px",
                        borderColor: "#AA92DD",
                        boxShadow: "0 2px 4px rgba(104, 81, 164, 0.1)",
                      }}
                    />
                  </div>
                  <div className="col-md-3">
                    <div style={{ position: "relative" }}>
                      <input
                        ref={destinationInputRef}
                        type="text"
                        className="form-control"
                        placeholder="Destination"
                        name="destination"
                        value={destination}
                        onChange={(event) => {
                          setDestination(event.target.value);
                        }}
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
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Search Radius (Miles)"
                      name="dest_rad"
                      value={destRad}
                      onChange={(event) => {
                        setDestRad(event.target.value);
                      }}
                      style={{
                        borderRadius: "10px",
                        borderColor: "#AA92DD",
                        boxShadow: "0 2px 4px rgba(104, 81, 164, 0.1)",
                      }}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      onInput={(event) => {
                        setDate(event.target.value);
                      }}
                      style={{
                        borderRadius: "10px",
                        borderColor: "#AA92DD",
                        boxShadow: "0 2px 4px rgba(104, 81, 164, 0.1)",
                      }}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="time"
                      className="form-control"
                      name="time_from"
                      onInput={(event) => {
                        setTimeFrom(event.target.value);
                      }}
                      style={{
                        borderRadius: "10px",
                        borderColor: "#AA92DD",
                        boxShadow: "0 2px 4px rgba(104, 81, 164, 0.1)",
                      }}
                    />
                    <input
                      type="time"
                      className="form-control"
                      name="time_to"
                      onInput={(event) => {
                        setTimeTo(event.target.value);
                      }}
                      style={{
                        borderRadius: "10px",
                        borderColor: "#AA92DD",
                        boxShadow: "0 2px 4px rgba(104, 81, 164, 0.1)",
                      }}
                    />
                  </div>
                  <div className="col-md-1">
                    <button
                      type="button"
                      className="btn w-100 match-button"
                      onClick={matchRides}
                      style={{
                        backgroundColor: "#6851a4",
                        borderColor: "#6851a4",
                        color: "white",
                      }}
                    >
                      Match
                    </button>
                    <br />
                    <a
                  href="/home"
                  className="btn"
                  style={{
                    // backgroundColor: "#6851a4",
                    // borderColor: "#6851a4",
                    color: "#6851a4",
                  }}

                >
                 
                  <span style={{ pointerEvents: "none" }}>Clear</span>
                </a>
                    
                  </div>
                </div>
              </div>
            </div>

            <div
              className="table-responsive"
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(104, 81, 164, 0.2)",
              }}
            >
              <table
                className="table table-hover"
                style={{
                  borderColor: "#AA92DD",
                  backgroundColor: "#D6CDEA",
                  marginBottom: "0",
                }}
              >
                <thead style={{ backgroundColor: "#735eaa" }}>
                  <tr style={{ backgroundColor: "#735eaa", color: "white" }}>
                    <th
                      onClick={() => requestSort("pickup_location")}
                      style={{
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        backgroundColor: "#735eaa",
                        color: "white",
                      }}
                    >
                      Pickup Location {getSortIcon("pickup_location")}
                    </th>
                    <th
                      onClick={() => requestSort("ride_destination")}
                      style={{
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        backgroundColor: "#735eaa",
                        color: "white",
                      }}
                    >
                      Destination {getSortIcon("ride_destination")}
                    </th>
                    <th
                      onClick={() => requestSort("ride_date")}
                      style={{
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        backgroundColor: "#735eaa",
                        color: "white",
                      }}
                    >
                      Ride Date {getSortIcon("ride_date")}
                    </th>
                    <th
                      onClick={() => requestSort("ride_time")}
                      style={{
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        backgroundColor: "#735eaa",
                        color: "white",
                      }}
                    >
                      Ride Time {getSortIcon("ride_time")}
                    </th>
                    <th
                      onClick={() => requestSort("ride_occupants")}
                      style={{
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        backgroundColor: "#735eaa",
                        color: "white",
                      }}
                    >
                      Occupants {getSortIcon("ride_occupants")}
                    </th>
                    <th
                      style={{
                        whiteSpace: "nowrap",
                        backgroundColor: "#735eaa",
                        color: "white",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRides.map((ride) => (
                    <tr
                      key={ride.ride_id}
                      style={{
                        borderColor: "#AA92DD",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                      }}
                      onClick={(e) => {
                        // Prevent modal from opening if clicking on action buttons
                        if (e.target.tagName === "INPUT") {
                          return;
                        }
                        setRideId(ride.ride_id);
                        setShow(true);
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e8e3f5")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#D6CDEA")
                      }
                    >
                      <td>{ride.pickup_location}</td>
                      <td>{ride.ride_destination}</td>
                      <td>{ride.ride_date}</td>
                      <td>{new Date(`1970-01-01T${ride.ride_time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            color: "#6851a4",
                            fontWeight: "500",
                          }}
                        >
                          {ride.ride_occupants}/{ride.ride_size}
                        </span>
                      </td>
                      <td>{makeButton(ride.button_stat, ride.ride_id)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {joinedRide && (
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
              <p style={{ marginBottom: "0" }}>You have joined a ride!</p>
            </div>
            <div className="d-grid gap-2 d-md-block">
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
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#7a62b8";
                  e.target.style.boxShadow =
                    "0 4px 8px rgba(104, 81, 164, 0.3)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#6851a4";
                  e.target.style.boxShadow =
                    "0 2px 4px rgba(104, 81, 164, 0.2)";
                }}
              >
                Return to Home
              </a>
              <a
                href="/profile"
                className="btn"
                style={{
                  backgroundColor: "transparent",
                  color: "#6851a4",
                  border: "2px solid #6851a4",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#f0ebfa";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                View Your Ride
              </a>
            </div>
          </div>
        )}
        {leftRide && (
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
              <p style={{ marginBottom: "0" }}>You have left a ride!</p>
            </div>
            <div className="d-grid gap-2 d-md-block">
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
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#7a62b8";
                  e.target.style.boxShadow =
                    "0 4px 8px rgba(104, 81, 164, 0.3)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#6851a4";
                  e.target.style.boxShadow =
                    "0 2px 4px rgba(104, 81, 164, 0.2)";
                }}
              >
                Return to Home
              </a>
              <a
                href="/profile"
                className="btn"
                style={{
                  backgroundColor: "transparent",
                  color: "#6851a4",
                  border: "2px solid #6851a4",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#f0ebfa";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                View Your Profile
              </a>
            </div>
          </div>
        )}
        {deletedRide && (
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
              <p style={{ marginBottom: "0" }}>You have deleted a ride!</p>
            </div>
            <div className="d-grid gap-2 d-md-block">
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
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#7a62b8";
                  e.target.style.boxShadow =
                    "0 4px 8px rgba(104, 81, 164, 0.3)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#6851a4";
                  e.target.style.boxShadow =
                    "0 2px 4px rgba(104, 81, 164, 0.2)";
                }}
              >
                Return to Home
              </a>
              <a
                href="/profile"
                className="btn"
                style={{
                  backgroundColor: "transparent",
                  color: "#6851a4",
                  border: "2px solid #6851a4",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#f0ebfa";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                View Your Profile
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GetRides;
