import React from "react";
import styles from "../Home/Home.module.css";
import ToolOptions from "./ToolOptions";
import logo2 from "../../assets/icons/InfoLogo2.svg";

const Sidebar = ({
  isSidebarOpen,
  toggleSidebar,
  activeTool,
  selectTool,
  tempDrawnLayers,
  areaName,
  setAreaName,
  areaDescription,
  setAreaDescription,
  areaColor,
  setAreaColor,
  saveDrawnArea,
  cancelAreaCreation,
  isMobileView,
  isSaving,
  saveError,
}) => {
  return (
    <div
      className={`${styles.sidebar} ${
        isSidebarOpen ? styles.open : styles.sidebarClosed
      }`}
    >
      <div className={styles.sidebarHeader}>
        <img src={logo2} alt="Logo" />
        {isMobileView && (
          <button
            className={styles.closeSidebar}
            onClick={toggleSidebar}
            aria-label="Fechar barra lateral"
          >
            ×
          </button>
        )}
      </div>

      <div className={styles.toolsContainer}>
        <button
          className={`${styles.toolBtn} ${
            activeTool === "create-area" ? styles.toolBtnActive : ""
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
          Criar Área
        </button>

        <button
          className={`${styles.toolBtn} ${
            activeTool === "map-reports" ? styles.toolBtnActive : ""
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
          Relatórios
        </button>

        <button
          className={`${styles.toolBtn}`}
          onClick={() => {
            // This would open a settings modal or route to settings page
            alert(
              "Recurso de configurações será implementado em uma atualização futura"
            );
          }}
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Configurações
        </button>
      </div>

      {activeTool && !isMobileView && (
        <ToolOptions
          activeTool={activeTool}
          tempDrawnLayers={tempDrawnLayers}
          areaName={areaName}
          setAreaName={setAreaName}
          areaDescription={areaDescription}
          setAreaDescription={setAreaDescription}
          areaColor={areaColor}
          setAreaColor={setAreaColor}
          saveDrawnArea={saveDrawnArea}
          cancelAreaCreation={cancelAreaCreation}
          isSaving={isSaving}
          saveError={saveError}
        />
      )}

      {/* App info section at the bottom of sidebar */}
      <div className={styles.sidebarFooter}>
        <div className={styles.sidebarInfo}>
          <p>Info Cidadão v1.0</p>
          <p className={styles.copyright}>© 2025 Info Cidadão & Emprel</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
