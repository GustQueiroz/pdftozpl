/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LabelZoomParams {
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
  data?: Array<Record<string, any>>;
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

export interface ConversionResponse {
  zpl?: string;
  error?: string;
  message?: string;
}

export interface ConversionRequest {
  file: File;
  params?: LabelZoomParams;
  apiKey?: string;
} 