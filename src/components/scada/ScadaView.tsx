import { motion } from 'framer-motion';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CircleDollarSign,
  HeartPulse,
  ScanLine,
  Scale,
  Users,
  Zap,
} from 'lucide-react';
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TurkeyHeatmap } from '@/components/charts/TurkeyHeatmap';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { TrafficLight } from '@/components/ui/TrafficLight';
import { ilHarita } from '@/data/mockData';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useScadaData, type AlarmEvent, type ScadaState, type StreamPoint } from '@/hooks/useScadaData';
import { cn } from '@/lib/cn';
import { fmtCompact, fmtNum, fmtTLCompact } from '@/lib/format';

/** ───────────────── Panel: standart SCADA panel kabı ───────────────── */
function Panel({
  kod,
  baslik,
  durum = 'ok',
  className,
  children,
  actions,
}: {
  kod: string;
  baslik: string;
  durum?: 'ok' | 'warn' | 'bad' | 'info';
  className?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'group relative flex min-h-0 flex-col overflow-hidden rounded-xl border bg-bg-surface shadow-card',
        durum === 'bad'
          ? 'border-signal-bad/30'
          : durum === 'warn'
            ? 'border-signal-warn/30'
            : 'border-border',
        className,
      )}
    >
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <TrafficLight level={durum} size="sm" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-dim">
            {kod}
          </span>
          <span className="truncate text-[11px] font-medium text-ink">{baslik}</span>
        </div>
        {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
      </header>
      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

/** ───────────────── KPI Ticker — kompakt canlı KPI ───────────────── */
function KpiTicker({
  baslik,
  kod,
  deger,
  birim,
  format,
  durum = 'ok',
  yon,
  hedef,
  icon: Icon,
}: {
  baslik: string;
  kod: string;
  deger: number;
  birim?: string;
  format?: (n: number) => string;
  durum?: 'ok' | 'warn' | 'bad' | 'info';
  yon?: 'up' | 'down' | 'flat';
  hedef?: string;
  icon: typeof CircleDollarSign;
}) {
  const TrendIcon =
    yon === 'up' ? ArrowUpRight : yon === 'down' ? ArrowDownRight : ScanLine;
  const trendColor =
    yon === 'up'
      ? 'text-signal-ok'
      : yon === 'down'
        ? 'text-signal-bad'
        : 'text-ink-muted';

  return (
    <Panel kod={kod} baslik={baslik} durum={durum} className="h-full">
      <div className="flex flex-1 flex-col justify-between px-3 py-2">
        <div className="flex items-start justify-between gap-2">
          <Icon size={14} strokeWidth={2.2} className="text-ink-dim" />
          <span className={cn('flex items-center gap-0.5 text-[10px] font-medium', trendColor)}>
            <TrendIcon size={11} strokeWidth={2.4} />
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="font-display text-2xl font-bold tracking-tight text-ink tabular-nums">
            <AnimatedNumber
              value={deger}
              duration={700}
              format={format ?? ((n) => fmtNum(Math.round(n)))}
            />
          </span>
          {birim && (
            <span className="text-[10px] font-mono uppercase text-ink-dim">{birim}</span>
          )}
        </div>
        {hedef && (
          <div className="mt-0.5 truncate text-[10px] font-mono text-ink-dim">{hedef}</div>
        )}
      </div>
    </Panel>
  );
}

/** ───────────────── Stream Chart — gelir/gider sliding ───────────────── */
function StreamChart({ data }: { data: StreamPoint[] }) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 6, right: 6, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="strmGelir" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="strmGider" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgb(var(--ink) / 0.06)" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="t" hide />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={28}
            tickFormatter={(v) => `${Math.round(v)}`}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip
            isAnimationActive={false}
            labelFormatter={(t) => new Date(t as number).toLocaleTimeString('tr-TR')}
            formatter={(v: number, n) => [`${v.toFixed(1)} mlr ₺`, n]}
          />
          <ReferenceLine
            y={data[data.length - 1]?.gider ?? 240}
            stroke="rgb(var(--ink) / 0.18)"
            strokeDasharray="3 3"
          />
          <Area
            type="monotone"
            dataKey="gider"
            name="Gider"
            stroke="#ef4444"
            strokeWidth={1.8}
            fill="url(#strmGider)"
            isAnimationActive={false}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="gelir"
            name="Gelir"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#strmGelir)"
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** ───────────────── Net Bakiye Bar — son N tick'in net farkı ───────────────── */
function NetBars({ data }: { data: StreamPoint[] }) {
  const max = useMemo(() => Math.max(...data.map((p) => Math.abs(p.net)), 1), [data]);
  return (
    <div className="flex h-full items-end gap-[2px] px-3 pb-2">
      {data.slice(-40).map((p, i) => {
        const pct = (Math.abs(p.net) / max) * 100;
        const positive = p.net >= 0;
        return (
          <div
            key={`${p.t}-${i}`}
            className="relative flex flex-1 items-end justify-center"
            style={{ height: '100%' }}
          >
            <div
              className={cn(
                'w-full rounded-sm transition-all duration-300',
                positive ? 'bg-signal-ok' : 'bg-signal-bad',
              )}
              style={{ height: `${Math.max(4, pct)}%`, opacity: 0.4 + (i / 40) * 0.6 }}
            />
          </div>
        );
      })}
    </div>
  );
}

/** ───────────────── Alarm Terminal ───────────────── */
function AlarmTerminal({ alarms }: { alarms: AlarmEvent[] }) {
  return (
    <div className="flex h-full flex-col overflow-hidden font-mono text-[11px] leading-tight">
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-ink/[0.03] px-3 py-1">
        <span className="font-semibold uppercase tracking-[0.16em] text-ink-dim">
          Sistem Log
        </span>
        <span className="text-[9px] text-ink-dim">
          {alarms.length} kayıt · auto-scroll
        </span>
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto px-3 py-1">
        {alarms.map((a) => (
          <motion.li
            key={a.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-[auto_auto_1fr] gap-2 border-b border-border/40 py-[3px] last:border-b-0"
          >
            <span className="text-ink-dim">
              {a.time.toLocaleTimeString('tr-TR', { hour12: false })}
            </span>
            <span
              className={cn(
                'rounded px-1 text-[9px] font-bold uppercase',
                a.level === 'bad'
                  ? 'bg-signal-bad/15 text-signal-bad'
                  : a.level === 'warn'
                    ? 'bg-signal-warn/15 text-signal-warn'
                    : a.level === 'ok'
                      ? 'bg-signal-ok/15 text-signal-ok'
                      : 'bg-signal-info/15 text-signal-info',
              )}
            >
              {a.source}
            </span>
            <span className="truncate text-ink">{a.message}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/** ───────────────── Provizyon canlı sayaç ───────────────── */
function ProvCounter({ anlik, bugun }: { anlik: number; bugun: number }) {
  return (
    <div className="grid h-full grid-rows-[1fr_auto] gap-2 p-3">
      <div className="flex flex-col items-center justify-center">
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim">
          Anlık Provizyon
        </div>
        <div className="font-display text-4xl font-black tabular-nums text-ink">
          <AnimatedNumber value={anlik} duration={500} format={(n) => fmtNum(Math.round(n))} />
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-signal-info">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-info" />
          gerçek zamanlı akış
        </div>
      </div>
      <div className="rounded-md border border-border bg-bg-elevated px-2 py-1.5">
        <div className="flex items-center justify-between text-[10px] text-ink-dim">
          <span>Bugün toplam</span>
          <span className="font-mono text-ink">
            <AnimatedNumber value={bugun} duration={400} format={fmtNum} />
          </span>
        </div>
      </div>
    </div>
  );
}

/** ───────────────── ScadaView (Ana) — header + dashboard tek hook'tan beslenir ───────────────── */
export function ScadaView() {
  const s = useScadaData();
  return (
    <>
      <ScadaHeaderInternal s={s} />
      <ScadaDashboard s={s} />
    </>
  );
}

function ScadaDashboard({ s }: { s: ScadaState }) {
  const gelirGiderOrani = (s.gelirRate / s.giderRate) * 100;
  const aktifPasifSapma = ((s.aktifPasif - 2.0) / 2.0) * 100;

  return (
    <div
      className="grid w-full gap-3 font-sans"
      style={{
        height: 'calc(100vh - 5.5rem)',
        gridTemplateRows: '1.25fr 1fr',
      }}
    >
      {/* ───── ÜST: Türkiye haritası + sağ KPI strip ───── */}
      <div className="grid min-h-0 gap-3 lg:grid-cols-[2fr_1fr]">
        {/* Türkiye haritası — geniş */}
        <Panel kod="M-01" baslik="Türkiye İl Bazlı Yoğunluk · Canlı" durum="info">
          <div className="min-h-0 flex-1 p-2">
            <TurkeyHeatmap veri={ilHarita} metric="yogunluk" />
          </div>
        </Panel>

        {/* Sağ KPI kolonu: 2x2 ana KPI + 1 büyük provizyon */}
        <div className="grid min-h-0 gap-3" style={{ gridTemplateRows: '1fr 1fr 1fr' }}>
          <div className="grid grid-cols-2 gap-3">
            <KpiTicker
              kod="K-01"
              baslik="Aktüeryal Fazla"
              deger={s.aktuaryalDenge}
              birim="mlr ₺"
              format={(n) => `+${n.toFixed(1)}`}
              durum="ok"
              yon="up"
              hedef="YbD pozitif"
              icon={Banknote}
            />
            <KpiTicker
              kod="K-02"
              baslik="Gelir / Gider"
              deger={gelirGiderOrani}
              format={(n) => `%${n.toFixed(1)}`}
              durum="ok"
              yon="up"
              hedef="hedef ≥%100"
              icon={Scale}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <KpiTicker
              kod="K-03"
              baslik="Aktif / Pasif"
              deger={s.aktifPasif}
              format={(n) => n.toFixed(2)}
              durum="ok"
              yon="up"
              hedef={`hedef 2.00 (+${aktifPasifSapma.toFixed(1)}%)`}
              icon={Users}
            />
            <KpiTicker
              kod="K-04"
              baslik="Tahsilat"
              deger={s.tahsilatPct}
              format={(n) => `%${n.toFixed(1)}`}
              durum="ok"
              yon="up"
              hedef="hedef %92"
              icon={CircleDollarSign}
            />
          </div>
          <Panel kod="P-01" baslik="Provizyon Akışı" durum="info" className="h-full">
            <ProvCounter anlik={s.provizyonAnlik} bugun={s.provizyonBugun} />
          </Panel>
        </div>
      </div>

      {/* ───── ALT: 3 panel canlı grafikler ───── */}
      <div className="grid min-h-0 gap-3 lg:grid-cols-[1.4fr_1fr_1.1fr]">
        {/* Stream chart */}
        <Panel
          kod="S-01"
          baslik="Gelir vs Gider · Canlı Akış (mlr ₺)"
          durum="ok"
          actions={
            <span className="flex items-center gap-2 font-mono text-[10px] text-ink-dim">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-signal-ok" /> gelir
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-signal-bad" /> gider
              </span>
              <span className="ml-1 flex items-center gap-1 text-signal-info">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-info" />
                LIVE
              </span>
            </span>
          }
        >
          <div className="min-h-0 flex-1 p-1">
            <StreamChart data={s.series} />
          </div>
        </Panel>

        {/* Net delta barlar */}
        <Panel
          kod="S-02"
          baslik="Net Bakiye Delta"
          durum="ok"
          actions={
            <span className="font-mono text-[10px] text-ink-dim">
              son 40 tick · {(s.gelirRate - s.giderRate).toFixed(1)} mlr ₺
            </span>
          }
        >
          <NetBars data={s.series} />
        </Panel>

        {/* Alarm log terminal */}
        <Panel kod="L-01" baslik="Alarm & Sistem Log" durum="warn">
          <AlarmTerminal alarms={s.alarms} />
        </Panel>
      </div>
    </div>
  );
}

/** ───────────────── Üst Status Strip — ScadaView içinde çağrılır ───────────────── */
function ScadaHeaderInternal({ s }: { s: ScadaState }) {
  const kritikSayi = s.alarms.filter((a) => a.level === 'bad').length;
  const uyariSayi = s.alarms.filter((a) => a.level === 'warn').length;

  return (
    <header className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-border bg-bg-subtle px-4 py-2 shadow-card">
      <div className="flex items-center gap-3 min-w-0">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-signal-info text-white shadow-glow">
          <Activity size={18} strokeWidth={2.4} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-bold leading-none tracking-tight text-ink">
              SGK · Genel Durum
            </span>
            <span className="hidden items-center gap-1 rounded-full bg-signal-info/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-signal-info sm:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-info" />
              LIVE
            </span>
          </div>
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-dim">
            SCADA Monitoring · Demo
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Alarm counter */}
        <div className="hidden items-center gap-2 font-mono text-[11px] md:flex">
          <span className="flex items-center gap-1 text-signal-bad">
            <span className="h-2 w-2 rounded-full bg-signal-bad" />
            {kritikSayi.toString().padStart(2, '0')} KRİT
          </span>
          <span className="flex items-center gap-1 text-signal-warn">
            <span className="h-2 w-2 rounded-full bg-signal-warn" />
            {uyariSayi.toString().padStart(2, '0')} UYAR
          </span>
        </div>

        {/* Clock */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-elevated px-3 py-1.5 font-mono">
          <Zap size={12} className="text-signal-info" />
          <span className="text-xs font-semibold text-ink tabular-nums">
            {s.time.toLocaleTimeString('tr-TR', { hour12: false })}
          </span>
          <span className="hidden text-[10px] text-ink-dim sm:inline">
            {s.time.toLocaleDateString('tr-TR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Heart-beat + tema */}
        <div className="hidden items-center gap-2 sm:flex">
          <HeartPulse size={14} className="text-signal-ok" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
