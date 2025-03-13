import React, { useEffect, useState } from "react";
import styles from "./LocationTrackingPage.module.css";
import { Link } from "react-router-dom";
import { updateUserLocation } from "../../services/LocationService";

const LocationTrackingPage = () => {
  const [tracking, setTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [userId] = useState("user-123"); // Replace with actual user ID when available

  useEffect(() => {
    let watchId = null;
    let intervalId = null;

    const startTracking = () => {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        return;
      }

      // Options for geolocation
      const options = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      };

      // Send location data function
      const sendLocationData = async (position) => {
        try {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString(),
          };

          setLocation(locationData);
          setLastUpdate(new Date());

          // Update location using PATCH request
          await updateUserLocation(userId, locationData);
          console.log("Location updated via PATCH:", locationData);
        } catch (err) {
          console.error("Error updating location:", err);
        }
      };

      // Get position once immediately
      navigator.geolocation.getCurrentPosition(
        (position) => sendLocationData(position),
        (err) => setError(`Error: ${err.message}`),
        options
      );

      // Set up interval to send data every 20 seconds
      intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => sendLocationData(position),
          (err) => console.error("Error getting location:", err),
          options
        );
      }, 20000); // 20 seconds
    };

    if (tracking) {
      startTracking();
    }

    // Cleanup function
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [tracking, userId]);

  const toggleTracking = () => {
    setTracking((prev) => !prev);
  };

  return (
    <div className={styles.simplePage}>
      <div className={styles.simpleCard}>
        <h1>Location Sender</h1>

        <div className={styles.statusText}>
          {tracking ? (
            <span className={styles.activeStatus}>
              Updating location every 20 seconds
            </span>
          ) : (
            <span className={styles.inactiveStatus}>Tracking paused</span>
          )}
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {location && (
          <div className={styles.locationData}>
            <p>
              Lat: {location.latitude.toFixed(6)}, Lng:{" "}
              {location.longitude.toFixed(6)}
            </p>
            {lastUpdate && (
              <p>Last update: {lastUpdate.toLocaleTimeString()}</p>
            )}
          </div>
        )}

        <button
          className={tracking ? styles.stopButton : styles.startButton}
          onClick={toggleTracking}
        >
          {tracking ? "Stop Updating" : "Start Updating"}
        </button>

        <Link to="/" className={styles.homeLink}>
          Back to Map
        </Link>
      </div>
    </div>
  );
};

export default LocationTrackingPage;
