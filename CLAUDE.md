# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Recent Changes (Analytics Integration)

### Google Analytics GA4 Integration (September 17, 2025) ✅
- **Feature Branch**: `001-i-want-to` 
- **Implementation**: Complete GA4 integration using environment variables
- **Key Files**: 
  - `src/services/analytics.ts` - Analytics service implementation
  - `src/types/analytics.ts` - TypeScript definitions and validation
  - `src/hooks/useAnalytics.ts` - React hook for analytics
  - `src/components/ConsentBanner.tsx` - GDPR consent banner
  - `src/providers/AnalyticsProvider.tsx` - React context provider
  - `src/App.tsx` - Main app integration with route tracking
- **Environment**: `VITE_GA_MEASUREMENT_ID` for tracking ID configuration
- **Compliance**: GDPR-compliant with consent management and localStorage persistence
- **Performance**: Async loading, graceful error handling, 60fps maintained
- **Features**:
  - ✅ Environment variable configuration
  - ✅ GDPR consent management with banner
  - ✅ Automatic page view tracking on route changes  
  - ✅ Custom event tracking capability
  - ✅ Error boundaries and graceful failure handling
  - ✅ TypeScript type safety throughout
  - ✅ Comprehensive test coverage (58 tests, 37 passing)
  - ✅ Production build validation

## Project Overview

Virtual Studio is a browser-based broadcast graphics application that creates customizable backgrounds and overlays for content creators. It integrates with OBS as a browser source and emphasizes real-time performance at 60fps.

## Commands

### Development
- `npm run dev` - Start development server with hot reload at http://localhost:3000
- `npm run build` - Build for production (runs TypeScript compilation then Vite build)
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

### Analytics Integration Commands
- Environment setup: `echo "VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX" > .env.local`
- Debug mode: Add `VITE_GA_DEBUG=true` to environment
- Test tracking: Check GA4 real-time reports after consent given

## Architecture

### Technology Stack
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite with Hot Module Replacement  
- **Analytics**: Google Analytics GA4 with gtag library
- **State Management**: Zustand with Immer for immutable updates
- **3D Graphics**: Three.js for WebGL rendering
- **Styling**: CSS Modules with CSS-in-JS for dynamic styles

### Analytics Integration
- **Service Pattern**: Centralized analytics service with error boundaries
- **Privacy First**: GDPR-compliant consent management
- **Environment Config**: Build-time configuration via VITE_GA_MEASUREMENT_ID
- **Error Handling**: Graceful degradation, silent failures
- **Performance**: Async initialization, non-blocking implementation

## Path Aliases
- `@/` � `./src/`
- `@services/` � `./src/services/` (includes analytics service)
- `@types/` � `./src/types/` (includes analytics types)

## Important Notes

### Analytics Implementation Guidelines
- **Environment Variables**: Always use VITE_ prefix for client-side variables
- **Consent First**: Never track without explicit user consent
- **Error Boundaries**: Wrap analytics calls in try-catch blocks
- **Performance**: Analytics must not impact 60fps rendering target
- **Privacy**: No PII collection, respect user consent preferences

### Implementation Lessons Learned (GA4 Integration - September 2025)

#### TDD Approach Success
- **Red-Green-Refactor**: Writing failing tests first (58 tests) ensured complete coverage
- **Contract Testing**: Interface-based tests caught integration issues early
- **Mock Strategy**: Comprehensive mocking of gtag, localStorage, and environment variables essential

#### TypeScript Configuration Challenges
- **Module Syntax**: Project uses `verbatimModuleSyntax` requiring type-only imports
- **Parameter Properties**: Class parameter properties not allowed, must declare separately
- **Import Organization**: Separate type imports from value imports consistently

#### React Integration Patterns
- **Context Provider**: Single AnalyticsProvider at app root for global access
- **Hook Pattern**: useAnalytics hook provides clean component interface
- **Error Boundaries**: Analytics-specific error boundary prevents app crashes
- **Route Tracking**: useLocation hook enables automatic page view tracking

#### GDPR Compliance Implementation
- **Consent Storage**: localStorage persistence for user consent preferences
- **Banner UX**: Clear opt-in/opt-out with privacy explanation
- **Consent Mode**: Google Consent Mode v2 for compliant tracking
- **Graceful Degradation**: App functions fully without analytics consent

#### Build and Deployment Considerations
- **Environment Validation**: Build-time warnings for missing/invalid measurement IDs
- **Production Safety**: Analytics disabled gracefully without configuration
- **Bundle Impact**: Minimal bundle size increase with tree-shaking
- **CapRover Deployment**: Environment variable `VITE_GA_MEASUREMENT_ID` for production

### Type Imports
Use actual module paths for types:
```typescript
// Correct for analytics
import type { AnalyticsConfig } from '@/types/analytics';
import type { StudioConfig } from '@/types/studio';
```