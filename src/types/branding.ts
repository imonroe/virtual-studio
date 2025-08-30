export type LogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface LogoConfig {
  id: string;
  visible: boolean;
  name: string;
  imageUrl: string;
  fileName: string;
  position: LogoPosition;
  size: number; // 50-300px
  opacity: number; // 0-1
  offset: {
    x: number;
    y: number;
  };
  uploadTimestamp: number;
}

export interface BrandingState {
  logos: LogoConfig[];
  maxFileSize: number;
  allowedFormats: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ImageProcessingResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  fileName: string;
}