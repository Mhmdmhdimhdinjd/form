// src/context/themecontext.js
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // لود تم از localStorage موقع بارگذاری
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      if (savedTheme === 'dark') {
        document.body.style.backgroundColor = "#222"; // رنگ تیره برای دارک
      } else {
        document.body.style.backgroundColor = "#add8e6"; // آبی روشن برای لایت
      }
    }
  }, []);


  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      if (newTheme) {
        document.body.style.backgroundColor = "#222"; // رنگ تیره برای دارک
      } else {
        document.body.style.backgroundColor = "#add8e6"; // آبی روشن برای لایت
      }
      return newTheme;
    });
  };

  const toggleOffcanvas = () => setIsOpen(!isOpen);


  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme,toggleOffcanvas , isOpen }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);