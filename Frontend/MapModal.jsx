//----------------------------------------------------------------------
// MapModal.jsx
// Author: TigerPool
//----------------------------------------------------------------------

import React, { useEffect, useState, useRef, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Loader } from "@googlemaps/js-api-loader";
import { REACT_APP_GOOGLE_MAPS_API_KEY } from "./config";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { Button, Modal } from "react-bootstrap";

//----------------------------------------------------------------------

function MapModal(props) {
  let setTextBox = props.setLocation;
  let title = props.title;

  let [selectedLocation, setSelectedLocation] = useState({
    lat: 40.34153,
    lng: -74.65934,
  });
  let parentSetSelect = props.setSelectedLocation;
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(true);
  };

  const handleCancel = () => {
    setShow(false);
  };

  const handleClose = () => {
    setShow(false);
    parentSetSelect(selectedLocation);
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        selectedLocation.lat +
        "," +
        selectedLocation.lng +
        "&key=" +
        REACT_APP_GOOGLE_MAPS_API_KEY
    )
      .then((data) => data.json())
      .then((results) => {
        setTextBox(
          results.results[0].formatted_address,
          selectedLocation.lat,
          selectedLocation.lng
        );
      });
  };

  const handleMapClick = (mapProps) => {
    const lat = mapProps.detail.latLng.lat;
    const lng = mapProps.detail.latLng.lng;
    setSelectedLocation({ lat, lng });
    parentSetSelect({ lat, lng });
  };

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      ></link>
      <Button
        onClick={handleShow}
        style={{
          backgroundColor: "transparent",
          border: "none",
          padding: "0",
          color: "#6851a4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <i className="material-icons" style={{ fontSize: "20px" }}>
          place
        </i>
      </Button>

      <Modal
        show={show}
        onHide={handleCancel}
        size="lg"
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
          <Modal.Title>{title}</Modal.Title>
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
          <APIProvider apiKey={REACT_APP_GOOGLE_MAPS_API_KEY}>
            {show && (
              <Map
                style={{
                  margin: "auto",
                  width: "100%",
                  height: "50vh",
                  borderRadius: "10px",
                }}
                defaultZoom={13}
                defaultCenter={{ lat: 40.34153, lng: -74.65934 }}
                mapId="DEMO_MAP_ID"
                onClick={(mapProps) => {
                  handleMapClick(mapProps);
                  // console.log(mapProps);
                }}
                gestureHandling={"greedy"}
              >
                <Marker position={selectedLocation} />
              </Map>
            )}
          </APIProvider>
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
            variant="secondary"
            onClick={handleCancel}
            style={{
              backgroundColor: "transparent",
              color: "#6851a4",
              border: "2px solid #6851a4",
              borderRadius: "8px",
              padding: "8px 20px",
              marginRight: "10px",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#f0ebfa";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleClose}
            style={{
              backgroundColor: "#6851a4",
              borderColor: "#6851a4",
              color: "white",
              borderRadius: "8px",
              padding: "8px 20px",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(104, 81, 164, 0.2)",
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
            Select Location
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
    </div>
  );
}

export default MapModal;
