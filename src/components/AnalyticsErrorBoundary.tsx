/**
 * AnalyticsErrorBoundary Component
 * 
 * React error boundary specifically for analytics functionality.
 * Prevents analytics errors from breaking the main application.
 */

import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AnalyticsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error for debugging
    console.warn('[AnalyticsErrorBoundary] Analytics component error:', error, errorInfo);
    
    // Call the optional error handler
    this.props.onError?.(error, errorInfo);
    
    // Don't let analytics errors break the app - just log them
  }

  render() {
    if (this.state.hasError) {
      // Return fallback UI or nothing to prevent analytics errors from showing to users
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}

/**
 * HOC to wrap components with analytics error boundary
 */
export function withAnalyticsErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WithErrorBoundaryComponent = (props: P) => (
    <AnalyticsErrorBoundary 
      fallback={fallback}
      onError={(error, errorInfo) => {
        console.warn(`Analytics error in ${Component.displayName || Component.name}:`, error, errorInfo);
      }}
    >
      <Component {...props} />
    </AnalyticsErrorBoundary>
  );
  
  WithErrorBoundaryComponent.displayName = `withAnalyticsErrorBoundary(${Component.displayName || Component.name})`;
  
  return WithErrorBoundaryComponent;
}