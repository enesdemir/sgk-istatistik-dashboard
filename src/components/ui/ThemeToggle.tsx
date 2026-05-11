import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

/**
 * Header'da kullanılan tema değiştirme düğmesi.
 * Tek tıkla light ↔ dark; ikon yumuşak crossfade ile değişir.
 */
export function ThemeToggle() {
  const [theme, , toggle] = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      title={theme === 'dark' ? 'Aydınlık tema' : 'Karanlık tema'}
      aria-label="Tema değiştir"
      className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-border-strong bg-bg-surface/80 text-ink-muted transition-colors hover:bg-bg-elevated hover:text-ink"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.span
            key="moon"
            initial={{ y: -16, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 16, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon size={15} strokeWidth={2} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ y: -16, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 16, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun size={15} strokeWidth={2} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
