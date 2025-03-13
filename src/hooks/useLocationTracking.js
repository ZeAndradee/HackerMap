import { useState, useEffect, useCallback } from "react";
import { startLocationTracking, stopLocationTracking } from "../utils/mapUtils";

/**
 * Custom hook for tracking user location
 * @param {string} userId - User identifier
 * @param {number} interval - Tracking interval in milliseconds (default: 60000 - 1 minute)
 * @param {boolean} autoStart - Whether to start tracking automatically on mount
 * @returns {Object} Location tracking state and control functions
 */
const useLocationTracking = (userId, interval = 60000, autoStart = false) => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState(null);
  const [trackingId, setTrackingId] = useState(null);

  // Callback for location updates
  const handleLocationUpdate = useCallback((locationData) => {
    setCurrentLocation(locationData);
  }, []);

  // Start tracking function
  const startTracking = useCallback(() => {
    if (isTracking) return;

    try {
      const id = startLocationTracking(userId, interval, handleLocationUpdate);
      if (id) {
        setTrackingId(id);
        setIsTracking(true);
        setError(null);
      }
    } catch (err) {
      setError(err.message || "Failed to start location tracking");
      console.error("Error starting location tracking:", err);
    }
  }, [userId, interval, isTracking, handleLocationUpdate]);

  // Stop tracking function
  const stopTracking = useCallback(() => {
    if (trackingId) {
      stopLocationTracking(trackingId);
      setTrackingId(null);
      setIsTracking(false);
    }
  }, [trackingId]);

  // Start tracking on mount if autoStart is true
  useEffect(() => {
    if (autoStart) {
      startTracking();
    }

    // Clean up on unmount
    return () => {
      if (trackingId) {
        stopLocationTracking(trackingId);
      }
    };
  }, [autoStart, startTracking, trackingId]);

  return {
    isTracking,
    currentLocation,
    error,
    startTracking,
    stopTracking,
  };
};

export default useLocationTracking;
