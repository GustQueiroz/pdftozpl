import React from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Alert,
  Chip
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';

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
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <SyncIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h5" component="h3">
          🔄 Processando Arquivos em Lote
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {processedFiles} de {totalFiles} arquivos processados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progressPercentage)}% concluído
          </Typography>
        </Box>
        
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {isProcessing && currentFile && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Processando:</strong> {currentFile}
          </Typography>
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Chip
          label={`Status: ${isProcessing ? 'Processando...' : 'Aguardando...'}`}
          color={isProcessing ? 'primary' : 'default'}
          variant="outlined"
        />
        <Chip
          label={`Arquivos restantes: ${totalFiles - processedFiles}`}
          variant="outlined"
          color="secondary"
        />
        <Chip
          label={`Progresso: ${Math.round(progressPercentage)}%`}
          variant="outlined"
          color="info"
        />
      </Box>
    </Paper>
  );
}; 