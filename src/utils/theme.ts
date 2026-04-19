
import React from 'react';

export interface BrandingPalette {
  name?: string;
  primary: string;
  secondary: string;
  surface: string;
  text: string;
}

export const getThemeVariables = (palette: BrandingPalette): React.CSSProperties => {
  return {
    '--primary-color': palette.primary,
    '--secondary-color': palette.secondary,
    '--bg-color': palette.surface,
    '--text-color': palette.text,
    // Add legacy support during transition
    '--primary': palette.primary,
    '--secondary': palette.secondary,
    '--text-main': palette.text,
  } as React.CSSProperties;
};

export const injectGlobalTheme = (palette: BrandingPalette) => {
  const root = document.documentElement;
  root.style.setProperty('--primary-color', palette.primary);
  root.style.setProperty('--secondary-color', palette.secondary);
  root.style.setProperty('--bg-color', palette.surface);
  root.style.setProperty('--text-color', palette.text);
  
  // Legacy
  root.style.setProperty('--primary', palette.primary);
  root.style.setProperty('--secondary', palette.secondary);
  root.style.setProperty('--text-main', palette.text);
};
