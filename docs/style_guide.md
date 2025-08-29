# Virtual Studio Design System & Style Guide

## Overview

Virtual Studio is a browser-based broadcast graphics application designed for content creators. This style guide defines the visual design system that ensures consistency, accessibility, and performance across all components.

**Design Philosophy:**
- **Dark-first Design**: Optimized for broadcast environments and streaming setups
- **Glass-morphism Aesthetic**: Semi-transparent surfaces with backdrop blur effects
- **Performance-focused**: Designed for 60fps real-time rendering
- **Accessibility-first**: WCAG compliant with reduced motion and high contrast support
- **Mobile-responsive**: Adaptive layouts for all screen sizes

---

## Color Palette

### Primary Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Deep Black** | `#0a0a0a` | `10, 10, 10` | Primary background, app container |
| **Dark Gray** | `#1a1a1a` | `26, 26, 26` | Secondary backgrounds, studio container |
| **Medium Dark** | `#222222` | `34, 34, 34` | Panel headers, elevated surfaces |
| **Input Dark** | `#2a2a2a` | `42, 42, 42` | Form inputs, interactive elements |

### Text Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary Text** | `#ffffff` | Primary text, headings |
| **Secondary Text** | `#cccccc` | Secondary text, labels |
| **Muted Text** | `#aaaaaa` | Tertiary text, placeholders |
| **Subtle Text** | `#888888` | Status text, metadata |

### Accent Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary Accent** | `#646cff` | Active states, primary buttons, focus |
| **Secondary Accent** | `#535bf2` | Hover states, pressed buttons |
| **Focus Blue** | `#646cff` | Focus outlines, accessibility |

### Border Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary Border** | `#333333` | Panel dividers, component borders |
| **Input Border** | `#444444` | Form inputs, interactive borders |
| **Hover Border** | `#555555` | Hover states for borders |

### Semantic Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Danger/Error** | `#dc2626` | Error states, delete actions |
| **Danger Hover** | `#b91c1c` | Danger button hover states |
| **Breaking News** | `#ff0000` | Ticker news, live indicators |
| **Sports** | `#00ff00` | Sports content styling |
| **Business** | `#0066cc` | Business content styling |
| **Tech** | `#9b59b6` | Technology content styling |

### Glass-morphism Colors

```css
/* Standard glass-morphism background */
background: rgba(0, 0, 0, 0.8);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);

/* Enhanced glass-morphism for highlights */
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(20px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.2);
box-shadow: 
  0 8px 32px 0 rgba(31, 38, 135, 0.15),
  inset 0 0 0 1px rgba(255, 255, 255, 0.05);
```

---

## Typography

### Font Stack
**Primary Font Family:** `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif`

Inter is chosen for its excellent readability, modern appearance, and comprehensive character set suitable for international content.

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| **Regular** | `400` | Body text, standard content |
| **Medium** | `500` | Control labels, emphasized text |
| **Semibold** | `600` | Section headings, panel titles |
| **Bold** | `700` | Ticker labels, strong emphasis |
| **Black** | `900` | High contrast accessibility mode |

### Font Sizes & Hierarchy

| Level | Size | Line Height | Usage |
|-------|------|-------------|--------|
| **H1** | `20px` | `1.2` | Main panel headers |
| **H2** | `18px` | `1.2` | Section headings |
| **H3** | `14px` | `1.3` | Subsection headings |
| **Body** | `14px` | `1.5` | Standard body text |
| **Body Small** | `13px` | `1.4` | Control labels |
| **Caption** | `12px` | `1.3` | Status text, metadata |
| **Micro** | `10px` | `1.2` | Mobile labels, compact text |

### Special Typography

#### Lower Third Typography
```css
.lower-third-title {
  font-weight: 600;
  line-height: 1.2;
  font-size: 1.1em; /* Relative to parent */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.lower-third-subtitle {
  font-weight: 400;
  line-height: 1.3;
  opacity: 0.9;
  font-size: 0.85em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
```

#### Ticker Typography
```css
.ticker-text {
  font-weight: 500;
  font-size: 14px;
  line-height: 1;
}

.ticker-label {
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 0.8em;
}
```

#### Control Panel Typography
```css
.control-section h3 {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.control-label {
  font-size: 13px;
  font-weight: 500;
}
```

---

## Layout & Spacing

