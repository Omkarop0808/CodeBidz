/**
 * Design Tokens Configuration
 * Centralized design values for the modern SaaS UI redesign
 * 
 * This file provides a single source of truth for all design values
 * used throughout the application, ensuring consistency and maintainability.
 */

export const designTokens = {
  // Color Palette
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8', // Main sky blue
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    surface: {
      white: '#ffffff',
      offWhite: '#fafafa',
      light: '#f5f5f5',
      gray: '#e5e5e5',
    },
    text: {
      primary: '#1f2937',   // gray-800
      secondary: '#6b7280', // gray-500
      tertiary: '#9ca3af',  // gray-400
      inverse: '#ffffff',
    },
  },

  // Typography
  typography: {
    fontFamilies: {
      heading: '"Poppins", sans-serif',
      body: '"Inter", sans-serif',
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.6,
      relaxed: 1.75,
    },
  },

  // Spacing Scale (8px grid)
  spacing: {
    0: '0',
    1: '0.5rem',   // 8px
    2: '1rem',     // 16px
    3: '1.5rem',   // 24px
    4: '2rem',     // 32px
    5: '2.5rem',   // 40px
    6: '3rem',     // 48px
    8: '4rem',     // 64px
    10: '5rem',    // 80px
    12: '6rem',    // 96px
    16: '8rem',    // 128px
    20: '10rem',   // 160px
    24: '12rem',   // 192px
  },

  // Shadow Utilities
  shadows: {
    soft: '0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.10)',
    large: '0 8px 24px rgba(0, 0, 0, 0.12), 0 16px 48px rgba(0, 0, 0, 0.14)',
    sky: '0 4px 16px rgba(56, 189, 248, 0.15), 0 8px 32px rgba(56, 189, 248, 0.10)',
  },

  // Animation Timing and Easing
  animations: {
    timing: {
      instant: '100ms',
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
      verySlow: '1000ms',
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // Responsive Breakpoints
  breakpoints: {
    mobile: '375px',
    tablet: '768px',
    desktop: '1280px',
    wide: '1536px',
  },
};

export default designTokens;
