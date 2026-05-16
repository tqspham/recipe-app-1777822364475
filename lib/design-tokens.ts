// Rustic Farmhouse Design System Tokens

export const colors = {
  // Primary - Warm Terracotta
  primary: {
    50: '#F5EBE7',
    100: '#E8DDD2',
    200: '#D9CCC0',
    500: '#A0634A',
    600: '#8B5A3F',
    700: '#7A5037',
    900: '#4A3428',
  },
  // Secondary - Burnt Orange
  secondary: {
    400: '#D4845C',
    600: '#C1754F',
    700: '#A85C3B',
  },
  // Accent - Warm Brown
  accent: {
    400: '#8B6F47',
    600: '#7A5D3E',
    700: '#6A4D31',
  },
  // Sage Green - Success
  success: '#7A9B6E',
  // Warm Amber - Warning
  warning: '#C48D4F',
  // Warm Rust - Danger
  danger: '#B85C54',
  // Backgrounds
  background: '#F5F1ED',
  surface: '#FEFCF9',
  // Text
  text: '#3D2E28',
  mutedText: '#8B7D73',
  // Borders
  border: '#D9CCC0',
  // Special
  white: '#FFFFFF',
};

export const typography = {
  fontFamily: 'Georgia, "Garamond", serif',
  fontStack: '"Georgia", "Garamond", serif',
  heading: {
    h1: {
      size: '2rem',
      lineHeight: '2.5rem',
      weight: 700,
    },
    h2: {
      size: '1.5rem',
      lineHeight: '2rem',
      weight: 600,
    },
    h3: {
      size: '1.25rem',
      lineHeight: '1.75rem',
      weight: 600,
    },
  },
  body: {
    size: '1rem',
    lineHeight: '1.7',
    weight: 400,
  },
  label: {
    size: '0.875rem',
    lineHeight: '1.25rem',
    weight: 500,
  },
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  base: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '2.5rem',
  '3xl': '3rem',
};

export const borderRadius = {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  organic: '12px',
  round: '16px',
};

export const shadows = {
  sm: '0 1px 2px rgba(160, 99, 74, 0.05)',
  md: '0 4px 6px rgba(160, 99, 74, 0.07), 0 2px 4px rgba(160, 99, 74, 0.05)',
  lg: '0 10px 15px rgba(160, 99, 74, 0.1), 0 4px 6px rgba(160, 99, 74, 0.05)',
  warm: '0 4px 12px rgba(160, 99, 74, 0.15)',
};

export const transitions = {
  default: 'all 0.2s ease-out',
  smooth: 'all 0.3s ease-out',
};
