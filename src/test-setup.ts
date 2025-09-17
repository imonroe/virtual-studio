import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock environment variables for testing
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_GA_MEASUREMENT_ID: 'G-TEST123456'
  },
  writable: true
})

// Mock window.gtag
Object.defineProperty(window, 'gtag', {
  value: vi.fn(),
  writable: true
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})