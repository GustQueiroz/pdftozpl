/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ZplResultProps {
  zplCode: string;
  fileName?: string;
}

export const ZplResult: React.FC<ZplResultProps> = ({ zplCode, fileName }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    downloadZpl();
  }, [zplCode]);

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
    <Paper elevation={3} sx={{ p: 3, width: '100%', minWidth: 0, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 32 }} />
        <Typography variant="h5" component="h3">
          ✅ Conversão Concluída!
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
          onClick={copyToClipboard}
          color={copied ? 'success' : 'primary'}
        >
          {copied ? 'Copiado!' : 'Copiar'}
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={downloadZpl}
        >
          Baixar Novamente
        </Button>
      </Box>

      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>✅ Arquivo baixado automaticamente!</strong>
        </Typography>
      </Alert>

      <Box sx={{ mb: 3, width: '100%', minWidth: 0 }}>
        <Typography variant="h6" gutterBottom>
          Código ZPL:
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            bgcolor: 'grey.50',
            maxHeight: 300,
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            lineHeight: 1.5,
            width: '100%',
            minWidth: 0
          }}
        >
          <pre style={{ 
            margin: 0, 
            whiteSpace: 'pre-wrap', 
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            maxWidth: '100%'
          }}>
            {zplCode}
          </pre>
        </Paper>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Chip
          label={`Comprimento: ${zplCode.length} caracteres`}
          variant="outlined"
          color="primary"
        />
        <Chip
          label={`Linhas: ${zplCode.split('\n').length}`}
          variant="outlined"
          color="secondary"
        />
        <Chip
          label={`Arquivo: ${fileName ? `${fileName.replace(/\.[^/.]+$/, '')}.txt` : 'converted.txt'}`}
          variant="outlined"
          color="info"
        />
      </Box>
    </Paper>
  );
}; 