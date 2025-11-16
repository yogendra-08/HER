/**
 * Premium Luxury Indian Fashion Theme Configuration
 * Inspired by Sabyasachi, Manish Malhotra, Manyavar, FabIndia
 */

// Common colors
const colors = {
  // Primary colors
  royalBrown: '#2C1810',
  chocolate: '#4A2E29',
  maroon: '#8B3A3A',
  gold: '#C49E54',
  sandBeige: '#E9E4D4',
  white: '#FFFFFF',
  cream: '#F7F4EF',
  black: '#000000',
  darkGray: '#333333',
  lightGray: '#f5f5f5',
};

// Light theme
export const lightTheme = {
  ...colors,
  background: colors.cream,
  text: colors.royalBrown,
  textSecondary: colors.chocolate,
  primary: colors.royalBrown,
  secondary: colors.maroon,
  accent: colors.gold,
  cardBg: colors.white,
  border: colors.sandBeige,
  hoverBg: 'rgba(0, 0, 0, 0.05)',
  shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

// Dark theme
export const darkTheme = {
  ...colors,
  background: '#1a1a1a',
  text: '#f5f5f5',
  textSecondary: '#d1d5db',
  primary: colors.gold,
  secondary: '#d1a054',
  accent: colors.maroon,
  cardBg: '#2d2d2d',
  border: '#3d3d3d',
  hoverBg: 'rgba(255, 255, 255, 0.1)',
  shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
};

export type ThemeType = typeof lightTheme;

// Default export for backward compatibility
export const theme = lightTheme;

// Typography
export const typography = {
  heading: "'Playfair Display', 'Cormorant Garamond', serif",
  body: "'Inter', 'Lato', sans-serif",
};
