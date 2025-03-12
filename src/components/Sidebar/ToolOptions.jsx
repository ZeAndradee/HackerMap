import React from "react";
import styles from "../Home/Home.module.css";

const ToolOptions = ({
  activeTool,
  tempDrawnLayers,
  areaName,
  setAreaName,
  areaDescription,
  setAreaDescription,
  areaColor,
  setAreaColor,
  saveDrawnArea,
  cancelAreaCreation,
  isSaving,
  saveError,
}) => {
  return (
    <div className={styles.toolOptions}>
      {activeTool === "create-area" && (
        <>
          <h3>Criar Área</h3>
          <p>Desenhe um polígono no mapa para definir uma área de interesse.</p>

          {saveError && <div className={styles.errorMessage}>{saveError}</div>}

          {tempDrawnLayers.length > 0 ? (
            <div className={styles.formContent}>
              <div className={styles.formGroup}>
                <label htmlFor="areaName">Nome da Área</label>
                <input
                  type="text"
                  id="areaName"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  placeholder="Digite um nome para esta área"
                  disabled={isSaving}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="areaDescription">Descrição</label>
                <textarea
                  id="areaDescription"
                  value={areaDescription}
                  onChange={(e) => setAreaDescription(e.target.value)}
                  placeholder="Descreva o que esta área representa"
                  disabled={isSaving}
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="areaColor">Cor</label>
                <input
                  type="color"
                  id="areaColor"
                  value={areaColor}
                  onChange={(e) => setAreaColor(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div className={styles.buttonGroup}>
                <button
                  className={styles.btnCancel}
                  onClick={cancelAreaCreation}
                  disabled={isSaving}
                >
                  Cancelar
                </button>
                <button
                  className={styles.btnComplete}
                  onClick={saveDrawnArea}
                  disabled={isSaving}
                >
                  {isSaving ? "Salvando..." : "Salvar Área"}
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.drawingInstructions}>
              <ol>
                <li>Clique na ferramenta de polígono no mapa</li>
                <li>Clique no mapa para colocar pontos</li>
                <li>Complete a forma clicando no primeiro ponto novamente</li>
                <li>Preencha os detalhes e salve sua área</li>
              </ol>
            </div>
          )}
        </>
      )}

      {activeTool === "map-reports" && (
        <>
          <h3>Relatórios do Mapa</h3>
          <p>Visualize e gere relatórios sobre dados do mapa.</p>

          <div className={styles.reportOptions}>
            <div className={styles.reportCard}>
              <h4>Análise de Áreas</h4>
              <p>Visualize estatísticas sobre áreas criadas</p>
              <button className={styles.reportBtn}>Gerar Relatório</button>
            </div>

            <div className={styles.reportCard}>
              <h4>Relatório de Pontos de Interesse</h4>
              <p>Resumo de todos os marcadores e localizações</p>
              <button className={styles.reportBtn}>Gerar Relatório</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ToolOptions;
