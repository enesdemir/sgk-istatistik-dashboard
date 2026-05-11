import { useEffect, useState } from 'react';
import { ilHarita } from '@/data/mockData';

/** Türkiye haritası üzerinde belirli bir ilde 1.5 sn süreli radar pulse'u */
export interface Pulse {
  id: string;
  il: string; // il adı (Türkçe karakterli) — TurkeyHeatmap centroid lookup için
  startedAt: number;
  level: 'info' | 'ok' | 'warn' | 'bad';
}

/** Anlık işlem akışı satırı (provizyon/prim/tahsilat vs.) */
export interface Transaction {
  id: string;
  il: string;
  tip: 'Provizyon' | 'Prim' | 'Tahsilat' | 'Yapılandırma' | 'Denetim';
  tutar: number; // ₺
  time: Date;
  level: 'info' | 'ok' | 'warn' | 'bad';
}

export interface LiveActivity {
  pulses: Pulse[];
  transactions: Transaction[];
  /** Anlık işlem/saniye */
  tps: number;
  /** Bugün toplam işlem sayacı (sürekli artar) */
  totalToday: number;
}

const FAST_TICK_MS = 380;
const PULSE_LIFE_MS = 1600;
const FEED_MAX = 14;

/** İşlem tipleri — ağırlıklı seçim için weight + renk */
const TX_TYPES: Array<{
  tip: Transaction['tip'];
  min: number;
  max: number;
  weight: number;
  level: Pulse['level'];
}> = [
  { tip: 'Provizyon', min: 150, max: 1800, weight: 7, level: 'info' },
  { tip: 'Prim', min: 1500, max: 9500, weight: 5, level: 'ok' },
  { tip: 'Tahsilat', min: 800, max: 32_000, weight: 3, level: 'ok' },
  { tip: 'Yapılandırma', min: 300, max: 4500, weight: 2, level: 'warn' },
  { tip: 'Denetim', min: 0, max: 0, weight: 1, level: 'bad' },
];

const TX_TYPE_TOTAL_WEIGHT = TX_TYPES.reduce((s, t) => s + t.weight, 0);

/** İl seçim havuzu — yoğunluk ağırlıklı (İstanbul/Ankara/İzmir daha sık görünür) */
const IL_POOL = ilHarita
  .map((il) => ({ il: il.il, weight: il.yogunluk }))
  .sort((a, b) => b.weight - a.weight);
const IL_TOTAL_WEIGHT = IL_POOL.reduce((s, x) => s + x.weight, 0);

function jitter(amount: number): number {
  return (Math.random() - 0.5) * 2 * amount;
}

function pickWeighted<T extends { weight: number }>(pool: T[], total: number): T {
  let r = Math.random() * total;
  for (const item of pool) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return pool[0];
}

function rid(): string {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Hızlı tick'le çalışan canlılık üreteci.
 *
 * - Her FAST_TICK_MS periyodunda 1-2 yeni pulse ve 2-4 yeni işlem üretir
 * - Pulse'lar PULSE_LIFE_MS sonra otomatik düşer
 * - İşlem feed'i son FEED_MAX kayıtla sınırlı (en yenisi başta)
 * - TPS sürekli salınımla (sinüsoid + jitter) güncellenir
 */
export function useLiveActivity(): LiveActivity {
  const [state, setState] = useState<LiveActivity>(() => ({
    pulses: [],
    transactions: [],
    tps: 1247,
    totalToday: 2_847_300,
  }));

  useEffect(() => {
    let tickCount = 0;
    const id = setInterval(() => {
      const now = Date.now();
      tickCount += 1;

      // 1-2 yeni pulse
      const newPulses: Pulse[] = Array.from({ length: 1 + Math.floor(Math.random() * 2) }, () => {
        const ilEntry = pickWeighted(IL_POOL, IL_TOTAL_WEIGHT);
        const tx = pickWeighted(TX_TYPES, TX_TYPE_TOTAL_WEIGHT);
        return {
          id: `p-${now}-${rid()}`,
          il: ilEntry.il,
          startedAt: now,
          level: tx.level,
        };
      });

      // 2-4 yeni transaction (feed hızlı akar)
      const newTxs: Transaction[] = Array.from({ length: 2 + Math.floor(Math.random() * 3) }, () => {
        const ilEntry = pickWeighted(IL_POOL, IL_TOTAL_WEIGHT);
        const tx = pickWeighted(TX_TYPES, TX_TYPE_TOTAL_WEIGHT);
        const tutar =
          tx.tip === 'Denetim' ? 0 : tx.min + Math.random() * (tx.max - tx.min);
        return {
          id: `t-${now}-${rid()}`,
          il: ilEntry.il,
          tip: tx.tip,
          tutar,
          time: new Date(now),
          level: tx.level,
        };
      });

      setState((prev) => ({
        pulses: [...prev.pulses, ...newPulses].filter(
          (p) => now - p.startedAt < PULSE_LIFE_MS,
        ),
        transactions: [...newTxs, ...prev.transactions].slice(0, FEED_MAX),
        tps: Math.max(
          800,
          1247 + Math.round(jitter(160) + Math.sin(tickCount / 12) * 90),
        ),
        totalToday: prev.totalToday + 3 + Math.floor(Math.random() * 6),
      }));
    }, FAST_TICK_MS);

    return () => clearInterval(id);
  }, []);

  return state;
}
