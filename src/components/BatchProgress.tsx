import React from 'react';

interface BatchProgressProps {
  totalFiles: number;
  processedFiles: number;
  currentFile: string;
  isProcessing: boolean;
}

export const BatchProgress: React.FC<BatchProgressProps> = ({
  totalFiles,
  processedFiles,
  currentFile,
  isProcessing
}) => {
  const progressPercentage = totalFiles > 0 ? (processedFiles / totalFiles) * 100 : 0;

  return (
    <div className="batch-progress">
      <div className="progress-header">
        <h3>🔄 Processando Arquivos em Lote</h3>
        <div className="progress-stats">
          <span>{processedFiles} de {totalFiles} arquivos processados</span>
          <span>{Math.round(progressPercentage)}% concluído</span>
        </div>
      </div>

      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {isProcessing && (
        <div className="current-file">
          <p>
            <strong>Processando:</strong> {currentFile}
          </p>
        </div>
      )}

      <div className="progress-info">
        <p>
          <strong>Status:</strong> {isProcessing ? 'Processando...' : 'Aguardando...'}
        </p>
        <p>
          <strong>Arquivos restantes:</strong> {totalFiles - processedFiles}
        </p>
      </div>
    </div>
  );
}; 