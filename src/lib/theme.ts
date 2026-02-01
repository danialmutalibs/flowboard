export type Theme = 'light' | 'dark';

const KEY = 'flowboard-theme';

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem(KEY) as Theme) ?? 'light';
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  localStorage.setItem(KEY, theme);
}
