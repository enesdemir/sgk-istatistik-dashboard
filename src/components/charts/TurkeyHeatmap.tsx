import { geoMercator, geoPath } from 'd3-geo';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { fmtCompact, fmtPct } from '@/lib/format';
import type { IlIsiHaritasi } from '@/types';

interface PulseInput {
  id: string;
  il: string;
  level?: 'info' | 'ok' | 'warn' | 'bad';
}

interface TurkeyHeatmapProps {
  veri: IlIsiHaritasi[];
  /** Hangi metrik üzerinden ısı (yogunluk / kayitDisi / toplamHarcama) */
  metric?: 'yogunluk' | 'kayitDisi' | 'toplamHarcama';
  /** İl merkezlerinde radar pulse'ları — anlık işlem hissi için */
  pulses?: PulseInput[];
}

const PULSE_COLOR: Record<NonNullable<PulseInput['level']>, string> = {
  info: '#67e8f9',
  ok: '#34d399',
  warn: '#fbbf24',
  bad: '#fb7185',
};

interface GeoJsonFeature {
  type: 'Feature';
  properties: { name: string; number: number };
  geometry: { type: string; coordinates: unknown };
}
interface GeoJson {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}

/** Adana → Adana eşleşmesi için Türkçe karakter normalize edici */
function norm(s: string): string {
  return s
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();
}

/** Yoğunluk skoruna göre HSL rengi (0..100). Düşük → derin lacivert, yüksek → kırmızı/turuncu. */
function colorFor(value: number, max: number): string {
  if (max <= 0) return 'rgba(30, 41, 80, 0.7)';
  const t = Math.min(1, Math.max(0, value / max));
  // Multi-stop: koyu lacivert → mavi → mor → kırmızı → turuncu
  const stops = [
    { p: 0, c: [22, 31, 64] },
    { p: 0.2, c: [37, 61, 144] },
    { p: 0.4, c: [80, 70, 180] },
    { p: 0.6, c: [165, 60, 160] },
    { p: 0.8, c: [230, 70, 95] },
    { p: 1, c: [251, 146, 60] },
  ];
  let i = 0;
  while (i < stops.length - 1 && t > stops[i + 1].p) i++;
  const a = stops[i];
  const b = stops[i + 1] ?? a;
  const lt = (t - a.p) / ((b.p - a.p) || 1);
  const r = Math.round(a.c[0] + (b.c[0] - a.c[0]) * lt);
  const g = Math.round(a.c[1] + (b.c[1] - a.c[1]) * lt);
  const bl = Math.round(a.c[2] + (b.c[2] - a.c[2]) * lt);
  return `rgb(${r}, ${g}, ${bl})`;
}

const WIDTH = 720;
const HEIGHT = 320;

