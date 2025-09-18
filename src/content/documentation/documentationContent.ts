import type { DocumentationStructure, KeyboardShortcut, TroubleshootingEntry } from '@/types/documentation';

export const keyboardShortcuts: KeyboardShortcut[] = [
  // Background Controls
  { key: '0', description: 'Toggle background visibility', category: 'Backgrounds', context: 'Global' },
  
  // Graphics Controls
  { key: '1', description: 'Toggle clock visibility', category: 'Graphics', context: 'Global' },
  { key: '2', description: 'Toggle live indicator', category: 'Graphics', context: 'Global' },
  { key: '3', description: 'Toggle lower third visibility', category: 'Graphics', context: 'Global' },
  { key: '4', description: 'Toggle ticker visibility', category: 'Graphics', context: 'Global' },
  
  // Application Controls
  { key: 'Tab', description: 'Toggle control panel', category: 'Application', context: 'Global' },
  { key: 'P', description: 'Toggle preview mode', category: 'Application', context: 'Global' },
  { key: 'Escape', description: 'Hide all overlays', category: 'Application', context: 'Global' }
];

export const troubleshootingEntries: TroubleshootingEntry[] = [
  {
    id: 'obs-black-screen',
    problem: 'Black screen in OBS browser source',
    symptoms: ['Browser source shows black/empty screen', 'No graphics visible in OBS', 'Loading indicator spinning'],
    solution: 'Ensure the browser source URL is correct (http://localhost:3000/app), set width to 1920 and height to 1080, and verify Virtual Studio is running in your browser.',
    category: 'OBS Integration',
    relatedFeatures: ['obs-integration']
  },
  {
    id: 'performance-lag',
    problem: 'Performance issues or lag',
    symptoms: ['Stuttering animations', 'Low frame rate', 'Browser becomes unresponsive'],
    solution: 'Try switching to CSS rendering mode, close other browser tabs, reduce animated background complexity, or update your graphics drivers.',
    category: 'Performance',
    relatedFeatures: ['backgrounds', 'graphics']
  },
  {
    id: 'keyboard-shortcuts-not-working',
    problem: 'Keyboard shortcuts not responding',
    symptoms: ['Key presses have no effect', 'Shortcuts work intermittently', 'Only some shortcuts work'],
    solution: 'Click on the Virtual Studio window to ensure it has focus, check that no modal dialogs are open, and verify your browser allows keyboard events.',
    category: 'Controls',
    relatedFeatures: ['keyboard-shortcuts']
  },
  {
    id: 'mobile-layout-issues',
    problem: 'Mobile layout problems',
    symptoms: ['Controls off-screen', 'Text too small', 'Touch controls unresponsive'],
    solution: 'Rotate device to landscape mode, zoom out if needed, or use the desktop version for full control capabilities.',
    category: 'Mobile',
    relatedFeatures: ['responsive-design']
  },
  {
    id: 'logo-upload-failed',
    problem: 'Logo upload not working',
    symptoms: ['Upload button unresponsive', 'Image appears corrupted', 'File size error'],
    solution: 'Ensure image is under 5MB, use supported formats (PNG, JPG, SVG), and check that your browser allows file uploads.',
    category: 'Branding',
    relatedFeatures: ['logos', 'branding']
  }
];

