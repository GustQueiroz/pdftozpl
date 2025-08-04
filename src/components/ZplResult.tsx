import React, { useState, useEffect } from 'react';

interface ZplResultProps {
  zplCode: string;
  fileName?: string;
}

export const ZplResult: React.FC<ZplResultProps> = ({ zplCode, fileName }) => {
  const [copied, setCopied] = useState(false);

  // Baixar automaticamente o arquivo .txt quando o componente é montado
  useEffect(() => {
    downloadZpl();
  }, [zplCode]); // Executa sempre que o código ZPL mudar

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(zplCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar para a área de transferência:', err);
    }
  };

  const downloadZpl = () => {
    const blob = new Blob([zplCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName ? `${fileName.replace(/\.[^/.]+$/, '')}.txt` : 'converted.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="zpl-result">
      <div className="result-header">
        <h3>✅ Conversão Concluída!</h3>
        <div className="result-actions">
          <button
            className={`copy-button ${copied ? 'copied' : ''}`}
            onClick={copyToClipboard}
          >
            {copied ? '✓ Copiado!' : '📋 Copiar'}
          </button>
          <button className="download-button" onClick={downloadZpl}>
            💾 Baixar Novamente
          </button>
        </div>
      </div>

      <div className="zpl-code-container">
        <pre className="zpl-code">
          <code>{zplCode}</code>
        </pre>
      </div>

      <div className="zpl-info">
        <p>
          <strong>✅ Arquivo baixado automaticamente!</strong>
        </p>
        <p>
          <strong>Comprimento do código ZPL:</strong> {zplCode.length} caracteres
        </p>
        <p>
          <strong>Linhas:</strong> {zplCode.split('\n').length}
        </p>
        <p>
          <strong>Arquivo:</strong> {fileName ? `${fileName.replace(/\.[^/.]+$/, '')}.txt` : 'converted.txt'}
        </p>
      </div>
    </div>
  );
}; 