import { createSlice } from '@reduxjs/toolkit';

// Load theme state from localStorage
const loadThemeState = () => {
  if (typeof window !== 'undefined') {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (err) {
      return 'light';
    }
  }
  return 'light';
};

// Save theme state to localStorage
const saveThemeState = (theme) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('theme', theme);
      // Apply theme to document
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (err) {
      // Ignore write errors
    }
  }
};

const initialState = {
  currentTheme: loadThemeState(),
  systemPreference: typeof window !== 'undefined' ? 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
      saveThemeState(action.payload);
    },
    toggleTheme: (state) => {
      const newTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
      state.currentTheme = newTheme;
      saveThemeState(newTheme);
    },
    setSystemPreference: (state, action) => {
      state.systemPreference = action.payload;
    },
  },
});

export const { setTheme, toggleTheme, setSystemPreference } = themeSlice.actions;

export default themeSlice.reducer;