### Spacing Scale
Virtual Studio uses a consistent 4px-based spacing scale:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | `4px` | Icon spacing, minimal gaps |
| `sm` | `8px` | Component internal spacing |
| `md` | `12px` | Form element spacing |
| `lg` | `16px` | Section spacing, padding |
| `xl` | `20px` | Container spacing |
| `2xl` | `24px` | Major section spacing |

### Grid & Layout

#### App Layout Structure
```css
.app {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.studio-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 20px;
}

.studio-stage {
  aspect-ratio: 16/9;
  max-width: min(calc(100vh * 16/9), calc(100vw - 360px - 40px));
  border-radius: 8px;
}
```

#### Control Panel Layout
- **Width:** `360px` (desktop), `100%` (mobile)
- **Header:** `20px 24px` padding
- **Content:** `24px` padding per section
- **Footer:** `16px 24px` padding

### Z-Index Hierarchy

| Layer | Value | Usage |
|-------|-------|-------|
| **Background** | `0` | Background elements |
| **Studio Overlay** | `10` | Clock, overlays in studio |
| **Ticker** | `15` | Ticker tape |
| **Lower Thirds** | `20` | Lower third graphics |
| **Control Panel** | `100` | Side control panel |
| **Mobile Toggle** | `1000` | Mobile control toggle |

---

## Component Design Patterns

### Button System

#### Primary Button
```css
.control-button.primary {
  background: #646cff;
  border: 1px solid #646cff;
  color: #ffffff;
  padding: 12px 16px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.control-button.primary:hover {
  background: #535bf2;
  border-color: #535bf2;
}
```

#### Secondary Button
```css
.control-button {
  background: #2a2a2a;
  border: 1px solid #444;
  color: #fff;
  padding: 12px 16px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.control-button:hover {
  background: #333;
  border-color: #555;
}
```

#### Danger Button
```css
.control-button.danger {
  background: #dc2626;
  border-color: #dc2626;
  color: #ffffff;
}

.control-button.danger:hover {
  background: #b91c1c;
  border-color: #b91c1c;
}
```

### Form Controls

#### Input Fields
```css
.control-input {
  width: 100%;
  padding: 10px 12px;
  background: #2a2a2a;
  color: #fff;
  border: 1px solid #444;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.control-input:focus {
  outline: none;
  border-color: #646cff;
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.1);
}
```

#### Range Sliders
```css
.control-input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  background: #444;
  border-radius: 3px;
}

.control-input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: #646cff;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
```

### Tab System
```css
.control-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  min-width: 72px;
  border-bottom: 2px solid transparent;
  color: #aaa;
  transition: all 0.2s ease;
}

.control-tab.active {
  color: #646cff;
  border-bottom-color: #646cff;
  background: rgba(100, 108, 255, 0.1);
}
```

### Glass-morphism Components

#### Standard Glass Effect
```css
.glass-panel {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
```

#### Enhanced Glass Effect
```css
.glass-panel-enhanced {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}
```

---

## Animation & Transitions

### Standard Transitions
- **Quick interactions:** `0.2s ease`
- **Panel transitions:** `0.3s ease`
- **Background changes:** `0.5s ease`

### Animation Types

#### Slide Animations
```css
/* Enter from left */
.animation-slide.enter {
  transform: translateX(-100%);
  opacity: 0;
}

.animation-slide.active {
  transform: translateX(0);
  opacity: 1;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
              opacity 0.3s ease;
}
```

#### Fade Animations
```css
.animation-fade.enter {
  opacity: 0;
  transform: translateY(20px);
}

.animation-fade.active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
```

#### Scale Animations
```css
.animation-scale.enter {
  opacity: 0;
  transform: scale(0.8);
}

.animation-scale.active {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.4s ease, 
              transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Hover Effects
```css
/* Standard hover scale */
.hover-scale:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

/* Button hover effects */
.control-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
```

---

## Responsive Design

### Breakpoints
| Size | Width | Usage |
|------|-------|-------|
| **Mobile** | `d 480px` | Small phone screens |
| **Tablet** | `d 768px` | Tablet and large phone screens |
| **Desktop** | `> 768px` | Desktop and laptop screens |

### Mobile Adaptations

#### Control Panel
```css
@media (max-width: 768px) {
  .control-panel {
    width: 100%;
  }
  
  .control-panel-toggle {
    display: flex; /* Show toggle button */
  }
  
  .control-tab {
    flex: 1;
    min-width: 0;
  }
}
```

#### Studio Stage
```css
@media (max-width: 768px) {
  .studio-stage {
    border-radius: 4px;
    min-width: 320px;
  }
  
  .lower-third {
    max-width: calc(100vw - 40px);
    left: 20px !important;
  }
}
```

---

## Accessibility

### Focus States
All interactive elements must have visible focus indicators:
```css
:focus-visible {
  outline: 2px solid #646cff;
  outline-offset: 2px;
}

