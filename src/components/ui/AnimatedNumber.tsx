import { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  /** ms */
  duration?: number;
  format?: (n: number) => string;
  /** Tetikleyici değiştiğinde animasyon yeniden başlar (varsayılan: value) */
  trigger?: unknown;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Sayıyı 0'dan (veya önceki değerden) hedef değere kadar yumuşak animasyonla artırır.
 * KPI kartları için sunum hissi oluşturur.
 */
export function AnimatedNumber({
  value,
  duration = 1100,
  format = (n) => n.toLocaleString('tr-TR'),
  trigger,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = null;
    let raf = 0;

    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      const next = fromRef.current + (value - fromRef.current) * eased;
      setDisplay(next);
      if (t < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, trigger]);

  return <span className="tabular-nums">{format(display)}</span>;
}
