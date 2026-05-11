import { useEffect, useRef, useState } from 'react';

/** Sliding seri için tek nokta */
export interface StreamPoint {
  t: number;
  gelir: number;
  gider: number;
  net: number;
}

export interface ScadaState {
  time: Date;
  /** Anlık prim akışı (mlr ₺/ay denkleminde) */
  gelirRate: number;
  giderRate: number;
  aktuaryalDenge: number; // mlr ₺ (kümülatif)
  aktifPasif: number;
  tahsilatPct: number;
  provizyonAnlik: number;
  provizyonBugun: number; // gün boyunca biriken sayaç
  denetimTasarrufAnlik: number; // mn ₺ (bu dakika)
  series: StreamPoint[];
  alarms: AlarmEvent[];
}

export interface AlarmEvent {
  id: string;
  time: Date;
  level: 'info' | 'ok' | 'warn' | 'bad';
  source: string;
  message: string;
}

const TICK_MS = 800;
const SERIES_SIZE = 60;
const ALARM_BUFFER = 40;

function jitter(amount: number): number {
  return (Math.random() - 0.5) * 2 * amount;
}

/** Periyodik üretilen sentetik log mesajları havuzu */
const LOG_POOL: Omit<AlarmEvent, 'id' | 'time'>[] = [
  { level: 'info', source: 'SYS', message: 'Tahsilat senkronizasyonu tamamlandı' },
  { level: 'ok', source: 'PRIM', message: 'Aylık prim akışı normal seviyede' },
  { level: 'info', source: 'PROV', message: 'Provizyon servisi yanıt süresi 84 ms' },
  { level: 'warn', source: 'EMK', message: 'İstanbul dosya bağlama 42 gün (hedef 30)' },
  { level: 'warn', source: 'SGL', message: 'Onkoloji harcama YoY +%8.3' },
  { level: 'warn', source: 'ECZ', message: 'Reçete başı maliyet 624.80 ₺' },
  { level: 'bad', source: 'DNT', message: 'Şanlıurfa kayıt dışı %33.4 — saha denetimi tetiklendi' },
  { level: 'ok', source: 'YAP', message: 'Yapılandırma tahsilatı +14.9 mlr ₺' },
  { level: 'info', source: 'KPS', message: 'KPS sorgulama: 12,438 başarılı / 0 hata' },
  { level: 'ok', source: 'MEYES', message: 'Senkronizasyon: 1.2M sigortalı kaydı eşlendi' },
  { level: 'info', source: 'AKT', message: 'Aktüeryal model güncellendi (15:03 UTC)' },
  { level: 'ok', source: 'OBT', message: 'Oto-bordro tahsilat doğruluğu %99.7' },
  { level: 'warn', source: 'SAĞ', message: 'GSS 60/c-1 kapsamı YoY -%4.4' },
  { level: 'info', source: 'NET', message: 'API gateway 2,148 req/s — sağlıklı' },
];

function initialSeries(): StreamPoint[] {
  const now = Date.now();
  return Array.from({ length: SERIES_SIZE }, (_, i) => {
    const t = now - (SERIES_SIZE - i) * TICK_MS;
    const gelir = 260 + jitter(8);
    const gider = 240 + jitter(6);
    return { t, gelir, gider, net: gelir - gider };
  });
}

function initialAlarms(): AlarmEvent[] {
  const now = Date.now();
  return Array.from({ length: 6 }, (_, i) => {
    const tpl = LOG_POOL[(LOG_POOL.length - 6 + i + LOG_POOL.length) % LOG_POOL.length];
    return {
      id: `init-${i}`,
      time: new Date(now - (6 - i) * 4000),
      level: tpl.level,
      source: tpl.source,
      message: tpl.message,
    };
  });
}

/**
 * SCADA canlı veri kaynağı — TICK_MS periyodu ile tüm metrikleri günceller,
 * sliding seriyi besler, periyodik olarak alarm log'una yeni kayıt ekler.
 */
export function useScadaData(): ScadaState {
  const [state, setState] = useState<ScadaState>(() => ({
    time: new Date(),
    gelirRate: 260,
    giderRate: 240,
    aktuaryalDenge: 232.1,
    aktifPasif: 2.18,
    tahsilatPct: 92.6,
    provizyonAnlik: 1842,
    provizyonBugun: 1_184_300,
    denetimTasarrufAnlik: 28.4,
    series: initialSeries(),
    alarms: initialAlarms(),
  }));

  const tickCount = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      const gelir = 260 + jitter(10) + Math.sin(tickCount.current / 8) * 4;
      const gider = 240 + jitter(7) + Math.sin(tickCount.current / 11) * 2;
      const point: StreamPoint = { t: now.getTime(), gelir, gider, net: gelir - gider };

      tickCount.current += 1;

      setState((prev) => {
        const series = [...prev.series, point].slice(-SERIES_SIZE);

        // Her ~5 tick'te bir yeni log satırı (4 sn ortalama)
        let alarms = prev.alarms;
        if (tickCount.current % 5 === 0) {
          const tpl = LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)];
          const yeni: AlarmEvent = {
            id: `${now.getTime()}-${Math.random().toString(36).slice(2, 6)}`,
            time: now,
            level: tpl.level,
            source: tpl.source,
            message: tpl.message,
          };
          alarms = [yeni, ...prev.alarms].slice(0, ALARM_BUFFER);
        }

        return {
          time: now,
          gelirRate: gelir,
          giderRate: gider,
          aktuaryalDenge: 232.1 + jitter(2.6),
          aktifPasif: 2.18 + jitter(0.025),
          tahsilatPct: 92.6 + jitter(0.5),
          provizyonAnlik: Math.round(1842 + jitter(220)),
          provizyonBugun: prev.provizyonBugun + Math.round(40 + Math.random() * 180),
          denetimTasarrufAnlik: 28.4 + jitter(3.2),
          series,
          alarms,
        };
      });
    }, TICK_MS);

    return () => clearInterval(id);
  }, []);

  return state;
}