.control-input:focus {
  border-color: #646cff;
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.1);
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .ticker-text {
    animation: none !important;
  }
}
```

### High Contrast
```css
@media (prefers-contrast: high) {
  .control-input {
    border-width: 2px;
  }
  
  .ticker-container {
    border-top-width: 3px;
  }
  
  .ticker-label {
    font-weight: 900;
  }
}
```

### Color Accessibility
All text meets WCAG AA contrast requirements:
- **White on #0a0a0a:** 19.56:1 (AAA)
- **#ccc on #2a2a2a:** 5.74:1 (AA)
- **#646cff on #ffffff:** 5.88:1 (AA)

---

## Custom CSS Properties (Theme Variables)

### Component-specific Variables

#### Lower Third
```css
.lower-third {
  --bg-color: rgba(0, 0, 0, 0.8);
  --text-color: #ffffff;
  --font-size: 16px;
  --font-family: 'Inter', sans-serif;
  --padding: 16px;
  --border-radius: 4px;
}
```

#### Ticker
```css
.ticker-container {
  --bg-color: rgba(0, 0, 0, 0.9);
  --text-color: #ffffff;
  --font-size: 14px;
  --scroll-speed: 50s;
  --animation-duration: 30s;
}
```

### Usage Pattern
Use CSS custom properties for themeable components:
1. Define defaults in component CSS
2. Override via inline styles for customization
3. Maintain fallbacks for older browsers

---

## Performance Considerations

### Optimization Guidelines
1. **Use `will-change` for animated elements:**
   ```css
   .ticker-text {
     will-change: transform;
   }
   ```

2. **Prefer `transform` and `opacity` for animations:**
   ```css
   /* Good - GPU accelerated */
   .animate { transform: translateX(100%); opacity: 0; }
   
   /* Avoid - causes reflow */
   .animate { left: 100px; display: none; }
   ```

3. **Use `contain` for isolated components:**
   ```css
   .studio-stage {
     contain: layout style paint;
   }
   ```

4. **Minimize backdrop-filter usage:**
   - Limit to essential glass-morphism effects
   - Avoid on frequently updated elements

---

## Browser Compatibility

### Supported Browsers
- **Chrome:** 88+ (full support)
- **Firefox:** 85+ (full support)
- **Safari:** 14+ (full support)
- **Edge:** 88+ (full support)

### Fallbacks
- **backdrop-filter:** Fallback to solid backgrounds
- **CSS Grid:** Flexbox fallbacks provided
- **Custom Properties:** Static values for IE11 if needed

---

## Usage Examples

### Creating a New Glass Panel
```css
.my-glass-panel {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 16px;
  color: #fff;
}
```

### Creating an Interactive Button
```css
.my-button {
  background: #2a2a2a;
  border: 1px solid #444;
  color: #fff;
  padding: 12px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.my-button:hover {
  background: #333;
  border-color: #555;
  transform: translateY(-1px);
}

.my-button:focus-visible {
  outline: 2px solid #646cff;
  outline-offset: 2px;
}
```

### Creating Responsive Text
```css
.my-text {
  font-size: 14px;
  line-height: 1.5;
  color: #ccc;
}

@media (max-width: 480px) {
  .my-text {
    font-size: 12px;
    line-height: 1.4;
  }
}
```

---

## Maintenance & Evolution

### Adding New Colors
1. Add to color palette section
2. Update CSS custom properties if needed
3. Test contrast ratios for accessibility
4. Document usage guidelines

### Updating Component Patterns
1. Update existing components consistently
2. Add new patterns to this guide
3. Test across all breakpoints
4. Verify accessibility compliance

### Version Control
- Document all changes to this style guide
- Test visual regression before major updates
- Maintain backward compatibility when possible

---

*This style guide is a living document that evolves with Virtual Studio. Last updated: August 2025*