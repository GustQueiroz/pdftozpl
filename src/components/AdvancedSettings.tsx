import React, { useState } from 'react';
interface LabelZoomParams {
  label?: {
    width?: number;
    height?: number;
  };
  pdf?: {
    conversionMode?: 'IMAGE' | 'NATIVE';
    pageNumber?: number;
  };
  zpl?: {
    commandsToIgnore?: string[];
  };
  data?: Array<Record<string, unknown>>;
  dpi?: number;
  rotation?: number;
  scaling?: number;
  colorMode?: 'GRAYSCALE' | 'BW';
  darkness?: number;
  position?: {
    x: number;
    y: number;
  };
}

interface AdvancedSettingsProps {
  params: LabelZoomParams;
  onParamsChange: (params: LabelZoomParams) => void;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  params,
  onParamsChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateParam = (key: keyof LabelZoomParams, value: any) => {
    onParamsChange({
      ...params,
      [key]: value
    });
  };

  const updateLabelParam = (key: keyof LabelZoomParams['label'], value: any) => {
    onParamsChange({
      ...params,
      label: {
        ...params.label,
        [key]: value
      }
    });
  };

  const updatePdfParam = (key: keyof LabelZoomParams['pdf'], value: any) => {
    onParamsChange({
      ...params,
      pdf: {
        ...params.pdf,
        [key]: value
      }
    });
  };

  return (
    <div className="advanced-settings">
      <button
        className="expand-button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '▼' : '▶'} Configurações Avançadas
      </button>

      {isExpanded && (
        <div className="settings-content">
          <div className="settings-section">
            <h4>Configurações do Label</h4>
            <div className="form-group">
              <label>Largura (polegadas):</label>
              <input
                type="number"
                step="0.1"
                value={params.label?.width || ''}
                onChange={(e) => updateLabelParam('width', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Auto"
              />
            </div>
            <div className="form-group">
              <label>Altura (polegadas):</label>
              <input
                type="number"
                step="0.1"
                value={params.label?.height || ''}
                onChange={(e) => updateLabelParam('height', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Auto"
              />
            </div>
          </div>

          <div className="settings-section">
            <h4>Configurações do PDF</h4>
            <div className="form-group">
              <label>Modo de Conversão:</label>
              <select
                value={params.pdf?.conversionMode || 'IMAGE'}
                onChange={(e) => updatePdfParam('conversionMode', e.target.value)}
              >
                <option value="IMAGE">Imagem</option>
                <option value="NATIVE">Nativo</option>
              </select>
            </div>
            <div className="form-group">
              <label>Número da Página (0-based):</label>
              <input
                type="number"
                min="0"
                value={params.pdf?.pageNumber || ''}
                onChange={(e) => updatePdfParam('pageNumber', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Todas as páginas"
              />
            </div>
          </div>

          <div className="settings-section">
            <h4>Configurações Gerais</h4>
            <div className="form-group">
              <label>DPI:</label>
              <input
                type="number"
                min="72"
                max="600"
                value={params.dpi || 203}
                onChange={(e) => updateParam('dpi', Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Rotacionar (graus):</label>
              <input
                type="number"
                min="0"
                max="360"
                value={params.rotation || 0}
                onChange={(e) => updateParam('rotation', Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Escala (%):</label>
              <input
                type="number"
                min="1"
                max="200"
                value={params.scaling || 100}
                onChange={(e) => updateParam('scaling', Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Modo de Cor:</label>
              <select
                value={params.colorMode || 'GRAYSCALE'}
                onChange={(e) => updateParam('colorMode', e.target.value)}
              >
                <option value="GRAYSCALE">Escala de Cinza</option>
                <option value="BW">Preto e Branco</option>
              </select>
            </div>
            <div className="form-group">
              <label>Escuridão (%):</label>
              <input
                type="number"
                min="0"
                max="100"
                value={params.darkness || 70}
                onChange={(e) => updateParam('darkness', Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 