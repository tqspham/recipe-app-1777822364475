// Modern Design System Tokens

export const colors = {
  // Primary
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },
  // Secondary (Slate)
  secondary: {
    400: '#94a3b8',
    600: '#64748b',
    700: '#475569',
  },
  // Semantic Colors
  success: '#059669',
  error: '#e11d48',
  warning: '#d97706',
  // Neutral Grays
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    600: '#64748b',
    700: '#475569',
    900: '#0f172a',
  },
  // Special
  white: '#ffffff',
  red: {
    400: '#f87171',
    500: '#ef4444',
  },
  yellow: {
    400: '#facc15',
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    700: '#15803d',
  },
};

export const typography = {
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
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
    lineHeight: '1.5rem',
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
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
};

export const transitions = {
  default: 'all 0.2s ease',
};
