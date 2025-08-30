import React, { useRef, useState } from 'react';
import { useStudioStore } from '@/services/state/studioStore';
import type { LogoPosition } from '@/types/branding';
import styles from './BrandingControls.module.css';

export const BrandingControls: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const logos = useStudioStore((state) => state.logos);
  const { addLogo, updateLogo, removeLogo, toggleLogo } = useStudioStore();

  const handleFileUpload = async (files: FileList | null, position: LogoPosition = 'bottom-right') => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);
    setUploadError(null);

    try {
      await addLogo(file, position);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileUpload(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const positionLabels = {
    'top-left': 'Top Left',
    'top-right': 'Top Right',
    'bottom-left': 'Bottom Left',
    'bottom-right': 'Bottom Right'
  };

  return (
    <div className={styles.brandingControls}>
      {/* Upload Section */}
      <div className={styles.controlSection}>
        <h3>Add Logo</h3>
        <div
          className={`${styles.uploadZone} ${uploading ? styles.uploading : ''}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
          {uploading ? (
            <div className={styles.uploadStatus}>Uploading...</div>
          ) : (
            <div className={styles.uploadContent}>
              <div className={styles.uploadIcon}>📁</div>
              <div className={styles.uploadText}>
                <div>Click to upload or drag and drop</div>
                <div className={styles.uploadHint}>PNG, JPG, SVG (max 5MB)</div>
              </div>
            </div>
          )}
        </div>
        {uploadError && (
          <div className={styles.errorMessage}>{uploadError}</div>
        )}
      </div>

      {/* Logo List */}
      {logos.length > 0 && (
        <div className={styles.controlSection}>
          <h3>Logos ({logos.length}/4)</h3>
          <div className={styles.logoList}>
            {logos.map((logo) => (
              <div key={logo.id} className={styles.logoItem}>
                <div className={styles.logoPreview}>
                  <img
                    src={logo.imageUrl}
                    alt={logo.name}
                    className={styles.logoThumbnail}
                  />
                </div>
                
                <div className={styles.logoControls}>
                  <div className={styles.logoHeader}>
                    <span className={styles.logoName}>{logo.fileName}</span>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={logo.visible}
                        onChange={() => toggleLogo(logo.id)}
                      />
                      Show
                    </label>
                  </div>

                  {/* Position Control */}
                  <div className={styles.controlGroup}>
                    <label>Position</label>
                    <select
                      value={logo.position}
                      onChange={(e) => updateLogo(logo.id, {
                        position: e.target.value as LogoPosition
                      })}
                    >
                      {Object.entries(positionLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Size Control */}
                  <div className={styles.controlGroup}>
                    <label>Size: {logo.size}px</label>
                    <input
                      type="range"
                      min="50"
                      max="300"
                      value={logo.size}
                      onChange={(e) => updateLogo(logo.id, {
                        size: parseInt(e.target.value)
                      })}
                    />
                  </div>

                  {/* Opacity Control */}
                  <div className={styles.controlGroup}>
                    <label>Opacity: {Math.round(logo.opacity * 100)}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={Math.round(logo.opacity * 100)}
                      onChange={(e) => updateLogo(logo.id, {
                        opacity: parseInt(e.target.value) / 100
                      })}
                    />
                  </div>

                  {/* Position Offset */}
                  <div className={styles.controlGroup}>
                    <label>Offset</label>
                    <div className={styles.offsetControls}>
                      <div className={styles.offsetInput}>
                        <label>X:</label>
                        <input
                          type="number"
                          min="0"
                          max="200"
                          value={logo.offset.x}
                          onChange={(e) => updateLogo(logo.id, {
                            offset: { ...logo.offset, x: parseInt(e.target.value) || 0 }
                          })}
                        />
                      </div>
                      <div className={styles.offsetInput}>
                        <label>Y:</label>
                        <input
                          type="number"
                          min="0"
                          max="200"
                          value={logo.offset.y}
                          onChange={(e) => updateLogo(logo.id, {
                            offset: { ...logo.offset, y: parseInt(e.target.value) || 0 }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    className={styles.removeLogoBtn}
                    onClick={() => removeLogo(logo.id)}
                  >
                    Remove Logo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Storage Info */}
      <div className={styles.controlSection}>
        <div className={styles.storageInfo}>
          <small>
            Storage: {logos.length}/4 logos • 
            {logos.reduce((total, logo) => total + (logo.imageUrl.length * 0.75), 0) > 1024 * 1024
              ? `${(logos.reduce((total, logo) => total + (logo.imageUrl.length * 0.75), 0) / 1024 / 1024).toFixed(1)}MB`
              : `${Math.round(logos.reduce((total, logo) => total + (logo.imageUrl.length * 0.75), 0) / 1024)}KB`
            } used
          </small>
        </div>
      </div>
    </div>
  );
};