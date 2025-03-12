import React from "react";
import styles from "../Home/Home.module.css";

const MapControls = ({
  setPosition,
  position,
  isSidebarOpen,
  toggleSidebar,
  isMobileView,
}) => {
  // Calculate sidebar toggle button position based on sidebar state
  const sidebarToggleStyle = {
    left: isMobileView
      ? "var(--spacing-md)"
      : "calc(300px + var(--spacing-md))", // In desktop mode, always position next to open sidebar
    transition: "left var(--transition-normal)",
  };

  return (
    <>
      {/* Desktop Sidebar Toggle Button - only show when closed */}
      {!isMobileView && !isSidebarOpen && (
        <button
          className={styles.sidebarToggleBtn}
          onClick={toggleSidebar}
          aria-label="Abrir barra lateral"
          style={sidebarToggleStyle}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={styles.toggleBtnIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <span>Mostrar Ferramentas</span>
        </button>
      )}

      {/* Map Controls - Only Location Button */}
      <div className={styles.mapControls}>
        <button
          className={styles.controlBtn}
          onClick={() => setPosition(position)}
          aria-label="Ir para minha localização"
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {!isMobileView && "Minha Localização"}
        </button>
      </div>
    </>
  );
};

export default MapControls;
