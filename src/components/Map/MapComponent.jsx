import React, { useRef, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import MapMarker from "./MapMarker";
import MapPolygon from "./MapPolygon";
import DrawingControls from "./DrawingControls";
import { initializeLeafletIcons } from "../../utils/mapUtils";

// Estilo global para elementos do Leaflet - forçando a fonte Inter

// Initialize Leaflet icons
initializeLeafletIcons();

// Component to handle map view updates
const MapViewController = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [map, position]);

  return null;
};

const MapComponent = ({
  position,
  markers,
  areas,
  isDrawing,
  handleShapeCreated,
  handleShapeDeleted,
  areaColor,
  isMobileView,
}) => {
  const mapRef = useRef(null);

  // Style for full-height map
  const mapStyle = {
    height: "100%",
    width: "100%",
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={mapStyle}
      ref={mapRef}
      zoomControl={false}
      attributionControl={false}
      doubleClickZoom={!isDrawing}
      dragging={true}
      className="full-height-map"
    >
      <MapViewController position={position} />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Styled dark mode tile layer for better contrast and modern look */}
      {/* Uncomment to use a styled map instead of default OSM
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      />
      */}

      {/* Display markers */}
      {markers.map((marker) => (
        <MapMarker key={marker.id} marker={marker} />
      ))}

      {/* Draw controls */}
      {isDrawing && (
        <DrawingControls
          onCreated={handleShapeCreated}
          onDeleted={handleShapeDeleted}
          isDrawing={isDrawing}
          color={areaColor}
          isMobileView={isMobileView}
        />
      )}

      {/* Display saved areas */}
      {areas.map((area, index) => (
        <MapPolygon key={area.id || index} area={area} />
      ))}

      {/* Attribution control in custom position */}
      <div className="map-attribution">Contribuidores do OpenStreetMap</div>
    </MapContainer>
  );
};

export default MapComponent;
