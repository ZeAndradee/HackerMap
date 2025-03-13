import React, { useState } from "react";
import useLocationTracking from "../../hooks/useLocationTracking";

const LocationTracker = ({
  userId = "anonymous",
  interval = 60000,
  autoStart = false,
  onLocationUpdate = null,
  buttonStyle = {},
}) => {
  const { isTracking, currentLocation, error, startTracking, stopTracking } =
    useLocationTracking(userId, interval, autoStart);

  // Call the parent component's callback if provided
  React.useEffect(() => {
    if (currentLocation && onLocationUpdate) {
      onLocationUpdate(currentLocation);
    }
  }, [currentLocation, onLocationUpdate]);

  // Basic styling for the button
  const defaultButtonStyle = {
    padding: "10px 15px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: isTracking ? "#ff4d4f" : "#52c41a",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    margin: "10px 0",
    ...buttonStyle,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        margin: "10px",
      }}
    >
      <button
        style={defaultButtonStyle}
        onClick={isTracking ? stopTracking : startTracking}
        disabled={!!error}
      >
        {isTracking ? "Stop Location Tracking" : "Start Location Tracking"}
      </button>

      {error && <div style={{ color: "red", marginTop: "5px" }}>{error}</div>}

      {currentLocation && (
        <div style={{ marginTop: "10px" }}>
          <h4>Current Location:</h4>
          <p>Latitude: {currentLocation.latitude.toFixed(6)}</p>
          <p>Longitude: {currentLocation.longitude.toFixed(6)}</p>
          <p>Accuracy: {currentLocation.accuracy.toFixed(2)} meters</p>
          <p>
            Timestamp: {new Date(currentLocation.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationTracker;
