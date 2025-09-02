import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setSystemPreference } from '../../store/slices/themeSlice';

export default function ThemeProvider({ children }) {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.theme.currentTheme);

  useEffect(() => {
    // Apply initial theme
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      dispatch(setSystemPreference(e.matches ? 'dark' : 'light'));
    };

    mediaQuery.addEventListener('change', handleChange);
    dispatch(setSystemPreference(mediaQuery.matches ? 'dark' : 'light'));

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [dispatch]);

  useEffect(() => {
    // Apply theme changes
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  return <>{children}</>;
}
