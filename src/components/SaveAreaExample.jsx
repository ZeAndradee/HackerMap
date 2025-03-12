import { useState } from "react";
import AreaService from "../services/AreaService";

const SaveAreaExample = ({ drawnAreas, onAreaSaved }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [areaName, setAreaName] = useState("");

  // Function to save a drawn area to the database
  const handleSaveArea = async (area) => {
    if (!area || !area.coordinates || !areaName) {
      setError("Please provide a name and valid area coordinates");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare the area data object
      const areaData = {
        name: areaName,
        coordinates: area.coordinates,
        // Add any other properties needed by your area model
        properties: {
          // Additional properties like color, description, etc.
          color: area.properties?.color || "#3388ff",
          description: area.properties?.description || "",
        },
      };

      // Save the area using the service
      const savedArea = await AreaService.saveArea(areaData);

      // Clear the form
      setAreaName("");

      // Notify parent component
      if (onAreaSaved) {
        onAreaSaved(savedArea);
      }
    } catch (err) {
      setError(`Failed to save area: ${err.message}`);
      console.error("Error saving area:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="save-area-form">
      <h3>Save Area to Database</h3>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="area-name">Area Name:</label>
        <input
          id="area-name"
          type="text"
          value={areaName}
          onChange={(e) => setAreaName(e.target.value)}
          placeholder="Enter area name"
          disabled={isLoading}
        />
      </div>

      <div className="drawn-areas-list">
        <h4>Drawn Areas</h4>
        {drawnAreas && drawnAreas.length > 0 ? (
          <ul>
            {drawnAreas.map((area, index) => (
              <li key={index}>
                Area {index + 1} - {area.properties?.name || "Unnamed"}
                <button
                  onClick={() => handleSaveArea(area)}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save to DB"}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No areas drawn yet. Draw an area on the map first.</p>
        )}
      </div>
    </div>
  );
};

export default SaveAreaExample;
