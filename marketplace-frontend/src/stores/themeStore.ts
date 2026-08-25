import { create } from 'zustand';
import { createTheme } from '@mui/material/styles';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  getMuiTheme: () => ReturnType<typeof createTheme>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return { theme: newTheme };
    });
  },

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },

  getMuiTheme: () => {
    const { theme } = get();
    return createTheme({
      palette: {
        mode: theme,
        primary: {
          main: '#4F46E5',
        },
      },
    });
  },
}));
