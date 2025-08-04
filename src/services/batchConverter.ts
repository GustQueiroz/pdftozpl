import JSZip from 'jszip';
import { LabelZoomApiService } from './labelZoomApi';

// Tipos inline
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

interface ConversionResult {
  fileName: string;
  zplCode: string;
  success: boolean;
  error?: string;
}

interface BatchProgressCallback {
  (processed: number, total: number, currentFile: string): void;
}

export class BatchConverter {
  static async convertFiles(
    files: File[],
    params: LabelZoomParams,
    onProgress?: BatchProgressCallback
  ): Promise<ConversionResult[]> {
    const results: ConversionResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Chamar callback de progresso
      if (onProgress) {
        onProgress(i, files.length, file.name);
      }

      try {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        let response;

        if (fileExtension === 'pdf') {
          response = await LabelZoomApiService.convertPdfToZpl(file, params);
        } else if (fileExtension === 'png') {
          response = await LabelZoomApiService.convertPngToZpl(file, params);
        } else {
          results.push({
            fileName: file.name,
            zplCode: '',
            success: false,
            error: 'Tipo de arquivo não suportado'
          });
          continue;
        }

        if (response.error) {
          results.push({
            fileName: file.name,
            zplCode: '',
            success: false,
            error: response.error
          });
        } else {
          results.push({
            fileName: file.name,
            zplCode: response.zpl || '',
            success: true
          });
        }
      } catch (error) {
        results.push({
          fileName: file.name,
          zplCode: '',
          success: false,
          error: 'Erro inesperado durante a conversão'
        });
      }
    }

    // Chamar callback final
    if (onProgress) {
      onProgress(files.length, files.length, '');
    }

    return results;
  }

  static async createZipFile(results: ConversionResult[]): Promise<Blob> {
    const zip = new JSZip();

    // Adicionar cada arquivo convertido ao ZIP
    results.forEach(result => {
      if (result.success && result.zplCode) {
        const fileName = result.fileName.replace(/\.[^/.]+$/, '') + '.txt';
        zip.file(fileName, result.zplCode);
      }
    });

    // Gerar o arquivo ZIP
    return await zip.generateAsync({ type: 'blob' });
  }

  static downloadZipFile(blob: Blob, fileName: string = 'converted_files.zip') {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
} 