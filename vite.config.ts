import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'
import { fileURLToPath, URL } from 'node:url'

// Validate Google Analytics environment variables
const validateAnalyticsConfig = () => {
  const measurementId = process.env.VITE_GA_MEASUREMENT_ID
  
  if (measurementId && !/^G-[A-Z0-9]{10}$/.test(measurementId)) {
    console.warn('⚠️  Invalid VITE_GA_MEASUREMENT_ID format. Expected format: G-XXXXXXXXXX')
  }
  
  if (process.env.NODE_ENV === 'production' && !measurementId) {
    console.warn('⚠️  VITE_GA_MEASUREMENT_ID not set for production build')
  }
}

// Run validation
validateAnalyticsConfig()

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    glsl({
      include: [
        '**/*.glsl',
        '**/*.wgsl',
        '**/*.vert',
        '**/*.frag',
        '**/*.vs',
        '**/*.fs'
      ]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@engine': fileURLToPath(new URL('./src/engine', import.meta.url)),
      '@studio': fileURLToPath(new URL('./src/studio', import.meta.url)),
      '@controls': fileURLToPath(new URL('./src/controls', import.meta.url)),
      '@animations': fileURLToPath(new URL('./src/animations', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types', import.meta.url))
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'react-vendor': ['react', 'react-dom'],
          'state': ['zustand', 'immer']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
