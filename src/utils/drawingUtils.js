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
  return layer.getLatLngs()[0].map((coord) => [coord.lat, coord.lng]);
};

// Create a polygon object from drawn coordinates
export const createPolygonFromCoordinates = (
  coords,
  name,
  description,
  color,
  id
) => {
  return {
    id,
    points: [...coords, coords[0]], // Close the polygon
    name: name || `Area ${id}`,
    description: description || "Created area",
    color,
  };
};
