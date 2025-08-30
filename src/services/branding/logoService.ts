import type { ValidationResult, ImageProcessingResult } from '@/types/branding';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const logoService = {
  validateFile(file: File): ValidationResult {
    const errors: string[] = [];

    if (file.size > MAX_FILE_SIZE) {
      errors.push(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 5MB limit`);
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push('Only PNG, JPG, and SVG files are supported');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  async processImage(file: File): Promise<ImageProcessingResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const dataUrl = e.target?.result as string;
          
          // For SVG files, use directly without compression
          if (file.type === 'image/svg+xml') {
            resolve({
              dataUrl,
              originalSize: file.size,
              compressedSize: file.size,
              fileName: file.name
            });
            return;
          }
          
          // For images larger than 2MB, apply compression
          if (file.size > 2 * 1024 * 1024) {
            const compressed = await this.compressImage(dataUrl, 0.8);
            resolve({
              dataUrl: compressed,
              originalSize: file.size,
              compressedSize: Math.round(compressed.length * 0.75), // Approximate
              fileName: file.name
            });
          } else {
            resolve({
              dataUrl,
              originalSize: file.size,
              compressedSize: file.size,
              fileName: file.name
            });
          }
        } catch {
          reject(new Error('Failed to process image'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },

  async compressImage(dataUrl: string, quality: number): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate dimensions while maintaining aspect ratio, max 800px
        const maxSize = 800;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Enable smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };

      img.src = dataUrl;
    });
  },

  generateLogoId(): string {
    return `logo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};