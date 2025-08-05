import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  Divider
} from '@mui/material';
import { FileUpload } from './components/FileUpload';
import { AdvancedSettings } from './components/AdvancedSettings';
import { ZplResult } from './components/ZplResult';
import { BatchProgress } from './components/BatchProgress';
import { LabelZoomApiService } from './services/labelZoomApi';
import { BatchConverter } from './services/batchConverter';

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

interface ConversionResponse {
  zpl?: string;
  error?: string;
  message?: string;
}

function App() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [params, setParams] = useState<LabelZoomParams>({
    dpi: 203,
    rotation: 180,
    scaling: 100,
    colorMode: 'BW',
    darkness: 90,
    pdf: {
      conversionMode: 'IMAGE'
    }
  });
  const [isConverting, setIsConverting] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [result, setResult] = useState<ConversionResponse | null>(null);
  const [error, setError] = useState<string>('');

  const [batchProgress, setBatchProgress] = useState({
    processed: 0,
    total: 0,
    currentFile: '',
    isProcessing: false
  });

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
    setError('');
    setResult(null);
    setIsBatchMode(files.length > 1);
  };

  const handleSingleConvert = async () => {
    if (selectedFiles.length === 0) {
      setError('Por favor, selecione um arquivo primeiro.');
      return;
    }

    if (selectedFiles.length > 1) {
      setError('Para converter múltiplos arquivos, use o modo em lote.');
      return;
    }

    const file = selectedFiles[0];
    setIsConverting(true);
    setError('');
    setResult(null);

    try {
      let response: ConversionResponse;

      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'pdf') {
        response = await LabelZoomApiService.convertPdfToZpl(file, params);
      } else if (fileExtension === 'png') {
        response = await LabelZoomApiService.convertPngToZpl(file, params);
      } else {
        setError('Tipo de arquivo não suportado. Use PDF ou PNG.');
        setIsConverting(false);
        return;
      }

      if (response.error) {
        setError(response.error);
      } else {
        setResult(response);
      }
    } catch (err) {
      setError('Erro inesperado durante a conversão. Tente novamente.');
      console.error('Erro na conversão:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const handleBatchConvert = async () => {
    if (selectedFiles.length === 0) {
      setError('Por favor, selecione pelo menos um arquivo.');
      return;
    }

    setIsConverting(true);
    setError('');
    setResult(null);
    setBatchProgress({
      processed: 0,
      total: selectedFiles.length,
      currentFile: '',
      isProcessing: true
    });

    try {
      const results = await BatchConverter.convertFiles(
        selectedFiles,
        params,
        (processed, total, currentFile) => {
          setBatchProgress({
            processed,
            total,
            currentFile,
            isProcessing: processed < total
          });
        }
      );

      const zipBlob = await BatchConverter.createZipFile(results);
      
      const zipFileName = `converted_files_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.zip`;
      BatchConverter.downloadZipFile(zipBlob, zipFileName);

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      setResult({
        zpl: `Conversão em lote concluída!\n\n✅ ${successful} arquivos convertidos com sucesso\n❌ ${failed} arquivos com erro\n📦 Arquivo ZIP baixado automaticamente`
      });

    } catch (err) {
      setError('Erro inesperado durante a conversão em lote. Tente novamente.');
      console.error('Erro na conversão em lote:', err);
    } finally {
      setIsConverting(false);
      setBatchProgress({
        processed: 0,
        total: 0,
        currentFile: '',
        isProcessing: false
      });
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setResult(null);
    setError('');
    setIsBatchMode(false);
    setParams({
      dpi: 203,
      rotation: 180,
      scaling: 100,
      colorMode: 'BW',
      darkness: 90,
      pdf: {
        conversionMode: 'IMAGE'
      }
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, overflow: 'hidden' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          🖨️ PDF para ZPL Converter
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Converte arquivos PDF e PNG para código ZPL usando a API LabelZoom
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              📁 Selecionar Arquivos
            </Typography>
            
            <FileUpload
              onFileSelect={handleFileSelect}
              acceptedTypes={['.pdf', '.png']}
              maxSize={1}
              multiple={true}
            />
            
            {selectedFiles.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Arquivos Selecionados ({selectedFiles.length}):
                </Typography>
                <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                  {selectedFiles.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        mb: 1,
                        bgcolor: 'grey.50',
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Paper>

          <AdvancedSettings params={params} onParamsChange={setParams} />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {isConverting && isBatchMode && (
            <BatchProgress
              totalFiles={batchProgress.total}
              processedFiles={batchProgress.processed}
              currentFile={batchProgress.currentFile}
              isProcessing={batchProgress.isProcessing}
            />
          )}

          {result && result.zpl && (
            <ZplResult zplCode={result.zpl} fileName={selectedFiles[0]?.name} />
          )}
        </Box>

        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              🚀 Ações
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {selectedFiles.length === 1 && (
                <Box
                  component="button"
                  onClick={handleSingleConvert}
                  disabled={isConverting}
                  sx={{
                    p: 2,
                    border: 'none',
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    },
                    '&:disabled': {
                      bgcolor: 'grey.400',
                      cursor: 'not-allowed'
                    }
                  }}
                >
                  {isConverting ? '🔄 Convertendo...' : '🚀 Converter para ZPL'}
                </Box>
              )}
              
              {selectedFiles.length > 1 && (
                <Box
                  component="button"
                  onClick={handleBatchConvert}
                  disabled={isConverting}
                  sx={{
                    p: 2,
                    border: 'none',
                    borderRadius: 2,
                    bgcolor: 'secondary.main',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: 'secondary.dark'
                    },
                    '&:disabled': {
                      bgcolor: 'grey.400',
                      cursor: 'not-allowed'
                    }
                  }}
                >
                  {isConverting ? '🔄 Processando...' : `🚀 Converter ${selectedFiles.length} Arquivos`}
                </Box>
              )}
              
              <Box
                component="button"
                onClick={handleReset}
                sx={{
                  p: 2,
                  border: '2px solid',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  bgcolor: 'transparent',
                  color: 'text.primary',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: 'grey.100'
                  }
                }}
              >
                🔄 Reiniciar
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              ℹ️ Informações
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                • Tamanho máximo: 1MB por arquivo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Formatos suportados: PDF e PNG
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Conversão individual ou em lote
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Download automático dos resultados
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
