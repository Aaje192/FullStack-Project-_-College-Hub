import React, { createContext, useContext, useMemo, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  // CSS variables for both themes
  const themeVars = useMemo(() => ({
    '--bg-main': mode === 'light' ? '#f5f7fa' : '#181a1b',
    '--bg-card': mode === 'light' ? '#fff' : '#23272f',
    '--text-main': mode === 'light' ? '#222' : '#f5f7fa',
    '--card-shadow': mode === 'light'
      ? '0 4px 24px rgba(0,0,0,0.07)'
      : '0 4px 24px rgba(0,0,0,0.45)',
    '--sidebar-bg': mode === 'light' ? '#e3eafc' : '#23272f',
    '--navbar-bg': mode === 'light' ? '#fff' : '#23272f',
    '--sidebar-text': mode === 'light' ? '#222' : '#f5f7fa',
    '--navbar-text': mode === 'light' ? '#222' : '#f5f7fa',
    '--sidebar-active': mode === 'light' ? '#1976d2' : '#90caf9',
  }), [mode]);

  React.useEffect(() => {
    for (const key in themeVars) {
      document.body.style.setProperty(key, themeVars[key]);
    }
  }, [themeVars]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);