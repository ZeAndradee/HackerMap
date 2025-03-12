import React, { useEffect, useRef } from "react";
import { FeatureGroup, useMap } from "react-leaflet";
import L from "leaflet";
import { createDrawControl } from "../../utils/drawingUtils";

// Drawing controls component
const DrawingControls = ({ onCreated, onDeleted, isDrawing, color }) => {
  const map = useMap();
  const featureGroupRef = useRef(null);

  // Initialize or update draw controls when isDrawing changes
  useEffect(() => {
    if (!featureGroupRef.current) return;

    // Remove any existing controls
    if (map.drawControl) {
      map.removeControl(map.drawControl);
    }

    if (isDrawing) {
      // Create draw controls
      const drawControl = createDrawControl(featureGroupRef.current, color);

      map.drawControl = drawControl;
      map.addControl(drawControl);

      // Event handlers for drawing
      map.on(L.Draw.Event.CREATED, (e) => {
        const layer = e.layer;
        featureGroupRef.current.addLayer(layer);
        onCreated(layer);
      });

      map.on(L.Draw.Event.DELETED, (e) => {
        onDeleted(e.layers);
      });
    } else if (map.drawControl) {
      // Remove draw controls when not drawing
      map.removeControl(map.drawControl);
    }

    // Cleanup on unmount
    return () => {
      if (map.drawControl) {
        map.removeControl(map.drawControl);
        map.off(L.Draw.Event.CREATED);
        map.off(L.Draw.Event.DELETED);
      }
    };
  }, [map, onCreated, onDeleted, isDrawing, color]);

  return (
    <FeatureGroup ref={featureGroupRef}>
      {/* Saved areas will be added here */}
    </FeatureGroup>
  );
};

export default DrawingControls;
