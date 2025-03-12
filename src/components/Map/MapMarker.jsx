import React from "react";
import { Marker, Popup } from "react-leaflet";

const MapMarker = ({ marker }) => {
  return (
    <Marker position={marker.position}>
      <Popup>
        <div>
          <h3>{marker.name}</h3>
          <p>{marker.description}</p>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;
