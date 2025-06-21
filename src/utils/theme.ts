export const initializeTheme = () => {
  const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
  const defaultTheme: 'light' | 'dark' | 'system' = storedTheme || 'system';
  
  applyTheme(defaultTheme);
  
  return defaultTheme;
};

export const applyTheme = (theme: 'light' | 'dark' | 'system') => {
  const root = window.document.documentElement;
  
  if (theme === 'system') {
    const systemPreferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', systemPreferDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
  
  localStorage.setItem('theme', theme);
};

export const getSystemTheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};