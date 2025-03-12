import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  FeatureGroup,
  Polygon,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import "leaflet-draw";
import "./Home.css";

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

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
      const drawControl = new L.Control.Draw({
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
          featureGroup: featureGroupRef.current,
          poly: {
            allowIntersection: false,
          },
        },
      });

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

const Home = () => {
  const [position, setPosition] = useState([51.505, -0.09]); // Default position (London)
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [markers, setMarkers] = useState([
    {
      id: 1,
      position: [51.505, -0.09],
      name: "Sample Location",
      description: "This is a sample point of interest",
    },
  ]);

  // Sidebar and tools state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTool, setActiveTool] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [areas, setAreas] = useState([]);
  const [tempDrawnLayers, setTempDrawnLayers] = useState([]);
  const [areaName, setAreaName] = useState("");
  const [areaDescription, setAreaDescription] = useState("");
  const [areaColor, setAreaColor] = useState("#3388ff");

  const mapRef = useRef(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition([position.coords.latitude, position.coords.longitude]);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Here you would typically call a geocoding API to search for locations
    console.log("Searching for:", searchQuery);
    // For demo purposes, just add a new marker
    if (searchQuery.trim()) {
      const newMarker = {
        id: markers.length + 1,
        position: [
          position[0] + (Math.random() - 0.5) * 0.05,
          position[1] + (Math.random() - 0.5) * 0.05,
        ],
        name: searchQuery,
        description: `Search result for "${searchQuery}"`,
      };
      setMarkers([...markers, newMarker]);
      setSearchQuery("");
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle tool selection
  const selectTool = (tool) => {
    if (activeTool === tool) {
      setActiveTool(null);
      setIsDrawing(false);
    } else {
      setActiveTool(tool);
      if (tool === "create-area") {
        setIsDrawing(true);
      } else {
        setIsDrawing(false);
      }
    }
  };

  // Handle when a shape is drawn
  const handleShapeCreated = (layer) => {
    // Extract coordinates from the drawn layer
    const drawnCoords = layer
      .getLatLngs()[0]
      .map((coord) => [coord.lat, coord.lng]);

    setTempDrawnLayers([...tempDrawnLayers, { layer, coords: drawnCoords }]);
  };

  // Handle shape deletion
  const handleShapeDeleted = (layers) => {
    layers.eachLayer((layer) => {
      setTempDrawnLayers(
        tempDrawnLayers.filter((item) => item.layer !== layer)
      );
    });
  };

  // Save the drawn area
  const saveDrawnArea = () => {
    if (tempDrawnLayers.length === 0) {
      alert("Please draw an area on the map first");
      return;
    }

    // Create a new area from the latest drawn shape
    const latestDrawn = tempDrawnLayers[tempDrawnLayers.length - 1];
    const newArea = {
      id: areas.length + 1,
      points: [...latestDrawn.coords, latestDrawn.coords[0]], // Close the polygon
      name: areaName || `Area ${areas.length + 1}`,
      description: areaDescription || "Created area",
      color: areaColor,
    };

    setAreas([...areas, newArea]);
    setTempDrawnLayers([]);
    setAreaName("");
    setAreaDescription("");

    // Clear the drawn shape from the map (this works with the FeatureGroup ref)
    if (mapRef.current) {
      const drawnItems = mapRef.current._layers;
      if (drawnItems) {
        Object.keys(drawnItems).forEach((layerId) => {
          if (drawnItems[layerId].hasOwnProperty("_layers")) {
            drawnItems[layerId].clearLayers();
          }
        });
      }
    }

    // Optionally close the drawing tool
    if (
      window.confirm(
        "Area saved successfully! Do you want to draw another area?"
      )
    ) {
      // Keep drawing tool open for another area
    } else {
      setIsDrawing(false);
      setActiveTool(null);
    }
  };

  // Cancel area creation
  const cancelAreaCreation = () => {
    setTempDrawnLayers([]);
    setIsDrawing(false);
    setActiveTool(null);
    setAreaName("");
    setAreaDescription("");

    // Clear the drawn shape from the map
    if (mapRef.current) {
      const drawnItems = mapRef.current._layers;
      if (drawnItems) {
        Object.keys(drawnItems).forEach((layerId) => {
          if (drawnItems[layerId].hasOwnProperty("_layers")) {
            drawnItems[layerId].clearLayers();
          }
        });
      }
    }
  };

  return (
    <div className="map-container">
      <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2>Map Tools</h2>
          <button className="close-sidebar" onClick={toggleSidebar}>
            {isSidebarOpen ? "×" : "☰"}
          </button>
        </div>

        <div className="tools-container">
          <button
            className={`tool-btn ${
              activeTool === "create-area" ? "active" : ""
            }`}
            onClick={() => selectTool("create-area")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            Create Area
          </button>

          <button
            className={`tool-btn ${
              activeTool === "map-reports" ? "active" : ""
            }`}
            onClick={() => selectTool("map-reports")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Map Reports
          </button>
        </div>

        {activeTool === "create-area" && (
          <div className="tool-options">
            <h3>Create Area Tool</h3>
            <p>
              Use the drawing tools on the map to create an area. Click the
              polygon button on the right side of the map to start drawing.
            </p>

            {tempDrawnLayers.length > 0 && (
              <div className="drawn-area-info">
                <div className="success-message">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Area drawn successfully!</span>
                </div>
                <p>Please provide details about this area:</p>
              </div>
            )}

            <div className="form-group">
              <label>Area Name:</label>
              <input
                type="text"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                placeholder="Enter area name"
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={areaDescription}
                onChange={(e) => setAreaDescription(e.target.value)}
                placeholder="Describe this area"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Color:</label>
              <input
                type="color"
                value={areaColor}
                onChange={(e) => setAreaColor(e.target.value)}
              />
            </div>

            <div className="tool-actions">
              {tempDrawnLayers.length > 0 && (
                <button className="btn-complete" onClick={saveDrawnArea}>
                  Save Area
                </button>
              )}
              <button className="btn-cancel" onClick={cancelAreaCreation}>
                Cancel
              </button>
            </div>

            <div className="drawing-instructions">
              <h4>How to Draw:</h4>
              <ol>
                <li>
                  Click the polygon button <span className="icon-ref">⬡</span>{" "}
                  on the map
                </li>
                <li>Click on the map to add points to your area</li>
                <li>Connect back to the first point to complete the shape</li>
                <li>Fill in the details and click Save Area</li>
              </ol>
            </div>
          </div>
        )}

        {activeTool === "map-reports" && (
          <div className="tool-options">
            <h3>Map Reports</h3>
            <p>
              This tool will allow you to generate and view reports for areas on
              the map.
            </p>
            <p>Feature coming soon...</p>
          </div>
        )}
      </div>

      <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="header">
          <h1>Interactive City Map</h1>
          <p>Explore and create areas in your city</p>
        </div>

        <div className="search-container">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading map...</p>
          </div>
        ) : (
          <div className="map-wrapper">
            <MapContainer
              center={position}
              zoom={13}
              style={{ height: "calc(100vh - 180px)", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {markers.map((marker) => (
                <Marker key={marker.id} position={marker.position}>
                  <Popup>
                    <div>
                      <h3>{marker.name}</h3>
                      <p>{marker.description}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Draw controls */}
              {isDrawing && (
                <DrawingControls
                  onCreated={handleShapeCreated}
                  onDeleted={handleShapeDeleted}
                  isDrawing={isDrawing}
                  color={areaColor}
                />
              )}

              {/* Display saved areas */}
              {areas.map((area, index) => (
                <Polygon
                  key={index}
                  positions={area.points}
                  pathOptions={{
                    color: area.color || "#3388ff",
                    fillColor: area.color || "#3388ff",
                    fillOpacity: 0.3,
                  }}
                >
                  <Popup>
                    <div>
                      <h3>{area.name || `Area ${index + 1}`}</h3>
                      <p>{area.description || "No description available"}</p>
                    </div>
                  </Popup>
                </Polygon>
              ))}
            </MapContainer>

            {isDrawing && (
              <div className="drawing-help-overlay">
                <p>Use the drawing tools on the map to create your area</p>
              </div>
            )}
          </div>
        )}

        <div className="map-controls">
          <button className="control-btn" onClick={() => setPosition(position)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            My Location
          </button>

          {!isSidebarOpen && (
            <button className="control-btn" onClick={toggleSidebar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              Open Tools
            </button>
          )}
        </div>

        <div className="footer">
          <p>Data provided by OpenStreetMap contributors</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
