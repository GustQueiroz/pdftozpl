import axios from 'axios';

// Tipos inline para evitar problemas de importação
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

const API_BASE_URL = '/api'; // Usando proxy local
const API_KEY = import.meta.env.VITE_API_KEY;

export class LabelZoomApiService {
  private static async makeRequest(
    endpoint: string,
    file: File,
    params?: LabelZoomParams
  ): Promise<ConversionResponse> {
    try {
      const urlParams = new URLSearchParams();
      if (params) {
        urlParams.append('params', JSON.stringify(params));
      }

      const headers: Record<string, string> = {
        'Content-Type': file.type,
        'Accept': 'text/plain',
        'Authorization': `Bearer ${API_KEY}`,
      };

      const response = await axios.post(
        `${API_BASE_URL}${endpoint}?${urlParams.toString()}`,
        file,
        {
          headers,
          timeout: 30000, // 30 segundos
          responseType: 'text',
        }
      );

      return { zpl: response.data };
    } catch (error: unknown) {
      console.error('Erro na requisição para LabelZoom API:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number; data: string } };
        return { error: `Erro ${axiosError.response.status}: ${axiosError.response.data || 'Erro desconhecido'}` };
      } else if (error && typeof error === 'object' && 'request' in error) {
        return { error: 'Erro de conexão. Verifique sua internet e tente novamente.' };
      } else {
        return { error: 'Erro interno. Tente novamente.' };
      }
    }
  }

  static async convertPdfToZpl(file: File, params?: LabelZoomParams): Promise<ConversionResponse> {
    return this.makeRequest('/convert/pdf/to/zpl', file, params);
  }

  static async convertPngToZpl(file: File, params?: LabelZoomParams): Promise<ConversionResponse> {
    return this.makeRequest('/convert/png/to/zpl', file, params);
  }

  static async convertZplToPdf(zplCode: string, params?: LabelZoomParams): Promise<ConversionResponse> {
    try {
      const urlParams = new URLSearchParams();
      if (params) { urlParams.append('params', JSON.stringify(params)); }

      const headers: Record<string, string> = {
        'Content-Type': 'text/plain',
        'Accept': 'application/pdf',
        'Authorization': `Bearer ${API_KEY}`,
      };

      await axios.post(
        `${API_BASE_URL}/convert/zpl/to/pdf?${urlParams.toString()}`,
        zplCode,
        { headers, timeout: 30000, responseType: 'blob' }
      );

      return { zpl: 'PDF gerado com sucesso' };
    } catch (error: unknown) {
      console.error('Erro na conversão ZPL para PDF:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number; data: string } };
        return { error: `Erro ${axiosError.response.status}: ${axiosError.response.data || 'Erro desconhecido'}` };
      } else if (error && typeof error === 'object' && 'request' in error) {
        return { error: 'Erro de conexão. Verifique sua internet e tente novamente.' };
      } else {
        return { error: 'Erro interno. Tente novamente.' };
      }
    }
  }
} 