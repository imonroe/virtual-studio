# Data Model: Google Analytics Integration

**Generated**: 2025-09-17  
**Context**: Simple GA4 integration data structures for Virtual Studio

## Core Entities

### AnalyticsConfig
Configuration entity for Google Analytics settings.

**Fields**:
- `measurementId: string` - GA4 measurement ID (G-XXXXXXXXXX format)
- `enabled: boolean` - Whether analytics tracking is active
- `consentGiven: boolean` - User consent status for GDPR compliance
- `debug: boolean` - Enable debug mode for development

**Validation Rules**:
- measurementId must match pattern `^G-[A-Z0-9]{10}$`
- measurementId is required when enabled is true
- consentGiven must be true before any tracking occurs

**State Transitions**:
```
Uninitialized → Configured (when measurementId provided)
Configured → Active (when consent given and enabled)
Active → Inactive (when consent withdrawn or disabled)
```

### AnalyticsEvent
Represents events that can be tracked by Google Analytics.

**Fields**:
- `eventName: string` - GA4 event name (e.g., 'page_view', 'user_engagement')
- `parameters: Record<string, any>` - Event parameters as key-value pairs
- `timestamp: Date` - When the event occurred
- `sessionId?: string` - Optional session identifier

**Validation Rules**:
- eventName must be non-empty string
- eventName should follow GA4 naming conventions (lowercase, underscores)
- parameters object should be serializable

**Standard Events**:
- `page_view`: { page_title, page_location }
- `user_engagement`: { engagement_time_msec }

### ConsentState
Manages GDPR consent status for analytics.

**Fields**:
- `analyticsStorage: boolean` - Consent for analytics cookies
- `adStorage: boolean` - Consent for advertising cookies (set to false)
- `consentTimestamp: Date` - When consent was given/withdrawn
- `consentVersion: string` - Version of consent prompt shown

**Validation Rules**:
- consentTimestamp required when any consent value is true
- consentVersion should match current app version format

## Relationships

- **AnalyticsConfig** uses **ConsentState** to determine if tracking is allowed
- **AnalyticsEvent** instances are only created when **AnalyticsConfig** is active
- **ConsentState** directly affects **AnalyticsConfig.enabled** status

## Storage Strategy

**Environment Variables** (Build-time):
- `VITE_GA_MEASUREMENT_ID`: Static measurement ID for the environment

**Local Storage** (Runtime):
- `ga-consent-state`: Persisted consent preferences
- No other analytics data stored locally (respects privacy)

**Memory Only**:
- Active analytics configuration
- Event queue (for offline scenarios)

## Privacy Considerations

- No personally identifiable information in any data structure
- Consent state persisted to respect user choices
- All tracking data sent directly to Google (no local retention)
- Measurement ID only exposed in production builds