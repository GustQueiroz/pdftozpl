/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  FormControlLabel,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Slider,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';

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
  const [isDeclarationMode, setIsDeclarationMode] = useState(false);

  useEffect(() => {
    const isDeclaration = params.scaling === 49 && params.darkness === 90 && params.colorMode === 'BW';
    setIsDeclarationMode(isDeclaration);
  }, [params.scaling, params.darkness, params.colorMode]);

  const handleParamChange = (key: keyof LabelZoomParams, value: any) => {
    const newParams = { ...params, [key]: value };
    onParamsChange(newParams);
  };

  const handleDeclarationChange = (checked: boolean) => {
    if (checked) {
      // Aplica as configurações de declaração de conteúdo
      handleParamChange('scaling', 49);
      handleParamChange('darkness', 90);
      handleParamChange('colorMode', 'BW');
      
      setIsDeclarationMode(true);
    } else {
      // Volta para os valores padrão
      handleParamChange('scaling', 100);
      handleParamChange('darkness', 90);
      handleParamChange('colorMode', 'BW');
      
      setIsDeclarationMode(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isDeclarationMode}
              onChange={(e) => handleDeclarationChange(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Box>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                📋 Declaração de Conteúdo
              </Typography>
                             <Typography variant="body2" color="text.secondary">
                 Quando marcado, aplica configurações otimizadas para declarações de conteúdo: escala 49% e escuridão 90%
               </Typography>
            </Box>
          }
        />
      </Box>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon />
            <Typography variant="h6">Configurações Avançadas</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                📏 Dimensões da Etiqueta
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Largura (mm)"
                  type="number"
                  value={params.label?.width || ''}
                  onChange={(e) => handleParamChange('label', {
                    ...params.label,
                    width: e.target.value ? Number(e.target.value) : undefined
                  })}
                  placeholder="Ex: 100"
                  size="small"
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Altura (mm)"
                  type="number"
                  value={params.label?.height || ''}
                  onChange={(e) => handleParamChange('label', {
                    ...params.label,
                    height: e.target.value ? Number(e.target.value) : undefined
                  })}
                  placeholder="Ex: 50"
                  size="small"
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>
                🖨️ Configurações de Impressão
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl size="small">
                  <InputLabel>DPI</InputLabel>
                  <Select
                    value={params.dpi || 203}
                    onChange={(e) => handleParamChange('dpi', Number(e.target.value))}
                    label="DPI"
                  >
                    <MenuItem value={203}>203 DPI (Padrão)</MenuItem>
                    <MenuItem value={300}>300 DPI (Alta Qualidade)</MenuItem>
                    <MenuItem value={600}>600 DPI (Máxima Qualidade)</MenuItem>
                  </Select>
                </FormControl>

                                 <TextField
                   label="Rotacionar (graus)"
                   type="number"
                   value={params.rotation || 180}
                   onChange={(e) => handleParamChange('rotation', Number(e.target.value))}
                   inputProps={{ min: 0, max: 360 }}
                   size="small"
                 />

                                 <TextField
                   label="Escala (%)"
                   type="text"
                   value={isDeclarationMode ? '49' : (params.scaling || 100)}
                   onChange={(e) => {
                     if (!isDeclarationMode) {
                       const value = e.target.value;
                       if (value === '') {
                         return;
                       }
                       const numValue = Number(value);
                       if (!isNaN(numValue) && numValue >= 1 && numValue <= 200) {
                         handleParamChange('scaling', numValue);
                       }
                     }
                   }}
                   onBlur={(e) => {
                     if (!isDeclarationMode) {
                       const value = e.target.value;
                       if (value === '' || isNaN(Number(value)) || Number(value) < 1 || Number(value) > 200) {
                         handleParamChange('scaling', 100);
                       }
                     }
                   }}
                   disabled={isDeclarationMode}
                   size="small"
                   helperText={isDeclarationMode ? 'Escala fixa em 49% para declaração de conteúdo' : 'Digite um valor entre 1 e 200'}
                 />
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>
                🎨 Configurações de Cor
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl size="small">
                  <InputLabel>Modo de Cor</InputLabel>
                  <Select
                    value={params.colorMode || 'BW'}
                    onChange={(e) => {
                      if (!isDeclarationMode) {
                        handleParamChange('colorMode', e.target.value);
                      }
                    }}
                    label="Modo de Cor"
                    disabled={isDeclarationMode}
                  >
                    <MenuItem value="BW">Preto e Branco</MenuItem>
                    <MenuItem value="GRAYSCALE">Escala de Cinza</MenuItem>
                  </Select>
                  {isDeclarationMode && (
                    <Typography variant="caption" color="text.secondary">
                      Modo fixo em Preto e Branco (otimizado para declaração de conteúdo)
                    </Typography>
                  )}
                </FormControl>

                                 <Box>
                   <Typography gutterBottom>
                     Escuridão: {isDeclarationMode ? 90 : (params.darkness || 90)}%
                   </Typography>
                   <Slider
                     value={isDeclarationMode ? 90 : (params.darkness || 90)}
                     onChange={(_, value) => {
                       if (!isDeclarationMode) {
                         handleParamChange('darkness', value);
                       }
                     }}
                     min={1}
                     max={100}
                     disabled={isDeclarationMode}
                     valueLabelDisplay="auto"
                   />
                   {isDeclarationMode && (
                     <Typography variant="caption" color="text.secondary">
                       Escuridão fixa em 90% para declaração de conteúdo
                     </Typography>
                   )}
                 </Box>
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>
                📄 Configurações PDF
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl size="small">
                  <InputLabel>Modo de Conversão</InputLabel>
                  <Select
                    value={params.pdf?.conversionMode || 'IMAGE'}
                    onChange={(e) => handleParamChange('pdf', {
                      ...params.pdf,
                      conversionMode: e.target.value as 'IMAGE' | 'NATIVE'
                    })}
                    label="Modo de Conversão"
                  >
                    <MenuItem value="IMAGE">Imagem (Recomendado)</MenuItem>
                    <MenuItem value="NATIVE">Nativo</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Número da Página"
                  type="number"
                  value={params.pdf?.pageNumber || ''}
                  onChange={(e) => handleParamChange('pdf', {
                    ...params.pdf,
                    pageNumber: e.target.value ? Number(e.target.value) : undefined
                  })}
                  placeholder="Deixe vazio para primeira página"
                  inputProps={{ min: 1 }}
                  size="small"
                />
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
}; 