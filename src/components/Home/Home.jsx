import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { getUserPosition, DEFAULT_MAP_POSITION } from "../../utils/mapUtils";
import {
  extractCoordinatesFromLayer,
  createPolygonFromCoordinates,
} from "../../utils/drawingUtils";
import MapComponent from "../Map/MapComponent";
import Sidebar from "../Sidebar/Sidebar";
import MapControls from "../Map/MapControls";

const Home = () => {
  const [position, setPosition] = useState(DEFAULT_MAP_POSITION);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [markers, setMarkers] = useState([
    {
      id: 1,
      position: DEFAULT_MAP_POSITION,
      name: "Localização de Exemplo",
      description: "Este é um ponto de interesse de exemplo",
    },
  ]);

  // Sidebar and tools state
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [activeTool, setActiveTool] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [areas, setAreas] = useState([]);
  const [tempDrawnLayers, setTempDrawnLayers] = useState([]);
  const [areaName, setAreaName] = useState("");
  const [areaDescription, setAreaDescription] = useState("");
  const [areaColor, setAreaColor] = useState("#3388ff");

  // Mobile view state
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [bottomSheetContent, setBottomSheetContent] = useState("search");

  // Check for mobile view on resize and update sidebar state accordingly
  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobileView(isNowMobile);

      // On transition to desktop, open sidebar if it was closed
      if (!isNowMobile && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  // Get user's current location
  useEffect(() => {
    getUserPosition()
      .then((userPosition) => {
        setPosition(userPosition);
        setLoading(false);
      })
      .catch(() => {
        // Use default position if geolocation fails
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Here you would typically call a geocoding API to search for locations
    if (searchQuery.trim()) {
      const newMarker = {
        id: markers.length + 1,
        position: [
          position[0] + (Math.random() - 0.5) * 0.05,
          position[1] + (Math.random() - 0.5) * 0.05,
        ],
        name: searchQuery,
        description: `Resultado da busca para "${searchQuery}"`,
      };
      setMarkers([...markers, newMarker]);
      setSearchQuery("");

      // Close bottom sheet after search on mobile
      if (isMobileView) {
        setBottomSheetVisible(false);
      }
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    // On desktop, only allow opening the sidebar, not closing it
    if (!isMobileView && isSidebarOpen) {
      return; // Prevent closing sidebar in desktop mode
    }
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Toggle bottom sheet for mobile
  const toggleBottomSheet = (content = "search") => {
    if (bottomSheetVisible && bottomSheetContent === content) {
      setBottomSheetVisible(false);
    } else {
      setBottomSheetContent(content);
      setBottomSheetVisible(true);
    }
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

    // Close bottom sheet after tool selection on mobile
    if (isMobileView) {
      setBottomSheetVisible(false);
    }
  };

  // Handle when a shape is drawn
  const handleShapeCreated = (layer) => {
    // Extract coordinates from the drawn layer
    const drawnCoords = extractCoordinatesFromLayer(layer);
    setTempDrawnLayers([...tempDrawnLayers, { layer, coords: drawnCoords }]);

    // On mobile, show bottom sheet with area form after drawing
    if (isMobileView) {
      setBottomSheetContent("areaForm");
      setBottomSheetVisible(true);
    }
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
      alert("Por favor, desenhe uma área no mapa primeiro");
      return;
    }

    // Create a new area from the latest drawn shape
    const latestDrawn = tempDrawnLayers[tempDrawnLayers.length - 1];
    const newArea = createPolygonFromCoordinates(
      latestDrawn.coords,
      areaName,
      areaDescription,
      areaColor,
      areas.length + 1
    );

    setAreas([...areas, newArea]);
    setTempDrawnLayers([]);
    setAreaName("");
    setAreaDescription("");

    // Close bottom sheet or drawing tool based on view
    if (isMobileView) {
      setBottomSheetVisible(false);
    } else {
      if (
        !window.confirm("Área salva com sucesso! Deseja desenhar outra área?")
      ) {
        setIsDrawing(false);
        setActiveTool(null);
      }
    }
  };

  // Cancel area creation
  const cancelAreaCreation = () => {
    setTempDrawnLayers([]);
    setIsDrawing(false);
    setActiveTool(null);
    setAreaName("");
    setAreaDescription("");

    // Close bottom sheet on mobile
    if (isMobileView) {
      setBottomSheetVisible(false);
    }
  };

  return (
    <div className={styles.mapContainer}>
      {/* Floating Action Button for mobile */}
      {isMobileView && (
        <div className={styles.fabContainer}>
          <button
            className={`${styles.fab} ${styles.fabPrimary}`}
            onClick={() => toggleBottomSheet("tools")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={styles.fabIcon}
            >
              <path
                d="M12 6v12m6-6H6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button
            className={`${styles.fab} ${styles.fabSecondary}`}
            onClick={() => toggleBottomSheet("search")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className={styles.fabIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Sidebar Component - only fully visible on desktop */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        activeTool={activeTool}
        selectTool={selectTool}
        tempDrawnLayers={tempDrawnLayers}
        areaName={areaName}
        setAreaName={setAreaName}
        areaDescription={areaDescription}
        setAreaDescription={setAreaDescription}
        areaColor={areaColor}
        setAreaColor={setAreaColor}
        saveDrawnArea={saveDrawnArea}
        cancelAreaCreation={cancelAreaCreation}
        isMobileView={isMobileView}
      />

      <div
        className={`${styles.mainContent} ${
          !isMobileView || (isSidebarOpen && !isMobileView)
            ? styles.sidebarOpen
            : ""
        }`}
      >
        {!isMobileView && !isSidebarOpen && (
          <div className={styles.header}>
            <h1>HackerMap</h1>
            <p>Explore e crie áreas</p>
          </div>
        )}

        {!isMobileView && (
          <div className={styles.searchContainer}>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Buscar localizações..."
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
        )}

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Carregando mapa...</p>
          </div>
        ) : (
          <div className={styles.mapWrapper}>
            {/* Map Component */}
            <MapComponent
              position={position}
              markers={markers}
              areas={areas}
              isDrawing={isDrawing}
              handleShapeCreated={handleShapeCreated}
              handleShapeDeleted={handleShapeDeleted}
              areaColor={areaColor}
              isMobileView={isMobileView}
            />

            {isDrawing && (
              <div className={styles.drawingHelpOverlay}>
                <p>Use as ferramentas de desenho no mapa para criar sua área</p>
              </div>
            )}

            {/* Map Controls Component */}
            <MapControls
              setPosition={setPosition}
              position={position}
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              isMobileView={isMobileView}
            />
          </div>
        )}

        {/* Mobile Bottom Sheet */}
        {isMobileView && bottomSheetVisible && (
          <div className={styles.bottomSheet}>
            <div className={styles.bottomSheetHeader}>
              <div className={styles.bottomSheetHandle}></div>
              <button
                className={styles.bottomSheetClose}
                onClick={() => setBottomSheetVisible(false)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className={styles.bottomSheetContent}>
              {bottomSheetContent === "search" && (
                <div className={styles.mobileSearchContainer}>
                  <h3>Buscar Localização</h3>
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      placeholder="Digite o nome da localização..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">Buscar</button>
                  </form>
                </div>
              )}

              {bottomSheetContent === "tools" && (
                <div className={styles.mobileToolsContainer}>
                  <h3>Ferramentas do Mapa</h3>
                  <div className={styles.mobileToolsGrid}>
                    <button
                      className={`${styles.mobileTool} ${
                        activeTool === "create-area" ? styles.activeToolBtn : ""
                      }`}
                      onClick={() => selectTool("create-area")}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Criar Área</span>
                    </button>

                    <button
                      className={`${styles.mobileTool} ${
                        activeTool === "map-reports" ? styles.activeToolBtn : ""
                      }`}
                      onClick={() => selectTool("map-reports")}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Relatórios</span>
                    </button>
                  </div>
                </div>
              )}

              {bottomSheetContent === "areaForm" &&
                tempDrawnLayers.length > 0 && (
                  <div className={styles.mobileAreaForm}>
                    <h3>Salvar Área</h3>
                    <div className={styles.formGroup}>
                      <label htmlFor="areaName">Nome da Área</label>
                      <input
                        id="areaName"
                        type="text"
                        placeholder="Digite um nome para esta área"
                        value={areaName}
                        onChange={(e) => setAreaName(e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="areaDescription">Descrição</label>
                      <textarea
                        id="areaDescription"
                        placeholder="Descreva esta área"
                        value={areaDescription}
                        onChange={(e) => setAreaDescription(e.target.value)}
                      ></textarea>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="areaColor">Cor</label>
                      <input
                        id="areaColor"
                        type="color"
                        value={areaColor}
                        onChange={(e) => setAreaColor(e.target.value)}
                      />
                    </div>

                    <div className={styles.buttonGroup}>
                      <button
                        className={styles.btnCancel}
                        onClick={cancelAreaCreation}
                      >
                        Cancelar
                      </button>
                      <button
                        className={styles.btnComplete}
                        onClick={saveDrawnArea}
                      >
                        Salvar Área
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
