import L from "leaflet";
// Import leaflet-draw library
import "leaflet-draw";

// Configure drawing controls
export const createDrawControl = (featureGroup, color) => {
  return new L.Control.Draw({
    draw: {
      rectangle: false,
      circle: false,
      circlemarker: false,
      marker: false,
      polyline: false,
      polygon: {
        allowIntersection: false,
        drawError: {
          color: "#e1e100",
          message: "<strong>Error:</strong> Polygon edges cannot cross!",
        },
        shapeOptions: {
          color: color,
          fillColor: color,
          fillOpacity: 0.3,
        },
      },
    },
    edit: {
      featureGroup: featureGroup,
      poly: {
        allowIntersection: false,
      },
    },
  });
};

// Extract coordinates from a drawn layer
export const extractCoordinatesFromLayer = (layer) => {
  // Get the LatLngs from the layer
  const latLngs = layer.getLatLngs()[0];

  // For Polygons in MongoDB, we need coordinates in [longitude, latitude] format (GeoJSON)
  // Leaflet uses [latitude, longitude] format, so we need to swap them
  const coordinates = latLngs.map((coord) => [coord.lng, coord.lat]);

  return coordinates;
};

// Create a polygon object from drawn coordinates
export const createPolygonFromCoordinates = (
  coords,
  name,
  description,
  color,
  id
) => {
  // Create a closed polygon by checking if it's already closed
  let closedCoords = [...coords];

  // If the first and last points are not the same, add the first point again to close the loop
  if (
    coords.length > 0 &&
    (coords[0][0] !== coords[coords.length - 1][0] ||
      coords[0][1] !== coords[coords.length - 1][1])
  ) {
    closedCoords.push([...coords[0]]);
  }

  return {
    id,
    points: closedCoords,
    name: name || `Area ${id}`,
    description: description || "Created area",
    color,
  };
};

// Convert MongoDB GeoJSON coordinates [longitude, latitude] to Leaflet [latitude, longitude]
export const convertMongoToLeafletCoordinates = (mongoCoords) => {
  // Debug input
  console.log("Converting coordinates:", mongoCoords);

  // Check if the input is valid
  if (!mongoCoords || !Array.isArray(mongoCoords) || mongoCoords.length === 0) {
    console.error("Invalid MongoDB coordinates:", mongoCoords);
    return [];
  }

  try {
    // Return array with swapped coordinates order
    const leafletCoords = mongoCoords
      .map((coord) => {
        // Check if coord is an array with at least 2 elements
        if (Array.isArray(coord) && coord.length >= 2) {
          return [coord[1], coord[0]]; // Swap longitude and latitude
        } else {
          console.error("Invalid coordinate pair:", coord);
          return null;
        }
      })
      .filter((coord) => coord !== null);

    console.log("Converted to Leaflet coordinates:", leafletCoords);
    return leafletCoords;
  } catch (error) {
    console.error("Error converting coordinates:", error);
    return [];
  }
};
