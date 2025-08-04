import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { AdvancedSettings } from './components/AdvancedSettings';
import { ZplResult } from './components/ZplResult';
import { BatchProgress } from './components/BatchProgress';
import { LabelZoomApiService } from './services/labelZoomApi';
import { BatchConverter } from './services/batchConverter';
import './App.css';

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
    rotation: 0,
    scaling: 100,
    colorMode: 'GRAYSCALE',
    darkness: 70,
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

      // Criar arquivo ZIP
      const zipBlob = await BatchConverter.createZipFile(results);
      
      // Baixar arquivo ZIP
      const zipFileName = `converted_files_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.zip`;
      BatchConverter.downloadZipFile(zipBlob, zipFileName);

      // Mostrar resumo
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
      rotation: 0,
      scaling: 100,
      colorMode: 'GRAYSCALE',
      darkness: 70,
      pdf: {
        conversionMode: 'IMAGE'
      }
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🖨️ PDF para ZPL Converter</h1>
        <p>Converte arquivos PDF e PNG para código ZPL usando a API LabelZoom</p>
      </header>

      <main className="app-main">
        <div className="converter-container">
          <div className="upload-section">
            <h3>📁 Selecionar Arquivos</h3>
            <FileUpload
              onFileSelect={handleFileSelect}
              acceptedTypes={['.pdf', '.png']}
              maxSize={1}
              multiple={true}
            />
            {selectedFiles.length > 0 && (
              <div className="selected-files">
                <h4>Arquivos Selecionados ({selectedFiles.length}):</h4>
                <div className="files-list">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <AdvancedSettings params={params} onParamsChange={setParams} />

          <div className="action-buttons">
            {selectedFiles.length === 1 && (
              <button
                className="convert-button"
                onClick={handleSingleConvert}
                disabled={isConverting}
              >
                {isConverting ? '🔄 Convertendo...' : '🚀 Converter para ZPL'}
              </button>
            )}
            
            {selectedFiles.length > 1 && (
              <button
                className="batch-convert-button"
                onClick={handleBatchConvert}
                disabled={isConverting}
              >
                {isConverting ? '🔄 Processando...' : `🚀 Converter ${selectedFiles.length} Arquivos`}
              </button>
            )}
            
            <button className="reset-button" onClick={handleReset}>
              🔄 Reiniciar
            </button>
          </div>

          {error && (
            <div className="error-message">
              <h4>❌ Erro</h4>
              <p>{error}</p>
            </div>
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
        </div>
           
        <div className="api-info">
          <h3>ℹ️ Sobre a API LabelZoom</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>✅ Funcionalidades</h4>
              <ul>
                <li>Conversão individual: PDF/PNG → ZPL</li>
                <li>Conversão em lote: Múltiplos arquivos</li>
                <li>Download automático: .txt individual ou .zip em lote</li>
                <li>Configurações avançadas</li>
              </ul>
            </div>
            <div className="info-item">
              <h4>📋 Limitações</h4>
              <ul>
                <li>Tamanho máximo: 1MB por arquivo</li>
                <li>Suporte: PDF e PNG</li>
                <li>Sem documentos multi-página</li>
                <li>Rate limiting aplicado</li>
              </ul>
            </div>
          </div>
          <p className="api-link">
            <a href="https://api.labelzoom.net/v2/api-docs" target="_blank" rel="noopener noreferrer">
              📖 Documentação da API
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
