import { useEffect } from 'react';

export type Theme = 'light';

/**
 * Tema sistemi light moda kilitli — SGK kurumsal mavi-beyaz tek tema.
 * Eski dark tercih localStorage'da varsa temizler, html'den `dark` class'ını siler.
 */
export function useTheme(): [Theme, (t: Theme) => void, () => void] {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    try {
      window.localStorage.removeItem('sgk-theme');
    } catch {
      // localStorage kapalı olabilir, sessizce geç
    }
  }, []);

  return ['light', () => {}, () => {}];
}