export function TurkeyHeatmap({ veri, metric = 'yogunluk', pulses }: TurkeyHeatmapProps) {
  const [geo, setGeo] = useState<GeoJson | null>(null);
  const [hover, setHover] = useState<{ il: string; x: number; y: number } | null>(null);

  useEffect(() => {
    let alive = true;
    // Vite base path destekli: dev'de "/" , prod'da "/sgk-istatistik-dashboard/" prefix'i alır
    fetch(`${import.meta.env.BASE_URL}geo/tr-cities.json`)
      .then((r) => r.json())
      .then((d: GeoJson) => {
        if (alive) setGeo(d);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const byName = useMemo(() => {
    const m = new Map<string, IlIsiHaritasi>();
    veri.forEach((v) => m.set(norm(v.il), v));
    return m;
  }, [veri]);

  const max = useMemo(() => {
    const vals = veri.map((v) => v[metric] ?? 0);
    return Math.max(...vals, 1);
  }, [veri, metric]);

  const { pathFn, paths, centroids } = useMemo(() => {
    if (!geo)
      return {
        pathFn: null as ((f: GeoJsonFeature) => string | null) | null,
        paths: [] as { name: string; d: string; data?: IlIsiHaritasi }[],
        centroids: new Map<string, [number, number]>(),
      };
    const proj = geoMercator().fitSize(
      [WIDTH, HEIGHT],
      geo as unknown as GeoJSON.FeatureCollection,
    );
    const pf = geoPath(proj);
    const ps = geo.features.map((f) => ({
      name: f.properties.name,
      d: pf(f as unknown as GeoJSON.Feature) ?? '',
      data: byName.get(norm(f.properties.name)),
    }));
    const c = new Map<string, [number, number]>();
    geo.features.forEach((f) => {
      const cent = pf.centroid(f as unknown as GeoJSON.Feature);
      if (!Number.isNaN(cent[0])) c.set(norm(f.properties.name), [cent[0], cent[1]]);
    });
    return { pathFn: (f: GeoJsonFeature) => pf(f as unknown as GeoJSON.Feature), paths: ps, centroids: c };
  }, [geo, byName]);

  const hoverData = hover ? byName.get(norm(hover.il)) : undefined;

  if (!geo || !pathFn) {
    return (
      <div className="flex h-[320px] items-center justify-center text-sm text-ink-dim">
        <span className="animate-pulse">Harita yükleniyor…</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
        <defs>
          <filter id="ilGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {paths.map((p, i) => {
          const v = p.data?.[metric] ?? 0;
          const fill = colorFor(v, max);
          const isHover = hover?.il === p.name;
          return (
            <motion.path
              key={p.name}
              d={p.d}
              fill={fill}
              stroke={isHover ? 'var(--map-stroke-hover)' : 'var(--map-stroke)'}
              strokeWidth={isHover ? 1.2 : 0.5}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.01 * i }}
              onMouseEnter={(e) => {
                const svg = (e.currentTarget.ownerSVGElement as SVGSVGElement) ?? null;
                const rect = svg?.getBoundingClientRect();
                setHover({
                  il: p.name,
                  x: rect ? e.clientX - rect.left : 0,
                  y: rect ? e.clientY - rect.top : 0,
                });
              }}
              onMouseMove={(e) => {
                const svg = (e.currentTarget.ownerSVGElement as SVGSVGElement) ?? null;
                const rect = svg?.getBoundingClientRect();
                setHover((cur) =>
                  cur && cur.il === p.name
                    ? { il: p.name, x: rect ? e.clientX - rect.left : cur.x, y: rect ? e.clientY - rect.top : cur.y }
                    : cur,
                );
              }}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer', filter: isHover ? 'url(#ilGlow)' : undefined }}
            />
          );
        })}

        {/* Canlı radar pulse'ları — il centroidlerinde, SMIL animasyonu (1.5s yayılma) */}
        {pulses?.map((p) => {
          const c = centroids.get(norm(p.il));
          if (!c) return null;
          const col = PULSE_COLOR[p.level ?? 'info'];
          return (
            <g key={p.id} pointerEvents="none">
              {/* Dış halka — geniş radar dalgası */}
              <circle cx={c[0]} cy={c[1]} fill="none" stroke={col} strokeWidth={1.4}>
                <animate attributeName="r" from="2" to="22" dur="1.5s" fill="freeze" />
                <animate attributeName="opacity" from="0.9" to="0" dur="1.5s" fill="freeze" />
              </circle>
              {/* İç halka — daha hızlı dar dalga */}
              <circle cx={c[0]} cy={c[1]} fill={col} fillOpacity={0.35} stroke="none">
                <animate attributeName="r" from="1" to="10" dur="1.1s" fill="freeze" />
                <animate attributeName="opacity" from="1" to="0" dur="1.1s" fill="freeze" />
              </circle>
              {/* Merkez nokta — kısa parlama */}
              <circle cx={c[0]} cy={c[1]} r={2} fill={col}>
                <animate attributeName="opacity" from="1" to="0" dur="0.9s" fill="freeze" />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded-lg bg-bg/70 px-2.5 py-1.5 ring-1 ring-inset ring-border backdrop-blur-sm">
        <span className="text-[10px] font-mono uppercase tracking-wider text-ink-dim">Düşük</span>
        <div
          className="h-2 w-32 rounded-full"
          style={{
            background:
              'linear-gradient(90deg, rgb(22,31,64) 0%, rgb(37,61,144) 20%, rgb(80,70,180) 40%, rgb(165,60,160) 60%, rgb(230,70,95) 80%, rgb(251,146,60) 100%)',
          }}
        />
        <span className="text-[10px] font-mono uppercase tracking-wider text-ink-dim">Yüksek</span>
      </div>

      {/* Tooltip — pozisyon: hover noktasının SVG bounding rect içindeki piksel ofseti */}
      {hover && hoverData && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-border-strong bg-bg-elevated/95 px-3 py-2 text-xs shadow-card backdrop-blur-md"
          style={{
            left: hover.x,
            top: hover.y,
            transform: 'translate(12px, -100%)',
          }}
        >
          <div className="font-display text-sm font-semibold text-ink">{hoverData.il}</div>
          <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-ink-muted">
            <span>Yoğunluk</span>
            <span className="text-right font-mono text-ink">{hoverData.yogunluk}</span>
            <span>Harcama</span>
            <span className="text-right font-mono text-ink">{fmtCompact(hoverData.toplamHarcama * 1_000_000)}</span>
            <span>Kayıt dışı</span>
            <span className="text-right font-mono text-signal-warn">{fmtPct(hoverData.kayitDisi)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