export const documentationStructure: DocumentationStructure = {
  sections: [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'New to Virtual Studio? Start here for a quick introduction.',
      icon: '🚀',
      order: 1,
      subsections: [
        {
          id: 'overview',
          title: 'Overview',
          order: 1,
          content: {
            overview: 'Virtual Studio is a browser-based broadcast graphics application that creates customizable backgrounds and overlays for content creators. Perfect for live streaming, video recording, and professional presentations.',
            steps: [
              {
                number: 1,
                title: 'Open Virtual Studio',
                description: 'Navigate to Virtual Studio in your web browser. The application works best in Chrome, Firefox, or Edge.',
                tip: 'Bookmark the URL for quick access during streaming sessions.'
              },
              {
                number: 2,
                title: 'Choose Your Background',
                description: 'Select from gradient, solid color, animated, or image backgrounds using the control panel on the right.',
                tip: 'Animated backgrounds look great but use more system resources.'
              },
              {
                number: 3,
                title: 'Add Graphics Elements',
                description: 'Configure lower thirds, tickers, logos, and overlays to enhance your presentation.',
                tip: 'Start with simple elements and build complexity as needed.'
              },
              {
                number: 4,
                title: 'Set Up OBS Integration',
                description: 'Add Virtual Studio as a browser source in OBS Studio for seamless streaming integration.',
                tip: 'Use 1920x1080 resolution for best quality.'
              }
            ],
            relatedLinks: [
              {
                title: 'OBS Integration Guide',
                sectionId: 'obs-integration',
                subsectionId: 'setup',
                description: 'Detailed setup instructions for OBS Studio'
              },
              {
                title: 'Keyboard Shortcuts',
                sectionId: 'keyboard-shortcuts',
                description: 'Learn the quick keys for efficient control'
              }
            ]
          }
        },
        {
          id: 'first-time-setup',
          title: 'First Time Setup',
          order: 2,
          content: {
            overview: 'Get Virtual Studio configured properly for your first streaming or recording session.',
            steps: [
              {
                number: 1,
                title: 'Check System Requirements',
                description: 'Ensure you have a modern browser and sufficient system resources for smooth operation.',
                tip: 'Chrome and Firefox generally provide the best performance.'
              },
              {
                number: 2,
                title: 'Configure Display Settings',
                description: 'Set your browser to fullscreen mode for the cleanest capture in OBS.',
                tip: 'Press F11 to toggle fullscreen, or use the keyboard shortcut.'
              },
              {
                number: 3,
                title: 'Test Performance',
                description: 'Try different background types to find what works best with your system.',
                tip: 'If you experience lag, switch to solid color or simple gradient backgrounds.'
              },
              {
                number: 4,
                title: 'Save Your First Preset',
                description: 'Once you have a setup you like, save it as a preset for quick access using the preset controls.',
                tip: 'Presets help you quickly switch between different studio configurations.'
              }
            ]
          }
        }
      ]
    },
    {
      id: 'backgrounds',
      title: 'Backgrounds',
      description: 'Create stunning visual backdrops for your content.',
      icon: '🎨',
      order: 2,
      subsections: [
        {
          id: 'gradient-backgrounds',
          title: 'Gradient Backgrounds',
          order: 1,
          content: {
            overview: 'Create beautiful gradient backgrounds with customizable colors, directions, and animation effects.',
            steps: [
              {
                number: 1,
                title: 'Select Gradient Type',
                description: 'Choose from linear, radial, or conic gradient types in the background controls.',
                tip: 'Linear gradients work well for subtle backgrounds, while radial creates more dramatic effects.'
              },
              {
                number: 2,
                title: 'Configure Colors',
                description: 'Set start and end colors using the color pickers. You can use any colors that match your brand.',
                tip: 'Use complementary colors for smooth transitions, or contrasting colors for bold effects.'
              },
              {
                number: 3,
                title: 'Adjust Direction',
                description: 'Change the gradient direction using the angle control or preset direction buttons.',
                tip: 'Diagonal gradients (45° or 135°) often look more dynamic than horizontal or vertical.'
              },
              {
                number: 4,
                title: 'Add Animation (Optional)',
                description: 'Enable animation to make your gradient slowly shift and change over time.',
                tip: 'Subtle animation adds visual interest without being distracting.'
              }
            ],
            examples: [
              {
                title: 'Professional Blue Theme',
                description: 'A corporate-friendly gradient',
                result: 'Deep blue to light blue diagonal gradient perfect for business presentations'
              },
              {
                title: 'Gaming Purple Theme',
                description: 'High-energy gradient for gaming content',
                result: 'Animated purple to pink radial gradient with subtle movement'
              }
            ]
          }
        },
        {
          id: 'solid-backgrounds',
          title: 'Solid Color Backgrounds',
          order: 2,
          content: {
            overview: 'Simple, clean solid color backgrounds that provide consistent branding and maximum performance. Ideal for chroma keying.',
            steps: [
              {
                number: 1,
                title: 'Choose Background Color',
                description: 'Use the color picker to select your desired background color.',
                tip: 'Darker colors generally work better for reading text overlays.'
              },
              {
                number: 2,
                title: 'Consider Brand Colors',
                description: 'Use your brand colors to maintain consistency across your content.',
                tip: 'Green (#00ff00) is the default and works well for chroma keying with OBS.'
              }
            ],
            examples: [
              {
                title: 'Classic Dark Gray',
                description: 'Professional and easy on the eyes',
                result: 'Dark gray (#1a1a1a) background suitable for any content type'
              },
              {
                title: 'Brand Color Background',
                description: 'Using green for chroma key effects',
                result: 'Perfect for green screen removal in OBS when layering over other scenes'
              }
            ]
          }
        },
        {
          id: 'animated-backgrounds',
          title: 'Animated Backgrounds',
          order: 3,
          content: {
            overview: 'Dynamic animated backgrounds including waves and neural network effects that add visual interest to your streams.',
            steps: [
              {
                number: 1,
                title: 'Select Animation Type',
                description: 'Choose from waves or neural network animation types.',
                tip: 'Neural network effects work great for tech content, while waves suit creative or relaxing streams.'
              },
              {
                number: 2,
                title: 'Adjust Speed and Intensity',
                description: 'Control how fast and prominent the animation appears.',
                tip: 'Subtle animations are less distracting but still add visual appeal.'
              },
              {
                number: 3,
                title: 'Configure Colors',
                description: 'Set the color scheme for your animated elements.',
                tip: 'Match animation colors to your overall brand palette.'
              }
            ],
            examples: [
              {
                title: 'Tech Neural Network',
                description: 'Animated network nodes and connections with data packets',
                result: 'Futuristic tech aesthetic perfect for programming or tech talks'
              },
              {
                title: 'Flowing Waves',
                description: 'Geometric wave patterns with interference effects',
                result: 'Dynamic wave motion ideal for creative or gaming content'
              }
            ]
          }
        },
        {
          id: 'image-backgrounds',
          title: 'Image Backgrounds',
          order: 4,
          content: {
            overview: 'Upload and use custom images as backgrounds, with options for scaling, positioning, and overlay effects.',
            steps: [
              {
                number: 1,
                title: 'Upload Your Image',
                description: 'Click the upload button and select an image file (JPG, PNG, GIF supported).',
                tip: 'High-resolution images (1920x1080 or larger) work best for crisp display.'
              },
              {
                number: 2,
                title: 'Adjust Scaling',
                description: 'Choose how the image fills the background: cover, contain, or stretch.',
                tip: 'Cover mode ensures the entire background is filled, while contain shows the complete image.'
              },
              {
                number: 3,
                title: 'Set Position',
                description: 'Control where the image is positioned within the background area.',
                tip: 'Center positioning usually works best for most images.'
              },
              {
                number: 4,
                title: 'Add Overlay (Optional)',
                description: 'Apply a color overlay to adjust the image tone or reduce intensity.',
                tip: 'Dark overlays can help text overlays remain readable.'
              }
            ]
          }
        }
      ]
    },
    {
      id: 'graphics',
      title: 'Graphics & Overlays',
      description: 'Add professional graphics elements to enhance your content.',
      icon: '📺',
      order: 3,
      subsections: [
        {
          id: 'lower-thirds',
          title: 'Lower Thirds',
          order: 1,
          content: {
            overview: 'Professional lower third graphics for displaying names, titles, and information in the lower portion of your screen.',
            steps: [
              {
                number: 1,
                title: 'Enable Lower Third',
                description: 'Toggle the lower third visibility in the graphics section of the control panel.',
                tip: 'Use the "3" keyboard shortcut for quick toggling during live streams.'
              },
              {
                number: 2,
                title: 'Enter Text Content',
                description: 'Add the main text (name) and subtitle (title/description) in the text fields.',
                tip: 'Keep text concise - long text may be cut off or appear cramped.'
              },
              {
                number: 3,
                title: 'Customize Styling',
                description: 'Adjust font size, colors, background, and positioning to match your brand.',
                tip: 'High contrast between text and background ensures readability.'
              },
              {
                number: 4,
                title: 'Set Position',
                description: 'Move the lower third to your preferred location on screen.',
                tip: 'Traditional placement is in the lower third area, but you can position anywhere.'
              }
            ],
            examples: [
              {
                title: 'Standard Name Plate',
                description: 'Classic lower third for guest introductions',
                result: 'Clean, professional appearance with name and title clearly displayed'
              },
              {
                title: 'Branded Lower Third',
                description: 'Custom styled to match your brand colors',
                result: 'Consistent visual identity that reinforces your brand'
              }
            ]
          }
        },
        {
          id: 'ticker',
          title: 'Ticker Tape',
          order: 2,
          content: {
            overview: 'Scrolling text ticker for displaying news, announcements, social media handles, or any rolling information.',
            steps: [
              {
                number: 1,
                title: 'Enable Ticker',
                description: 'Turn on the ticker in the graphics controls.',
                tip: 'Use "4" keyboard shortcut for quick ticker control.'
              },
              {
                number: 2,
                title: 'Add Ticker Text',
                description: 'Enter the text you want to scroll across the screen.',
                tip: 'Separate multiple messages with " • " for clear divisions.'
              },
              {
                number: 3,
                title: 'Adjust Speed',
                description: 'Control how fast the text scrolls across the screen.',
                tip: 'Slower speeds are easier to read, but faster speeds show more content.'
              },
              {
                number: 4,
                title: 'Style the Ticker',
                description: 'Customize colors, size, and background to fit your design.',
                tip: 'Ensure sufficient contrast for readability against your background.'
              }
            ],
            examples: [
              {
                title: 'Social Media Ticker',
                description: 'Display your social handles',
                result: 'Follow @yourhandle • Subscribe for more content • Join our Discord'
              },
              {
                title: 'News Ticker',
                description: 'Breaking news or announcements',
                result: 'Live stream starting soon • New video every Tuesday • Special guest next week'
              }
            ]
          }
        },
        {
          id: 'clock-overlay',
          title: 'Clock & Time Display',
          order: 3,
          content: {
            overview: 'Real-time clock display with customizable format, timezone, and styling options.',
            steps: [
              {
                number: 1,
                title: 'Enable Clock',
                description: 'Turn on the clock display in the overlays section.',
                tip: 'Use "1" keyboard shortcut for quick clock toggle.'
              },
              {
                number: 2,
                title: 'Choose Time Format',
                description: 'Select 12-hour or 24-hour time format based on your preference.',
                tip: '24-hour format is more universal for international audiences.'
              },
              {
                number: 3,
                title: 'Set Timezone',
                description: 'Choose the timezone you want to display.',
                tip: 'Consider your primary audience\'s timezone for maximum relevance.'
              },
              {
                number: 4,
                title: 'Position and Style',
                description: 'Move the clock to your preferred corner and adjust its appearance.',
                tip: 'Top-right corner is traditional for clocks, but any corner works.'
              }
            ]
          }
        },
        {
          id: 'live-indicator',
          title: 'Live Indicator',
          order: 4,
          content: {
            overview: 'Animated "LIVE" indicator to clearly show when you\'re broadcasting live to your audience.',
            steps: [
              {
                number: 1,
                title: 'Enable Live Indicator',
                description: 'Turn on the live indicator in the overlays section.',
                tip: 'Use "2" keyboard shortcut for instant live indicator control.'
              },
              {
                number: 2,
                title: 'Choose Animation Style',
                description: 'Select static, blinking, or pulsing animation for the indicator.',
                tip: 'Blinking animations grab attention but can be distracting if overused.'
              },
              {
                number: 3,
                title: 'Customize Colors',
                description: 'Set the indicator color - red is traditional but any color works.',
                tip: 'Bright, high-contrast colors ensure the indicator is clearly visible.'
              },
              {
                number: 4,
                title: 'Position Placement',
                description: 'Place the live indicator where it\'s visible but not intrusive.',
                tip: 'Top corners are popular choices that don\'t interfere with main content.'
              }
            ]
          }
        },
        {
          id: 'logos-branding',
          title: 'Logos & Branding',
          order: 5,
          content: {
            overview: 'Upload and display your logos, watermarks, and branding elements with precise positioning control.',
            steps: [
              {
                number: 1,
                title: 'Upload Logo',
                description: 'Click the upload button in the branding section and select your logo file (PNG, JPG, or SVG under 5MB).',
                tip: 'PNG files with transparency work best for logos over backgrounds. SVG files maintain crisp quality at any size.'
              },
              {
                number: 2,
                title: 'Resize Logo',
                description: 'Adjust the size to fit your layout without overwhelming the content.',
                tip: 'Logos should be prominent enough to be recognizable but not dominate the screen.'
              },
              {
                number: 3,
                title: 'Position Logo',
                description: 'Drag or use controls to position your logo exactly where you want it.',
                tip: 'Bottom corners are traditional for watermarks, while top corners work for main logos.'
              },
              {
                number: 4,
                title: 'Set Opacity (Optional)',
                description: 'Adjust transparency if you want a subtle watermark effect.',
                tip: 'Watermarks typically use 20-50% opacity to be visible but not distracting.'
              }
            ]
          }
        }
      ]
    },
    {
      id: 'obs-integration',
      title: 'OBS Integration',
      description: 'Connect Virtual Studio with OBS for seamless streaming.',
      icon: '🎥',
      order: 4,
      subsections: [
        {
          id: 'setup',
          title: 'OBS Setup Guide',
          order: 1,
          content: {
            overview: 'Step-by-step instructions to integrate Virtual Studio with OBS Studio for professional live streaming.',
            steps: [
              {
                number: 1,
                title: 'Open OBS Studio',
                description: 'Launch OBS Studio and navigate to your scene where you want to add Virtual Studio.',
                tip: 'Create a dedicated scene for Virtual Studio if you plan to use it regularly.'
              },
              {
                number: 2,
                title: 'Add Browser Source',
                description: 'Click the "+" in Sources panel and select "Browser Source".',
                tip: 'Give it a descriptive name like "Virtual Studio Background" for easy identification.'
              },
              {
                number: 3,
                title: 'Configure Browser Source',
                description: 'Set URL to your Virtual Studio address (typically http://localhost:3000/app for development), Width: 1920, Height: 1080.',
                tip: 'Ensure the URL ends with /app to load the studio interface directly.'
              },
              {
                number: 4,
                title: 'Position and Scale',
                description: 'Resize and position the browser source to fit your scene layout.',
                tip: 'Right-click the source for transform options like "Fit to Screen" or "Stretch to Screen".'
              },
              {
                number: 5,
                title: 'Test the Integration',
                description: 'Make changes in Virtual Studio and verify they appear in OBS.',
                tip: 'Use Virtual Studio\'s keyboard shortcuts to test live switching capabilities.'
              }
            ],
            relatedLinks: [
              {
                title: 'Troubleshooting OBS Issues',
                sectionId: 'troubleshooting',
                subsectionId: 'obs-problems',
                description: 'Common OBS integration problems and solutions'
              }
            ]
          }
        },
        {
          id: 'recommended-settings',
          title: 'Recommended OBS Settings',
          order: 2,
          content: {
            overview: 'Optimal OBS configuration settings for the best Virtual Studio performance and quality.',
            steps: [
              {
                number: 1,
                title: 'Browser Source Settings',
                description: 'Width: 1920, Height: 1080, FPS: 60, CSS: (leave blank), Shutdown source when not visible: checked.',
                tip: 'Higher FPS provides smoother animations but uses more system resources.'
              },
              {
                number: 2,
                title: 'Scene Configuration',
                description: 'Place Virtual Studio browser source at the bottom of your source list for proper layering.',
                tip: 'Sources higher in the list appear on top, so Virtual Studio should be your background layer.'
              },
              {
                number: 3,
                title: 'Performance Settings',
                description: 'In OBS Settings > Video, match your Canvas Resolution to 1920x1080 for best quality.',
                tip: 'Lower resolutions will work but may reduce visual quality of Virtual Studio graphics.'
              }
            ]
          }
        },
        {
          id: 'advanced-techniques',
          title: 'Advanced Integration Techniques',
          order: 3,
          content: {
            overview: 'Professional techniques for getting the most out of Virtual Studio in your OBS setup.',
            steps: [
              {
                number: 1,
                title: 'Multiple Virtual Studio Instances',
                description: 'Run multiple browser sources with different Virtual Studio configurations for quick scene switching.',
                tip: 'Each browser tab maintains its own Virtual Studio state independently.'
              },
              {
                number: 2,
                title: 'Chroma Key Integration',
                description: 'Use solid color backgrounds in Virtual Studio with OBS chroma key for advanced compositing.',
                tip: 'Bright green (#00FF00) or blue (#0000FF) work best for chroma keying.'
              },
              {
                number: 3,
                title: 'Layer Ordering',
                description: 'Ensure Virtual Studio browser source is positioned correctly in your source list for proper layering.',
                tip: 'Virtual Studio should typically be your background layer (bottom of source list).'
              }
            ]
          }
        }
      ]
    },
    {
      id: 'keyboard-shortcuts',
      title: 'Keyboard Shortcuts',
      description: 'Quick reference for all Virtual Studio keyboard controls.',
      icon: '⌨️',
      order: 5,
      subsections: [
        {
          id: 'all-shortcuts',
          title: 'Complete Shortcuts List',
          order: 1,
          content: {
            overview: 'Master Virtual Studio with these keyboard shortcuts for lightning-fast control during live streams and recordings.',
            steps: [
              {
                number: 1,
                title: 'Learn the Basics',
                description: 'Start with the most essential shortcuts: Tab (toggle control panel), 0 (toggle background), 3 (lower third).',
                tip: 'Practice these shortcuts before going live to build muscle memory.'
              },
              {
                number: 2,
                title: 'Background Controls',
                description: 'Number keys 1-4 toggle different graphics elements: 1 (clock), 2 (live indicator), 3 (lower third), 4 (ticker).',
                tip: 'These shortcuts allow quick control of overlay elements during live streaming.'
              },
              {
                number: 3,
                title: 'Graphics Management',
                description: 'Number keys 1-4 control various overlay elements for quick show control.',
                tip: 'Combine with background visibility toggle (0) for dramatic scene transitions.'
              }
            ],
            examples: [
              {
                title: 'Live Stream Workflow',
                description: 'Common keyboard shortcuts during streaming',
                result: 'Tab to hide controls, 3 to show guest names, 0 to hide background for intermission'
              },
              {
                title: 'Recording Session',
                description: 'Pre-recording setup shortcuts',
                result: 'P for preview mode, adjust elements with number keys, then go live'
              }
            ]
          }
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      description: 'Solutions for common issues and problems.',
      icon: '🔧',
      order: 6,
      subsections: [
        {
          id: 'common-issues',
          title: 'Common Issues',
          order: 1,
          content: {
            overview: 'Quick solutions for the most frequently encountered Virtual Studio problems.',
            steps: [
              {
                number: 1,
                title: 'Check Browser Compatibility',
                description: 'Ensure you\'re using a modern browser (Chrome, Firefox, Edge) with JavaScript enabled.',
                tip: 'Chrome typically provides the best performance and compatibility.'
              },
              {
                number: 2,
                title: 'Clear Browser Cache',
                description: 'If experiencing strange behavior, try clearing your browser cache and refreshing.',
                tip: 'Use Ctrl+F5 for a hard refresh that bypasses cache.'
              },
              {
                number: 3,
                title: 'Check System Resources',
                description: 'Monitor CPU and GPU usage - close unnecessary applications if performance is poor.',
                tip: 'Virtual Studio performs best with at least 4GB available RAM.'
              }
            ]
          }
        },
        {
          id: 'obs-problems',
          title: 'OBS Integration Problems',
          order: 2,
          content: {
            overview: 'Specific solutions for OBS integration issues and browser source problems.',
            steps: [
              {
                number: 1,
                title: 'Black Screen in OBS',
                description: 'Verify the browser source URL is correct and Virtual Studio is actually running.',
                tip: 'Test the URL in a regular browser tab first to confirm it loads properly.'
              },
              {
                number: 2,
                title: 'Performance Issues',
                description: 'Reduce animation complexity, lower browser source FPS, or enable hardware acceleration.',
                tip: 'Try switching to CSS rendering mode in Virtual Studio for better performance.'
              },
              {
                number: 3,
                title: 'Interaction Issues',
                description: 'If controls are not responding, click on the Virtual Studio window to ensure it has focus.',
                tip: 'Virtual Studio needs focus to receive keyboard shortcuts and interact with controls.'
              }
            ]
          }
        }
      ]
    }
  ],
  lastUpdated: new Date().toISOString(),
  version: '1.0.0'
};