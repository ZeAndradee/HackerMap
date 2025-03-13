import L from "leaflet";
import { saveUserLocation } from "../services/LocationService";

// Fix for default marker icons in Leaflet with React
export const initializeLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
};

// Get user's current position
export const getUserPosition = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          reject(error);
        }
      );
    } else {
      const error = new Error("Geolocation is not supported by this browser.");
      console.error(error);
      reject(error);
    }
  });
};

// Default map position (London)
export const DEFAULT_MAP_POSITION = [-8.057777949367594, -34.88291167381032];

// Start tracking user location with specified interval
export const startLocationTracking = (
  userId,
  interval = 60000,
  onLocationUpdate = null
) => {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported by this browser.");
    return null;
  }

  // Options for the geolocation API
  const options = {
    enableHighAccuracy: true, // Use GPS if available
    maximumAge: 0, // Don't use cached position
    timeout: 10000, // Time to wait for a position
  };

  // Function to get and save position
  const trackPosition = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });

      const locationData = {
        userId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date().toISOString(),
        // Optional additional data
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
      };

      // Call the callback if provided
      if (onLocationUpdate && typeof onLocationUpdate === "function") {
        onLocationUpdate(locationData);
      }

      // Save to database
      await saveUserLocation(locationData);

      console.log("Location saved:", locationData);
      return locationData;
    } catch (error) {
      console.error("Error tracking position:", error);
      throw error;
    }
  };

  // Track immediately on start
  trackPosition().catch(console.error);

  // Set up interval for tracking
  const trackingId = setInterval(trackPosition, interval);

  // Return tracking ID so it can be stopped later
  return trackingId;
};

// Stop tracking user location
export const stopLocationTracking = (trackingId) => {
  if (trackingId) {
    clearInterval(trackingId);
    console.log("Location tracking stopped");
  }
};
