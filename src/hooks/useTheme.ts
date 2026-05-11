import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'sgk-theme';

function getInitial(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved === 'light' || saved === 'dark') return saved;
  // Sistem tercihini takip et — varsayılan dark
  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;
  return prefersLight ? 'light' : 'dark';
}

/**
 * Tema yönetimi: `dark` sınıfı `<html>` üzerinde, tercih localStorage'da saklanır.
 * Sistem teması değişirse, kullanıcı manuel seçim yapmamışsa otomatik takip eder.
 */
export function useTheme(): [Theme, (t: Theme) => void, () => void] {
  const [theme, setThemeState] = useState<Theme>(() => getInitial());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = (t: Theme) => {
    window.localStorage.setItem(STORAGE_KEY, t);
    setThemeState(t);
  };

  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return [theme, setTheme, toggle];
}
