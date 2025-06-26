//----------------------------------------------------------------------
// GetMyRides.jsx
// Author: TigerPool
//----------------------------------------------------------------------

import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import MapModal from "./MapModal.jsx";

import { Loader } from "@googlemaps/js-api-loader";
import { REACT_APP_GOOGLE_MAPS_API_KEY } from "./config";

function GetMyRides(props) {
  const [loaded, setLoaded] = useState(false);

  const [endpoint, setEndpoint] = React.useState("/mycurrentrides");

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
  // Defines the states of this page
  const [submitted, setSubmitted] = React.useState(false);
  const [joinedRide, setJoined] = React.useState(false);
  const [leftRide, setLeft] = React.useState(false);
  const [deletedRide, setDel] = React.useState(false);
  const [rides, setRides] = useState([]);
  const [location, setLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
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

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  let authenticated = props.a;

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
    // Sends the HTTP request to the server.
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
    // Sends the HTTP request to the server.
    if (!window.confirm("Are you sure you want to join the ride?")) {
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
    // Sends the HTTP request to the server.
    if (!window.confirm("Are you sure you want to delete the ride?")) {
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
          setLocation(place.formatted_address);
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
          setDestination(place.formatted_address);
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
  useEffect(() => {
    setLoaded(false);
    fetch(endpoint)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setRides(data);
      })
      .then(() => setLoaded(true))
      .catch((error) => console.error("Error fetching rides:", error));
  }, [endpoint]);

  return (
    <div>
      <div className="container mt-4">
        {!submitted && !joinedRide && !leftRide && !deletedRide && (
          <div>
            <div
              className="d-flex justify-content-start"
              style={{ marginBottom: "0" }}
            >
              <div
                className="btn-group"
                role="group"
                style={{
                  boxShadow: "0 2px 4px rgba(104, 81, 164, 0.2)",
                  borderRadius: "8px 8px 0 0",
                  overflow: "hidden",
                  marginBottom: "0",
                  border: "1px solid #735eaa",
                  borderBottom: "none",
                }}
              >
                <button
                  onClick={() => {
                    setEndpoint("/mycurrentrides");
                  }}
                  style={{
                    backgroundColor:
                      endpoint === "/mycurrentrides" ? "#735eaa" : "#f8f5ff",
                    borderColor: "#735eaa",
                    color: endpoint === "/mycurrentrides" ? "white" : "#735eaa",
                    padding: "8px 24px",
                    border: "none",
                    borderRight: "1px solid #735eaa",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    if (endpoint !== "/mycurrentrides") {
                      e.target.style.backgroundColor = "#f0ebfa";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (endpoint !== "/mycurrentrides") {
                      e.target.style.backgroundColor = "#f8f5ff";
                    }
                  }}
                >
                  Current Rides
                </button>
                <button
                  onClick={() => {
                    setEndpoint("/mypreviousrides");
                  }}
                  style={{
                    backgroundColor:
                      endpoint === "/mypreviousrides" ? "#735eaa" : "#f8f5ff",
                    borderColor: "#735eaa",
                    color:
                      endpoint === "/mypreviousrides" ? "white" : "#735eaa",
                    padding: "8px 24px",
                    border: "none",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    if (endpoint !== "/mypreviousrides") {
                      e.target.style.backgroundColor = "#f0ebfa";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (endpoint !== "/mypreviousrides") {
                      e.target.style.backgroundColor = "#f8f5ff";
                    }
                  }}
                >
                  Previous Rides
                </button>
              </div>
            </div>

            <div
              className="table-responsive"
              style={{
                borderRadius: "0 10px 10px 10px",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(104, 81, 164, 0.2)",
                marginTop: "0",
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
                  {loaded &&
                    sortedRides.map((ride) => (
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
                        <td>
                          {new Date(
                            `1970-01-01T${ride.ride_time}`
                          ).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </td>
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
                        {endpoint === "/mycurrentrides" && (
                          <td>{makeButton(ride.button_stat, ride.ride_id)}</td>
                        )}
                        {endpoint === "/mypreviousrides" && <td>N/A</td>}
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
                  e.target.style.boxShadow =
                    "0 4px 8px rgba(104, 81, 164, 0.3)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#6851a4";
                  e.target.style.boxShadow =
                    "0 2px 4px rgba(104, 81, 164, 0.2)";
                }}
              >
                <i
                  className="bi bi-house-fill"
                  style={{ pointerEvents: "none" }}
                ></i>
                <span style={{ pointerEvents: "none" }}>Return to Home</span>
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
                  className="bi bi-person-circle"
                  style={{ pointerEvents: "none" }}
                ></i>
                <span style={{ pointerEvents: "none" }}>View Your Ride</span>
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
                  e.target.style.boxShadow =
                    "0 4px 8px rgba(104, 81, 164, 0.3)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#6851a4";
                  e.target.style.boxShadow =
                    "0 2px 4px rgba(104, 81, 164, 0.2)";
                }}
              >
                <i
                  className="bi bi-house-fill"
                  style={{ pointerEvents: "none" }}
                ></i>
                <span style={{ pointerEvents: "none" }}>Return to Home</span>
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
                  className="bi bi-person-circle"
                  style={{ pointerEvents: "none" }}
                ></i>
                <span style={{ pointerEvents: "none" }}>View Your Profile</span>
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
                  e.target.style.boxShadow =
                    "0 4px 8px rgba(104, 81, 164, 0.3)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#6851a4";
                  e.target.style.boxShadow =
                    "0 2px 4px rgba(104, 81, 164, 0.2)";
                }}
              >
                <i
                  className="bi bi-house-fill"
                  style={{ pointerEvents: "none" }}
                ></i>
                <span style={{ pointerEvents: "none" }}>Return to Home</span>
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
                  className="bi bi-person-circle"
                  style={{ pointerEvents: "none" }}
                ></i>
                <span style={{ pointerEvents: "none" }}>View Your Profile</span>
              </a>
            </div>
          </div>
        )}
      </div>

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

          {/* Inline styling to fix close button color */}
          <style>{`
            .modal-header .btn-close {
              filter: invert(1);
              background-color: transparent;
            }
          `}</style>
        </Modal>
      }
    </div>
  );
}

export default GetMyRides;
