import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import colorPalette from './Colors';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const deviceScheme = useColorScheme();
  const [theme, setTheme] = useState(deviceScheme || 'light');

  useEffect(() => {
    setTheme(deviceScheme || 'light');
  }, [deviceScheme]);

  const colors = colorPalette[theme] || colorPalette.light;

  return (
    <ThemeContext.Provider value={{ theme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);