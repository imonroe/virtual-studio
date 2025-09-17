# Quickstart: Google Analytics Integration

**Purpose**: Validate Google Analytics GA4 integration works correctly in Virtual Studio

## Prerequisites

1. **Environment Setup**:
   ```bash
   # Create .env.local for development
   echo "VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX" > .env.local
   
   # Replace G-XXXXXXXXXX with your actual GA4 measurement ID
   ```

2. **Development Dependencies**:
   ```bash
   npm install @types/gtag --save-dev
   ```

## Basic Setup Validation

### Step 1: Verify Environment Configuration
```bash
# Start development server
npm run dev

# Check browser console for environment variable
# Should NOT see the measurement ID in development (privacy)
```

### Step 2: Test Analytics Service Initialization
```typescript
// In browser console after app loads:
window.gtag && console.log('gtag loaded successfully');
```

### Step 3: Verify Consent Flow
1. Open application in browser
2. Should see consent banner on first visit
3. Click "Accept" - analytics should initialize
4. Click "Decline" - no analytics events should fire

### Step 4: Test Page View Tracking
1. Navigate between different sections of Virtual Studio
2. Open browser DevTools → Network tab
3. Filter for "google-analytics.com" requests
4. Should see page_view events for each navigation

## Production Validation

### Step 1: Production Build Test
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Verify measurement ID is included in build output
grep -r "VITE_GA_MEASUREMENT_ID" dist/
```

### Step 2: Google Analytics Dashboard
1. Log into Google Analytics
2. Navigate to Real-time reports
3. Interact with Virtual Studio application
4. Verify page views appear in real-time dashboard

## Test Scenarios

### Scenario 1: Basic Page Tracking
**Given**: User visits Virtual Studio for the first time  
**When**: User accepts analytics consent  
**Then**: Page view event sent to GA4  
**Validation**: Check GA4 real-time reports

### Scenario 2: GDPR Compliance
**Given**: User visits Virtual Studio for the first time  
**When**: User declines analytics consent  
**Then**: No analytics events sent to GA4  
**Validation**: Check browser network tab (no GA requests)

### Scenario 3: Error Handling
**Given**: Analytics service fails to load  
**When**: User navigates through application  
**Then**: Application continues to function normally  
**Validation**: No JavaScript errors in console

### Scenario 4: Environment Configuration
**Given**: VITE_GA_MEASUREMENT_ID is not set  
**When**: Application loads  
**Then**: Analytics initialization is skipped gracefully  
**Validation**: Console warning but no errors

## Troubleshooting

### Common Issues

1. **No events in GA4 dashboard**:
   - Check measurement ID format (must be G-XXXXXXXXXX)
   - Verify consent was given
   - Check browser ad blockers/privacy extensions

2. **Environment variable not found**:
   - Ensure VITE_ prefix is used
   - Restart development server after adding variables
   - Check .env.local is not gitignored in development

3. **Console errors**:
   - Verify @types/gtag is installed
   - Check TypeScript configuration includes analytics types
   - Ensure error boundaries are implemented

### Debug Mode

Enable debug mode for detailed logging:
```bash
# Add to .env.local
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GA_DEBUG=true
```

Expected console output in debug mode:
```
[Analytics] Initializing GA4 with measurement ID: G-XXXXXXXXXX
[Analytics] Consent given, analytics ready
[Analytics] Page view tracked: Virtual Studio
[Analytics] Event tracked: user_engagement
```

## Success Criteria

✅ **Environment Setup**: Measurement ID configurable via environment variable  
✅ **Consent Management**: GDPR-compliant consent flow working  
✅ **Page Tracking**: Navigation events appear in GA4 real-time reports  
✅ **Error Handling**: Application stable when analytics fails  
✅ **Performance**: No impact on Virtual Studio's 60fps rendering  

## Next Steps

After quickstart validation passes:
1. Configure production measurement ID in deployment environment
2. Test with real user scenarios
3. Set up GA4 custom dimensions if needed
4. Configure data retention policies in GA4 dashboard