import React, { useEffect } from "react";
import { Polygon, Popup } from "react-leaflet";

const MapPolygon = ({ area }) => {
  useEffect(() => {
    console.log("Rendering polygon area:", area);
  }, [area]);

  if (!area || !area.points || area.points.length < 3) {
    console.error("Invalid polygon data:", area);
    return null;
  }

  return (
    <Polygon
      positions={area.points}
      pathOptions={{
        color: area.color || "#3388ff",
        fillColor: area.color || "#3388ff",
        fillOpacity: 0.3,
      }}
    >
      <Popup>
        <div>
          <h3>{area.name}</h3>
          <p>{area.description || "No description available"}</p>
        </div>
      </Popup>
    </Polygon>
  );
};

export default MapPolygon;
