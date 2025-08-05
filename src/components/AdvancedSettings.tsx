/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [isDeclarationMode, setIsDeclarationMode] = useState(false);

  const handleParamChange = (key: keyof LabelZoomParams, value: any) => {
    const newParams = { ...params, [key]: value };
    onParamsChange(newParams);
  };

  const handleDeclarationChange = (checked: boolean) => {
    setIsDeclarationMode(checked);
    if (checked) {
      handleParamChange('scaling', 48);
      handleParamChange('darkness', 80);
      handleParamChange('colorMode', 'BW');
    } else {
      handleParamChange('scaling', 100);
      handleParamChange('darkness', 70);
      handleParamChange('colorMode', 'BW');
    }
  };

  return (
    <div className="advanced-settings">
      <div className="declaration-section">
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isDeclarationMode}
              onChange={(e) => handleDeclarationChange(e.target.checked)}
            />
            <span className="checkbox-text">📋 Declaração de Conteúdo</span>
          </label>
          <p className="checkbox-description">
            Quando marcado, aplica configurações otimizadas para declarações de conteúdo: escala 48% e escuridão 80%
          </p>
        </div>
      </div>

      <button
        className="expand-button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '▼' : '▶'} Configurações Avançadas
      </button>

      {isExpanded && (
        <div className="settings-content">
          <div className="settings-section">
            <h4>📏 Dimensões da Etiqueta</h4>
            <div className="form-group">
              <label>Largura (mm):</label>
              <input
                type="number"
                value={params.label?.width || ''}
                onChange={(e) => handleParamChange('label', {
                  ...params.label,
                  width: e.target.value ? Number(e.target.value) : undefined
                })}
                placeholder="Ex: 100"
              />
            </div>
            <div className="form-group">
              <label>Altura (mm):</label>
              <input
                type="number"
                value={params.label?.height || ''}
                onChange={(e) => handleParamChange('label', {
                  ...params.label,
                  height: e.target.value ? Number(e.target.value) : undefined
                })}
                placeholder="Ex: 50"
              />
            </div>
          </div>

          <div className="settings-section">
            <h4>🖨️ Configurações de Impressão</h4>
            <div className="form-group">
              <label>DPI:</label>
              <select
                value={params.dpi || 203}
                onChange={(e) => handleParamChange('dpi', Number(e.target.value))}
              >
                <option value={203}>203 DPI (Padrão)</option>
                <option value={300}>300 DPI (Alta Qualidade)</option>
                <option value={600}>600 DPI (Máxima Qualidade)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Rotacionar (graus):</label>
              <input
                type="number"
                value={params.rotation || 0}
                onChange={(e) => handleParamChange('rotation', Number(e.target.value))}
                min="0"
                max="360"
              />
            </div>
            <div className="form-group">
              <label>Escala (%):</label>
              <input
                type="number"
                value={params.scaling || 100}
                onChange={(e) => handleParamChange('scaling', Number(e.target.value))}
                min="1"
                max="200"
                disabled={isDeclarationMode}
              />
              {isDeclarationMode && (
                <small className="disabled-note">
                  Escala fixa em 48% para declaração de conteúdo
                </small>
              )}
            </div>
          </div>

          <div className="settings-section">
            <h4>🎨 Configurações de Cor</h4>
            <div className="form-group">
              <label>Modo de Cor:</label>
              <select
                value={params.colorMode || 'BW'}
                onChange={(e) => handleParamChange('colorMode', e.target.value)}
                disabled={isDeclarationMode}
              >
                <option value="BW">Preto e Branco</option>
                <option value="GRAYSCALE">Escala de Cinza</option>
              </select>
              {isDeclarationMode && (
                <small className="disabled-note">
                  Modo fixo em Preto e Branco (otimizado para declaração de conteúdo)
                </small>
              )}
            </div>
            <div className="form-group">
              <label>Escuridão (1-100):</label>
              <input
                type="number"
                value={params.darkness || 70}
                onChange={(e) => handleParamChange('darkness', Number(e.target.value))}
                min="1"
                max="100"
                disabled={isDeclarationMode}
              />
              {isDeclarationMode && (
                <small className="disabled-note">
                  Escuridão fixa em 80% para declaração de conteúdo
                </small>
              )}
            </div>
          </div>

          <div className="settings-section">
            <h4>📄 Configurações PDF</h4>
            <div className="form-group">
              <label>Modo de Conversão:</label>
              <select
                value={params.pdf?.conversionMode || 'IMAGE'}
                onChange={(e) => handleParamChange('pdf', {
                  ...params.pdf,
                  conversionMode: e.target.value as 'IMAGE' | 'NATIVE'
                })}
              >
                <option value="IMAGE">Imagem (Recomendado)</option>
                <option value="NATIVE">Nativo</option>
              </select>
            </div>
            <div className="form-group">
              <label>Número da Página:</label>
              <input
                type="number"
                value={params.pdf?.pageNumber || ''}
                onChange={(e) => handleParamChange('pdf', {
                  ...params.pdf,
                  pageNumber: e.target.value ? Number(e.target.value) : undefined
                })}
                placeholder="Deixe vazio para primeira página"
                min="1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 