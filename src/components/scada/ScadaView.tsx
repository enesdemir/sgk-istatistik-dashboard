import { motion } from 'framer-motion';
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Banknote,
  Building2,
  CircleDollarSign,
  Clock,
  FlaskConical,
  HeartPulse,
  Pill,
  Receipt,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Store,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TurkeyHeatmap } from '@/components/charts/TurkeyHeatmap';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { TrafficLight } from '@/components/ui/TrafficLight';
import {
  aktifPasifHedef,
  denetimOzet,
  denetimSeri,
  eczaneOzet,
  gssOzet,
  ilHarita,
  istisnaiBasvurular,
  kronikKalemler,
  ozet,
  saglikDagilim,
  yeniEmekliSeri,
  yerliIthal,
} from '@/data/mockData';
import { useScadaData, type AlarmEvent, type ScadaState, type StreamPoint } from '@/hooks/useScadaData';
import { cn } from '@/lib/cn';
import { fmtCompact, fmtNum, fmtPct } from '@/lib/format';

type SignalLevel = 'ok' | 'warn' | 'bad' | 'info';

/** ─────────────────  Ortak Panel kabı  ───────────────── */
function Panel({
  baslik,
  durum = 'ok',
  className,
  children,
  actions,
  altBaslik,
  noBody = false,
}: {
  baslik?: string;
  altBaslik?: string;
  durum?: SignalLevel;
  className?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  noBody?: boolean;
}) {
  return (
    <section
      className={cn(
        'relative flex min-h-0 flex-col overflow-hidden rounded-xl border bg-bg-surface shadow-card',
        durum === 'bad'
          ? 'border-signal-bad/30'
          : durum === 'warn'
            ? 'border-signal-warn/30'
            : 'border-border',
        className,
      )}
    >
      {baslik && (
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-2.5 py-1.5">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <TrafficLight level={durum} size="sm" pulse={durum !== 'ok'} />
              <span className="truncate text-[11px] font-semibold uppercase tracking-wider text-ink">
                {baslik}
              </span>
            </div>
            {altBaslik && (
              <div className="truncate pl-[16px] text-[9px] text-ink-dim">{altBaslik}</div>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
        </header>
      )}
      {noBody ? (
        children
      ) : (
        <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
      )}
    </section>
  );
}

/** ─────────────────  MicroKpi — kompakt KPI tile (LED + büyük rakam + YoY + hedef)  ───────────────── */
interface MicroKpiProps {
  baslik: string;
  deger: number;
  format: (n: number) => string;
  yoy: number;
  hedef?: string;
  durum: SignalLevel;
  /** YoY artışı iyi mi? (default true). Gider/maliyet için false geçilirse renk ters çevrilir. */
  yoyIyiYukseliyor?: boolean;
  icon: typeof CircleDollarSign;
  numberClass?: string;
}

function MicroKpi({
  baslik,
  deger,
  format,
  yoy,
  hedef,
  durum,
  yoyIyiYukseliyor = true,
  icon: Icon,
  numberClass,
}: MicroKpiProps) {
  const iyi = yoyIyiYukseliyor ? yoy >= 0 : yoy <= 0;
  const TrendIcon = yoy >= 0 ? ArrowUp : ArrowDown;
  return (
    <section
      className={cn(
        'card group relative flex flex-col gap-1 px-2.5 py-1.5',
        durum === 'bad'
          ? 'border-signal-bad/30'
          : durum === 'warn'
            ? 'border-signal-warn/30'
            : 'border-border',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <TrafficLight level={durum} size="sm" pulse={durum !== 'ok'} />
          <Icon size={10} strokeWidth={2.2} className="text-ink-dim" />
          <span className="truncate text-[9px] font-semibold uppercase tracking-wider text-ink-dim">
            {baslik}
          </span>
        </div>
        <span
          className={cn(
            'flex shrink-0 items-center gap-0.5 rounded-sm px-1 py-0 text-[9px] font-bold tabular-nums',
            iyi
              ? 'bg-signal-ok/12 text-signal-ok'
              : 'bg-signal-bad/12 text-signal-bad',
          )}
        >
          <TrendIcon size={9} strokeWidth={2.6} />
          {Math.abs(yoy).toFixed(1)}%
        </span>
      </div>
      <div
        className={cn(
          'font-display text-[22px] font-black leading-none tabular-nums text-ink',
          numberClass,
        )}
      >
        <AnimatedNumber value={deger} duration={650} format={format} />
      </div>
      {hedef && (
        <div className="truncate text-[9px] font-mono text-ink-dim">{hedef}</div>
      )}
    </section>
  );
}

/** ─────────────────  Mini Bar Trend (12 ay)  ───────────────── */
function MiniBarTrend({
  data,
  dataKey,
  color,
  baslik,
  altBaslik,
  durum = 'info',
}: {
  data: any[];
  dataKey: string;
  color: string;
  baslik: string;
  altBaslik?: string;
  durum?: SignalLevel;
}) {
  return (
    <Panel baslik={baslik} altBaslik={altBaslik} durum={durum}>
      <div className="min-h-0 flex-1 p-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
            <Bar dataKey={dataKey} fill={color} radius={[2, 2, 0, 0]} />
            <Tooltip
              cursor={{ fill: 'rgb(var(--ink) / 0.04)' }}
              labelFormatter={(l: any) => `${l}`}
              contentStyle={{ fontSize: 10 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

/** ─────────────────  Mini Area Trend (line + area)  ───────────────── */
function MiniAreaTrend({
  data,
  series,
  baslik,
  altBaslik,
  durum = 'info',
}: {
  data: any[];
  series: { key: string; name: string; color: string }[];
  baslik: string;
  altBaslik?: string;
  durum?: SignalLevel;
}) {
  return (
    <Panel baslik={baslik} altBaslik={altBaslik} durum={durum}>
      <div className="min-h-0 flex-1 p-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -22, bottom: -4 }}>
            <defs>
              {series.map((s) => (
                <linearGradient key={s.key} id={`g-${s.key}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <XAxis dataKey="ay" tick={{ fontSize: 8 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 8 }} tickLine={false} axisLine={false} width={26} />
            <Tooltip contentStyle={{ fontSize: 10 }} />
            {series.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={1.8}
                fill={`url(#g-${s.key})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

/** ─────────────────  Gauge Ring (E-Reçete %, EYT pay vb.)  ───────────────── */
function GaugeRing({
  baslik,
  altBaslik,
  yuzde,
  durum = 'ok',
  altMetin,
  renk,
}: {
  baslik: string;
  altBaslik?: string;
  yuzde: number;
  durum?: SignalLevel;
  altMetin?: string;
  renk?: string;
}) {
  const ringColor =
    renk ??
    (durum === 'ok'
      ? 'rgb(var(--signal-ok))'
      : durum === 'warn'
        ? 'rgb(var(--signal-warn))'
        : durum === 'bad'
          ? 'rgb(var(--signal-bad))'
          : 'rgb(var(--signal-info))');
  const c = 2 * Math.PI * 32;
  const offset = c - (yuzde / 100) * c;

  return (
    <Panel baslik={baslik} altBaslik={altBaslik} durum={durum}>
      <div className="flex min-h-0 flex-1 items-center justify-center gap-2 px-2 py-1.5">
        <div className="relative">
          <svg width={78} height={78} viewBox="0 0 78 78" className="-rotate-90">
            <circle
              cx={39}
              cy={39}
              r={32}
              fill="none"
              stroke="rgb(var(--ink) / 0.10)"
              strokeWidth={7}
            />
            <motion.circle
              cx={39}
              cy={39}
              r={32}
              fill="none"
              stroke={ringColor}
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray={c}
              initial={{ strokeDashoffset: c }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-base font-black tabular-nums text-ink">
              {yuzde >= 100 ? Math.round(yuzde) : yuzde.toFixed(1)}
            </span>
            <span className="text-[8px] font-mono uppercase text-ink-dim">%</span>
          </div>
        </div>
        {altMetin && (
          <div className="min-w-0 flex-1 text-[10px] leading-tight text-ink-muted">{altMetin}</div>
        )}
      </div>
    </Panel>
  );
}

/** ─────────────────  Sağlık Harcamaları (3 grup + 6 kalem amount bar)  ───────────────── */
const SAGLIK_GRUP_RENK: Record<'Hastane' | 'Eczane' | 'Sağlık', string> = {
  Hastane: '#3b6bf5',
  Eczane: '#a855f7',
  Sağlık: '#10b981',
};

function SaglikDagilimPanel() {
  const { gruplar, max } = useMemo(() => {
    const m: Record<'Hastane' | 'Eczane' | 'Sağlık', number> = {
      Hastane: 0,
      Eczane: 0,
      Sağlık: 0,
    };
    saglikDagilim.forEach((d) => {
      m[d.grup] += d.tutar;
    });
    return {
      gruplar: m,
      max: Math.max(...saglikDagilim.map((d) => d.tutar)),
    };
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col gap-1.5 px-2 py-1.5">
      <div className="grid shrink-0 grid-cols-3 gap-1">
        {(['Hastane', 'Eczane', 'Sağlık'] as const).map((g) => (
          <div
            key={g}
            className="rounded-md border border-border bg-bg-elevated px-1.5 py-1"
          >
            <div className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wider text-ink-dim">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: SAGLIK_GRUP_RENK[g] }}
              />
              {g}
            </div>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="font-display text-sm font-bold tabular-nums text-ink">
                {gruplar[g].toFixed(1)}
              </span>
              <span className="text-[8px] font-mono text-ink-dim">mlr ₺</span>
            </div>
          </div>
        ))}
      </div>
      <ul className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
        {saglikDagilim.map((d) => (
          <li
            key={d.kurum}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-1.5 text-[9px]"
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-sm"
              style={{ background: d.renk }}
            />
            <div className="min-w-0">
              <div className="truncate text-ink">{d.kurum}</div>
              <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-bg-elevated">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(d.tutar / max) * 100}%`,
                    background: d.renk,
                    opacity: 0.85,
                  }}
                />
              </div>
            </div>
            <span className="shrink-0 font-mono text-[10px] font-semibold tabular-nums text-ink">
              {d.tutar.toFixed(1)}
              <span className="ml-0.5 text-[8px] font-normal text-ink-dim">mlr</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** ─────────────────  Kronik Hastalık Top Kalemler  ───────────────── */
function KronikList() {
  const max = useMemo(() => Math.max(...kronikKalemler.map((k) => k.tutar)), []);
  return (
    <ul className="flex h-full min-h-0 flex-col gap-1 px-2 py-1.5 text-[10px]">
      {kronikKalemler.map((k) => (
        <li
          key={k.ad}
          className="grid grid-cols-[1fr_auto] items-center gap-2"
        >
          <div className="min-w-0">
            <div className="flex items-baseline justify-between">
              <span className="truncate text-ink">{k.ad}</span>
              <span
                className={cn(
                  'shrink-0 font-mono text-[9px] font-semibold',
                  k.trend > 5 ? 'text-signal-bad' : k.trend > 2 ? 'text-signal-warn' : 'text-signal-ok',
                )}
              >
                +{k.trend.toFixed(1)}%
              </span>
            </div>
            <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-bg-elevated">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500"
                style={{ width: `${(k.tutar / max) * 100}%`, opacity: 0.8 }}
              />
            </div>
          </div>
          <span className="font-mono text-[11px] font-semibold tabular-nums text-ink">
            {k.tutar.toFixed(1)}
            <span className="ml-0.5 text-[8px] font-normal text-ink-dim">mlr</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** ─────────────────  Yerli / İthal Yatay Stack  ───────────────── */
function YerliIthalMini() {
  return (
    <div className="flex h-full flex-col gap-2 px-2.5 py-1.5">
      {yerliIthal.map((row) => (
        <div key={row.ad} className="text-[10px]">
          <div className="mb-0.5 flex items-center justify-between">
            <span className="font-mono uppercase tracking-wider text-ink-dim">{row.ad}</span>
            <span className="font-mono text-ink">%{row.yerli} · %{row.ithal}</span>
          </div>
          <div className="flex h-3 overflow-hidden rounded-md ring-1 ring-inset ring-border">
            <div
              className="bg-gradient-to-r from-signal-ok to-emerald-400"
              style={{ width: `${row.yerli}%` }}
              title={`Yerli %${row.yerli}`}
            />
            <div
              className="bg-gradient-to-r from-signal-warn to-amber-400"
              style={{ width: `${row.ithal}%` }}
              title={`İthal %${row.ithal}`}
            />
          </div>
        </div>
      ))}
      <div className="mt-auto flex items-center justify-between text-[9px] text-ink-dim">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-sm bg-signal-ok" /> Yerli
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-sm bg-signal-warn" /> İthal
        </span>
      </div>
    </div>
  );
}

/** ─────────────────  Denetim Performansı (iptal gün + tasarruf)  ───────────────── */
function DenetimMini() {
  const sonAy = denetimSeri[denetimSeri.length - 1];
  return (
    <div className="flex h-full flex-col gap-1.5 px-2.5 py-1.5">
      <div className="grid grid-cols-2 gap-1.5">
        <div className="rounded-md border border-border bg-bg-elevated px-2 py-1">
          <div className="text-[8px] font-semibold uppercase tracking-wider text-ink-dim">
            İptal Gün (ay)
          </div>
          <div className="font-display text-base font-bold tabular-nums text-signal-info">
            {fmtCompact(sonAy.iptalGun)}
          </div>
        </div>
        <div className="rounded-md border border-border bg-bg-elevated px-2 py-1">
          <div className="text-[8px] font-semibold uppercase tracking-wider text-ink-dim">
            Tasarruf
          </div>
          <div className="font-display text-base font-bold tabular-nums text-signal-ok">
            {sonAy.tasarruf} <span className="text-[9px] font-normal text-ink-dim">mn ₺</span>
          </div>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={denetimSeri.slice(-12)} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <Line
              type="monotone"
              dataKey="tasarruf"
              stroke="#10b981"
              strokeWidth={1.8}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="yersizOdeme"
              stroke="#ef4444"
              strokeWidth={1.6}
              strokeDasharray="3 2"
              dot={false}
              isAnimationActive={false}
            />
            <Tooltip contentStyle={{ fontSize: 10 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** ─────────────────  Gelir vs Gider Stream Mini  ───────────────── */
function StreamMini({ data }: { data: StreamPoint[] }) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="ms-gelir" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ms-gider" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgb(var(--ink) / 0.06)" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="t" hide />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={24}
            tick={{ fontSize: 8 }}
            tickFormatter={(v: number) => `${Math.round(v)}`}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip
            isAnimationActive={false}
            labelFormatter={(t: any) => new Date(t as number).toLocaleTimeString('tr-TR')}
            formatter={(v: number, n) => [`${v.toFixed(1)} mlr ₺`, n]}
            contentStyle={{ fontSize: 10 }}
          />
          <Area
            type="monotone"
            dataKey="gider"
            stroke="#ef4444"
            strokeWidth={1.6}
            fill="url(#ms-gider)"
            isAnimationActive={false}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="gelir"
            stroke="#10b981"
            strokeWidth={1.8}
            fill="url(#ms-gelir)"
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** ─────────────────  Olay Akışı (kompakt)  ───────────────── */
function OlayAkisiMini({ alarms }: { alarms: AlarmEvent[] }) {
  return (
    <ul className="flex h-full min-h-0 flex-col gap-0.5 overflow-hidden px-2 py-1 text-[10px]">
      {alarms.slice(0, 6).map((a) => (
        <motion.li
          key={a.id}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-[auto_1fr_auto] items-center gap-1.5 rounded-md border border-border bg-bg-elevated px-1.5 py-1"
        >
          <span
            className={cn(
              'inline-flex h-1.5 w-1.5 shrink-0 rounded-full',
              a.level === 'bad'
                ? 'bg-signal-bad'
                : a.level === 'warn'
                  ? 'bg-signal-warn'
                  : a.level === 'ok'
                    ? 'bg-signal-ok'
                    : 'bg-signal-info',
            )}
          />
          <span className="truncate text-ink">{a.message}</span>
          <span className="shrink-0 font-mono text-[8px] text-ink-dim">
            {a.time.toLocaleTimeString('tr-TR', { hour12: false }).slice(0, 5)}
          </span>
        </motion.li>
      ))}
    </ul>
  );
}

/** ─────────────────  Provizyon Mini Sayaç  ───────────────── */
function ProvCounterMini({ anlik, bugun }: { anlik: number; bugun: number }) {
  return (
    <div className="flex h-full flex-col justify-between px-2.5 py-1.5">
      <div>
        <div className="text-[8px] font-semibold uppercase tracking-wider text-ink-dim">
          Anlık
        </div>
        <div className="font-display text-xl font-black tabular-nums text-signal-info">
          <AnimatedNumber value={anlik} duration={500} format={(n) => fmtNum(Math.round(n))} />
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-[9px] text-signal-info">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-info opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-info" />
          </span>
          akış
        </div>
      </div>
      <div className="rounded-md bg-bg-elevated px-2 py-1 text-[9px]">
        <div className="flex items-center justify-between">
          <span className="text-ink-dim">Bugün</span>
          <span className="font-mono font-semibold text-ink tabular-nums">
            <AnimatedNumber value={bugun} duration={400} format={fmtNum} />
          </span>
        </div>
      </div>
    </div>
  );
}

/** ─────────────────  Aktif/Pasif gauge mini  ───────────────── */
function AktifPasifMini({ deger }: { deger: number }) {
  const sapma = ((deger - aktifPasifHedef.hedef) / aktifPasifHedef.hedef) * 100;
  return (
    <div className="flex h-full flex-col gap-1.5 px-2.5 py-1.5">
      <div>
        <div className="text-[8px] font-semibold uppercase tracking-wider text-ink-dim">
          Aktif / Pasif
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-display text-xl font-black tabular-nums text-ink">
            <AnimatedNumber value={deger} duration={700} format={(n) => n.toFixed(2)} />
          </span>
          <span className="rounded-sm bg-signal-ok/12 px-1 text-[9px] font-bold text-signal-ok">
            +{sapma.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-bg-elevated ring-1 ring-inset ring-border">
        <div
          className="h-full rounded-full bg-gradient-to-r from-signal-bad via-signal-warn to-signal-ok"
          style={{ width: `${Math.min(100, (deger / 3.0) * 100)}%` }}
        />
        <div
          className="absolute top-0 h-full w-px bg-ink/60"
          style={{ left: `${(aktifPasifHedef.hedef / 3.0) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-[8px] font-mono text-ink-dim">
        <span>0</span>
        <span>hedef 2.00</span>
        <span>3.0</span>
      </div>
    </div>
  );
}

/** ─────────────────  Main View  ───────────────── */
export function ScadaView() {
  const s = useScadaData();
  return (
    <>
      <ScadaHeader s={s} />
      <ScadaDashboard s={s} />
    </>
  );
}

function ScadaDashboard({ s }: { s: ScadaState }) {
  const gelirGiderOrani = (s.gelirRate / s.giderRate) * 100;
  const sonAy = denetimSeri[denetimSeri.length - 1];
  const dosyaBaglamaOrt = 34;
  const yeniEmekliSon = yeniEmekliSeri[yeniEmekliSeri.length - 1];

  return (
    <div
      className="grid w-full gap-2 font-sans"
      style={{
        height: 'calc(100vh - 4.5rem)',
        gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
        gridTemplateRows: '1.5fr 1fr',
      }}
    >
      {/* ═════════════════════ ÜST SATIR ═════════════════════ */}

      {/* SOL KOLON — 6 MicroKpi (kategori 1+2) */}
      <div className="col-span-2 grid min-h-0 grid-rows-6 gap-2">
        {/* GELİR-GİDER */}
        <MicroKpi
          baslik="Gelir / Gider"
          deger={gelirGiderOrani}
          format={(n) => `%${n.toFixed(1)}`}
          yoy={4.6}
          hedef="hedef ≥ %100"
          durum="ok"
          icon={Scale}
        />
        <MicroKpi
          baslik="Aktüeryal"
          deger={s.aktuaryalDenge}
          format={(n) => `+${n.toFixed(1)}`}
          yoy={18.4}
          hedef="mlr ₺ · fazla"
          durum="ok"
          icon={Banknote}
        />
        <MicroKpi
          baslik="Prim Tahsilat"
          deger={s.tahsilatPct}
          format={(n) => `%${n.toFixed(1)}`}
          yoy={2.4}
          hedef="hedef %92"
          durum="ok"
          icon={CircleDollarSign}
        />
        <MicroKpi
          baslik="Yapılandırma"
          deger={94.0}
          format={(n) => `%${n.toFixed(1)}`}
          yoy={11.2}
          hedef="158.2 / 168.4 mlr ₺"
          durum="ok"
          icon={Receipt}
        />
        {/* EMEKLİLİK */}
        <MicroKpi
          baslik="Dosya Bağlama"
          deger={dosyaBaglamaOrt}
          format={(n) => `${Math.round(n)} gün`}
          yoy={8.2}
          hedef="hedef ≤ 30 gün"
          durum="warn"
          icon={Clock}
          yoyIyiYukseliyor={false}
        />
        <MicroKpi
          baslik="Yeni Emekli"
          deger={yeniEmekliSon.yeniEmekli}
          format={(n) => fmtCompact(n)}
          yoy={9.6}
          hedef={`yeni sigortalı ${fmtCompact(yeniEmekliSon.yeniSigortali)}`}
          durum="info"
          icon={UserCheck}
          yoyIyiYukseliyor={false}
        />
      </div>

      {/* ORTA — TÜRKİYE HARİTASI */}
      <div className="col-span-6 row-span-1 min-h-0">
        <Panel
          baslik="Türkiye Isı Haritası"
          altBaslik="İl bazlı saha denetimi yoğunluğu · canlı izleme"
          durum="info"
          actions={
            <span className="flex items-center gap-1 rounded-full bg-signal-info/15 px-1.5 py-0 font-mono text-[9px] font-bold uppercase tracking-wider text-signal-info">
              <span className="h-1 w-1 animate-pulse rounded-full bg-signal-info" />
              CANLI
            </span>
          }
        >
          <div className="min-h-0 flex-1 px-1 py-1">
            <TurkeyHeatmap veri={ilHarita} metric="yogunluk" />
          </div>
        </Panel>
      </div>

      {/* SAĞ KOLON 1 — 6 MicroKpi (kategori 3+4+5) */}
      <div className="col-span-2 grid min-h-0 grid-rows-6 gap-2">
        {/* SAĞLIK */}
        <MicroKpi
          baslik="Aylık Sağlık"
          deger={saglikDagilim.reduce((acc, d) => acc + d.tutar, 0)}
          format={(n) => `${n.toFixed(1)}`}
          yoy={11.4}
          hedef="mlr ₺ · YoY %11.4"
          durum="warn"
          icon={HeartPulse}
          yoyIyiYukseliyor={false}
        />
        <MicroKpi
          baslik="GSS Kapsamı"
          deger={gssOzet.kapsam60c1}
          format={(n) => fmtCompact(n)}
          yoy={gssOzet.degisim}
          hedef="60/c-1 prim devlet"
          durum="ok"
          icon={ShieldCheck}
          yoyIyiYukseliyor={false}
        />
        {/* ECZANE */}
        <MicroKpi
          baslik="Reçete Maliyeti"
          deger={eczaneOzet[0].deger}
          format={(n) => `₺${Math.round(n)}`}
          yoy={eczaneOzet[0].trend}
          hedef="reçete başı · ay 32.4mn"
          durum="warn"
          icon={Pill}
          yoyIyiYukseliyor={false}
        />
        <MicroKpi
          baslik="Eczane Sayısı"
          deger={27_600}
          format={(n) => fmtCompact(n)}
          yoy={0.8}
          hedef="sözleşmeli ağ"
          durum="ok"
          icon={Store}
        />
        {/* DENETİM */}
        <MicroKpi
          baslik="Kayıt Dışı"
          deger={denetimOzet.kayitDisiOran}
          format={(n) => `%${n.toFixed(1)}`}
          yoy={
            ((denetimOzet.kayitDisiOran - denetimOzet.kayitDisiOranOnceki) /
              denetimOzet.kayitDisiOranOnceki) *
            100
          }
          hedef="hedef ≤ %20"
          durum="warn"
          icon={ShieldAlert}
          yoyIyiYukseliyor={false}
        />
        <MicroKpi
          baslik="Yersiz Ödeme"
          deger={denetimOzet.takiptekiYersizOdeme / 1_000_000_000}
          format={(n) => `${n.toFixed(1)}`}
          yoy={9.6}
          hedef={`takipte mlr ₺ · geri al ${(denetimOzet.geriAlinan / 1_000_000_000).toFixed(2)}`}
          durum="warn"
          icon={FlaskConical}
          yoyIyiYukseliyor={false}
        />
      </div>

      {/* SAĞ KOLON 2 — Mini chart/gauge/sayaç */}
      <div className="col-span-2 grid min-h-0 grid-rows-3 gap-2">
        <MiniAreaTrend
          baslik="Sigortalı vs Emekli"
          altBaslik="12 ay · cyan: yeni sigortalı"
          data={yeniEmekliSeri}
          series={[
            { key: 'yeniSigortali', name: 'Sigortalı', color: '#06b6d4' },
            { key: 'yeniEmekli', name: 'Emekli', color: '#a855f7' },
          ]}
          durum="info"
        />
        <GaugeRing
          baslik="E-Reçete Kullanımı"
          altBaslik="dijitalleşme oranı"
          yuzde={eczaneOzet[2].deger}
          durum="ok"
          altMetin="32.4 mn aylık reçete · dünya ort. üstü"
        />
        <Panel baslik="Provizyon · Anlık" durum="info" altBaslik="sağlık servisi">
          <ProvCounterMini anlik={s.provizyonAnlik} bugun={s.provizyonBugun} />
        </Panel>
      </div>

      {/* ═════════════════════ ALT SATIR — 6 panel ═════════════════════ */}

      <Panel
        baslik="Sağlık Harcamaları"
        altBaslik={`Hastane / Eczane / Sağlık · aylık ${saglikDagilim.reduce((a, b) => a + b.tutar, 0).toFixed(1)} mlr ₺`}
        durum="warn"
        className="col-span-3"
      >
        <SaglikDagilimPanel />
      </Panel>

      <Panel
        baslik="Kronik & Yüksek Maliyetli"
        altBaslik="onkoloji, diyabet, kardiyo · YoY"
        durum="warn"
        className="col-span-2"
      >
        <KronikList />
      </Panel>

      <Panel
        baslik="Yerli vs İthal İlaç"
        altBaslik="adet vs maliyet payı"
        durum="warn"
        className="col-span-2"
      >
        <YerliIthalMini />
      </Panel>

      <Panel
        baslik="Denetim Performansı"
        altBaslik={`son ${sonAy.ay} · iptal & tasarruf`}
        durum="info"
        className="col-span-2"
      >
        <DenetimMini />
      </Panel>

      <Panel
        baslik="Gelir vs Gider"
        altBaslik="canlı akış · mlr ₺"
        durum="ok"
        className="col-span-2"
        actions={
          <span className="flex items-center gap-1 font-mono text-[9px] text-signal-info">
            <span className="h-1 w-1 animate-pulse rounded-full bg-signal-info" />
            LIVE
          </span>
        }
      >
        <div className="min-h-0 flex-1 p-1">
          <StreamMini data={s.series} />
        </div>
      </Panel>

      <Panel
        baslik="Olay Akışı"
        altBaslik={`${s.alarms.length} kayıt · sistem logu`}
        durum="warn"
        className="col-span-1"
      >
        <OlayAkisiMini alarms={s.alarms} />
      </Panel>

      {/* İstisnai & Aktif/Pasif — orta sütunun altına oturtulan ince strip */}
      {/* (alt satır 12 col, yukarıdaki paneller toplam 12 olduğundan bunlar 2. satırda olmaz; üst satırdaki harita altına yerleşik mini-stripler yerine bu iki widget alt satıra eklenmedi) */}

      {/* Headline: bu yapıda zaten her kategori KPI temsili sahip; istisnai başvuru ve aktif/pasif gauge gerekirse map altına stretch edilebilir */}
      {void istisnaiBasvurular}
    </div>
  );
}

/** ─────────────────  Header  ───────────────── */
function ScadaHeader({ s }: { s: ScadaState }) {
  const kritikSayi = s.alarms.filter((al) => al.level === 'bad').length;
  const uyariSayi = s.alarms.filter((al) => al.level === 'warn').length;

  return (
    <header className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-border bg-bg-subtle px-3 py-2 shadow-card">
      <div className="flex items-center gap-3 min-w-0">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-signal-info text-white shadow-glow">
          <Activity size={18} strokeWidth={2.4} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-bold leading-none tracking-tight text-ink">
              SGK · Genel Durum
            </span>
            <span className="hidden items-center gap-1 rounded-full bg-signal-info/15 px-1.5 py-0 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-signal-info sm:inline-flex">
              <span className="h-1 w-1 animate-pulse rounded-full bg-signal-info" />
              CANLI
            </span>
          </div>
          <div className="mt-0.5 text-[10px] text-ink-dim">
            Aktif {fmtCompact(ozet.aktifSigortali)} · Pasif {fmtCompact(ozet.pasifSigortali)} ·
            Aktüeryal{' '}
            <span className="font-mono font-semibold text-signal-ok">
              +{s.aktuaryalDenge.toFixed(1)} mlr ₺
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1.5 font-mono text-[10px] md:flex">
          <span className="flex items-center gap-1 rounded-full bg-signal-bad/10 px-1.5 py-0.5 text-signal-bad">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-bad" />
            {kritikSayi.toString().padStart(2, '0')} kritik
          </span>
          <span className="flex items-center gap-1 rounded-full bg-signal-warn/10 px-1.5 py-0.5 text-signal-warn">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-warn" />
            {uyariSayi.toString().padStart(2, '0')} uyarı
          </span>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-bg-elevated px-2 py-1 font-mono">
          <Zap size={11} className="text-signal-info" />
          <span className="text-[11px] font-semibold tabular-nums text-ink">
            {s.time.toLocaleTimeString('tr-TR', { hour12: false })}
          </span>
          <span className="hidden text-[9px] text-ink-dim sm:inline">
            {s.time.toLocaleDateString('tr-TR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
