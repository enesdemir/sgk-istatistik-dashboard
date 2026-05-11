import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CircleDollarSign,
  HeartPulse,
  MapPin,
  Radio,
  Scale,
  Users,
  Zap,
} from 'lucide-react';
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ReferenceLine,
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
  ilHarita,
  saglikDagilim,
  yeniEmekliSeri,
} from '@/data/mockData';
import { useLiveActivity, type LiveActivity, type Transaction } from '@/hooks/useLiveActivity';
import { useScadaData, type AlarmEvent, type ScadaState, type StreamPoint } from '@/hooks/useScadaData';
import { cn } from '@/lib/cn';
import { fmtCompact, fmtNum, fmtPct, fmtTL } from '@/lib/format';

/** ───────────────── Panel kabı — sade SGK üslubu ───────────────── */
function Panel({
  baslik,
  durum = 'ok',
  className,
  children,
  actions,
  altBaslik,
}: {
  baslik: string;
  altBaslik?: string;
  durum?: 'ok' | 'warn' | 'bad' | 'info';
  className?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        'relative flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-bg-surface shadow-card',
        durum === 'bad'
          ? 'border-signal-bad/25'
          : durum === 'warn'
            ? 'border-signal-warn/25'
            : 'border-border',
        className,
      )}
    >
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3.5 py-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <TrafficLight level={durum} size="sm" pulse={durum !== 'ok'} />
            <span className="truncate text-[12px] font-semibold text-ink">{baslik}</span>
          </div>
          {altBaslik && (
            <div className="truncate pl-[18px] text-[10px] text-ink-dim">{altBaslik}</div>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
      </header>
      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  );
}

/** ───────────────── Aktüeryal Fazla — ana headline kartı ───────────────── */
function HeadlineCard({ deger }: { deger: number }) {
  return (
    <Panel baslik="Aktüeryal Fazla" altBaslik="Yıl içi gelir-gider farkı" durum="ok">
      <div className="flex flex-1 flex-col justify-between gap-2 px-4 py-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-3xl font-black tabular-nums text-signal-ok">
              +<AnimatedNumber value={deger} duration={700} format={(n) => n.toFixed(1)} />
            </span>
            <span className="text-[11px] font-mono text-ink-dim">mlr ₺</span>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-signal-ok/15 px-2 py-0.5 text-[10px] font-semibold text-signal-ok">
            <ArrowUpRight size={11} strokeWidth={2.6} /> %18.4 YoY
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 overflow-hidden rounded-full bg-bg-elevated">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '109%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-1.5 rounded-full bg-gradient-to-r from-signal-ok to-signal-info"
              style={{ maxWidth: '100%' }}
            />
          </div>
          <span className="font-mono text-[10px] text-ink-muted">%109.6 karşılama</span>
        </div>
      </div>
    </Panel>
  );
}

/** ───────────────── Mini KPI ───────────────── */
function MiniKpi({
  baslik,
  deger,
  format,
  altMetin,
  yon = 'up',
  icon: Icon,
}: {
  baslik: string;
  deger: number;
  format: (n: number) => string;
  altMetin?: string;
  yon?: 'up' | 'down';
  icon: typeof CircleDollarSign;
}) {
  const TrendIcon = yon === 'up' ? ArrowUpRight : ArrowDownRight;
  const trendColor = yon === 'up' ? 'text-signal-ok' : 'text-signal-bad';
  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-border bg-bg-surface px-3 py-2.5 shadow-card">
      <div className="flex items-center justify-between text-ink-dim">
        <Icon size={13} strokeWidth={2.1} />
        <TrendIcon size={12} strokeWidth={2.4} className={trendColor} />
      </div>
      <div className="mt-1">
        <div className="font-display text-xl font-bold tabular-nums text-ink">
          <AnimatedNumber value={deger} duration={650} format={format} />
        </div>
        <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-ink-dim">
          {baslik}
        </div>
        {altMetin && <div className="mt-0.5 truncate text-[10px] text-ink-muted">{altMetin}</div>}
      </div>
    </div>
  );
}

/** ───────────────── Provizyon canlı sayaç ───────────────── */
function ProvCounter({ anlik, bugun }: { anlik: number; bugun: number }) {
  return (
    <div className="grid h-full grid-rows-[1fr_auto] gap-2 px-3 py-2.5">
      <div className="flex flex-col items-start justify-center">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-3xl font-black tabular-nums text-ink">
            <AnimatedNumber value={anlik} duration={500} format={(n) => fmtNum(Math.round(n))} />
          </span>
          <span className="text-[10px] font-mono uppercase text-ink-dim">anlık</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-signal-info">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-info opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-info" />
          </span>
          Sağlık provizyon akışı
        </div>
      </div>
      <div className="flex items-center justify-between rounded-md bg-bg-elevated px-2 py-1.5 text-[10px]">
        <span className="text-ink-dim">Bugün toplam</span>
        <span className="font-mono font-semibold text-ink tabular-nums">
          <AnimatedNumber value={bugun} duration={400} format={fmtNum} />
        </span>
      </div>
    </div>
  );
}

/** ───────────────── Aktif/Pasif mini gauge ───────────────── */
function AktifPasifGauge({ deger }: { deger: number }) {
  const sapma = ((deger - aktifPasifHedef.hedef) / aktifPasifHedef.hedef) * 100;
  return (
    <div className="flex h-full items-center gap-3 px-3 py-2.5">
      <div className="flex flex-col">
        <span className="font-display text-3xl font-black tabular-nums text-ink">
          <AnimatedNumber value={deger} duration={700} format={(n) => n.toFixed(2)} />
        </span>
        <span className="text-[9px] font-mono uppercase tracking-wider text-ink-dim">
          aktif / pasif
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="relative h-2 overflow-hidden rounded-full bg-bg-elevated ring-1 ring-inset ring-border">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (deger / 3.0) * 100)}%` }}
            transition={{ duration: 0.6 }}
            className="h-full rounded-full bg-gradient-to-r from-signal-bad via-signal-warn to-signal-ok"
          />
          <div
            className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-ink/70"
            style={{ left: `${(aktifPasifHedef.hedef / 3.0) * 100}%` }}
            title="Hedef 2.00"
          />
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-mono text-ink-dim">hedef 2.00</span>
          <span className="rounded-full bg-signal-ok/15 px-1.5 py-0.5 text-[9px] font-semibold text-signal-ok">
            +{sapma.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

/** ───────────────── Gelir vs Gider stream ───────────────── */
function StreamChart({ data }: { data: StreamPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="strmGelir" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="strmGider" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgb(var(--ink) / 0.06)" strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="t" hide />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={26}
          tick={{ fontSize: 9 }}
          tickFormatter={(v) => `${Math.round(v)}`}
          domain={['dataMin - 6', 'dataMax + 6']}
        />
        <Tooltip
          isAnimationActive={false}
          labelFormatter={(t) => new Date(t as number).toLocaleTimeString('tr-TR')}
          formatter={(v: number, n) => [`${v.toFixed(1)} mlr ₺`, n]}
        />
        <ReferenceLine
          y={data[data.length - 1]?.gider ?? 240}
          stroke="rgb(var(--ink) / 0.16)"
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
  );
}

/** ───────────────── Yeni Sigortalı vs Yeni Emekli ───────────────── */
function EmeklilikTrend() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={yeniEmekliSeri} margin={{ top: 8, right: 6, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="emkSig" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="emkEm" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgb(var(--ink) / 0.06)" strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="ay" tickLine={false} axisLine={false} tick={{ fontSize: 9 }} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={32}
          tick={{ fontSize: 9 }}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
        />
        <Tooltip formatter={(v: number, n) => [fmtNum(v), n]} />
        <Area
          type="monotone"
          dataKey="yeniSigortali"
          name="Yeni Sigortalı"
          stroke="#06b6d4"
          strokeWidth={2}
          fill="url(#emkSig)"
        />
        <Area
          type="monotone"
          dataKey="yeniEmekli"
          name="Yeni Emekli"
          stroke="#a855f7"
          strokeWidth={2}
          fill="url(#emkEm)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** ───────────────── Kurumsal Sağlık Donut ───────────────── */
function SaglikDonut() {
  const toplam = useMemo(() => saglikDagilim.reduce((s, r) => s + r.tutar, 0), []);
  return (
    <div className="relative grid h-full grid-cols-[1.1fr_1fr] items-center gap-2 px-3 py-2">
      <div className="relative h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={saglikDagilim}
              dataKey="tutar"
              nameKey="kurum"
              innerRadius="58%"
              outerRadius="90%"
              paddingAngle={2}
              stroke="rgb(var(--bg-surface))"
              strokeWidth={2}
            >
              {saglikDagilim.map((d, i) => (
                <Cell key={i} fill={d.renk} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => `${v.toFixed(1)} mlr ₺`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-base font-bold text-ink tabular-nums">
            {toplam.toFixed(1)}
          </span>
          <span className="text-[8px] font-mono uppercase tracking-wider text-ink-dim">
            mlr ₺/ay
          </span>
        </div>
      </div>
      <ul className="flex flex-col gap-0.5">
        {saglikDagilim.map((d) => (
          <li key={d.kurum} className="flex items-center justify-between gap-1 text-[10px]">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="h-2 w-2 shrink-0 rounded-sm"
                style={{ background: d.renk }}
              />
              <span className="truncate text-ink">{d.kurum}</span>
            </div>
            <span className="font-mono font-semibold text-ink-muted">
              {fmtPct(d.yuzde)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** ───────────────── Anlık İşlem Akışı — saniye altı yeni satır ───────────────── */
const TX_BADGE: Record<Transaction['tip'], string> = {
  Provizyon: 'bg-signal-info/15 text-signal-info',
  Prim: 'bg-signal-ok/15 text-signal-ok',
  Tahsilat: 'bg-signal-ok/15 text-signal-ok',
  Yapılandırma: 'bg-signal-warn/15 text-signal-warn',
  Denetim: 'bg-signal-bad/15 text-signal-bad',
};

function IslemAkisi({ transactions }: { transactions: Transaction[] }) {
  return (
    <ul className="flex h-full min-h-0 flex-col gap-1 overflow-hidden px-2 py-2 text-[11px]">
      <AnimatePresence initial={false}>
        {transactions.slice(0, 9).map((tx) => (
          <motion.li
            key={tx.id}
            initial={{ opacity: 0, x: -10, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, x: 0, height: 'auto', marginTop: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-2 overflow-hidden rounded-md border border-border bg-bg-elevated px-2 py-1.5"
          >
            <MapPin
              size={11}
              strokeWidth={2.2}
              className={cn(
                tx.level === 'bad'
                  ? 'text-signal-bad'
                  : tx.level === 'warn'
                    ? 'text-signal-warn'
                    : tx.level === 'ok'
                      ? 'text-signal-ok'
                      : 'text-signal-info',
              )}
            />
            <span className="truncate text-ink">{tx.il}</span>
            <span
              className={cn(
                'rounded-sm px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider',
                TX_BADGE[tx.tip],
              )}
            >
              {tx.tip}
            </span>
            <span className="font-mono text-[10px] font-semibold tabular-nums text-ink-muted">
              {tx.tutar > 0 ? fmtTL(tx.tutar) : '—'}
            </span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

/** ───────────────── Olay Akışı (alarm log, SGK üslubu) ───────────────── */
function OlayAkisi({ alarms }: { alarms: AlarmEvent[] }) {
  return (
    <ul className="flex h-full min-h-0 flex-col gap-1 overflow-y-auto px-3 py-2 text-[11px]">
      {alarms.map((a) => (
        <motion.li
          key={a.id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-md border border-border bg-bg-elevated/60 px-2 py-1.5"
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
          <span className="shrink-0 font-mono text-[9px] text-ink-dim">
            {a.time.toLocaleTimeString('tr-TR', { hour12: false })}
          </span>
        </motion.li>
      ))}
    </ul>
  );
}

/** ─────────────────  Ana ───────────────── */
export function ScadaView() {
  const s = useScadaData();
  const a = useLiveActivity();
  return (
    <>
      <ScadaHeaderInternal s={s} a={a} />
      <ScadaDashboard s={s} a={a} />
    </>
  );
}

function ScadaDashboard({ s, a }: { s: ScadaState; a: LiveActivity }) {
  const gelirGiderOrani = (s.gelirRate / s.giderRate) * 100;

  return (
    <div
      className="grid w-full gap-3 font-sans"
      style={{
        height: 'calc(100vh - 5.5rem)',
        gridTemplateRows: '1.3fr 1fr',
      }}
    >
      {/* ───── ÜST: Harita + KPI strip ───── */}
      <div className="grid min-h-0 gap-3 lg:grid-cols-[1.7fr_1fr]">
        {/* Türkiye haritası — geniş + radar pulse'lar */}
        <Panel
          baslik="Türkiye Anlık İşlem Haritası"
          altBaslik={`${a.pulses.length} aktif sinyal · radar mod`}
          durum="info"
          actions={
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-signal-info">
              <Radio size={10} className="animate-pulse" />
              SİNYAL
            </span>
          }
        >
          <div className="min-h-0 flex-1 p-2">
            <TurkeyHeatmap veri={ilHarita} metric="yogunluk" pulses={a.pulses} />
          </div>
        </Panel>

        {/* Sağ KPI kolonu */}
        <div className="grid min-h-0 gap-3" style={{ gridTemplateRows: 'auto 1fr auto' }}>
          {/* Headline */}
          <HeadlineCard deger={s.aktuaryalDenge} />

          {/* 4'lü mini KPI grid */}
          <div className="grid min-h-0 grid-cols-2 grid-rows-2 gap-2">
            <MiniKpi
              baslik="Gelir / Gider"
              deger={gelirGiderOrani}
              format={(n) => `%${n.toFixed(1)}`}
              altMetin="hedef ≥ %100"
              yon="up"
              icon={Scale}
            />
            <MiniKpi
              baslik="Aktif / Pasif"
              deger={s.aktifPasif}
              format={(n) => n.toFixed(2)}
              altMetin="hedef 2.00"
              yon="up"
              icon={Users}
            />
            <MiniKpi
              baslik="Prim Tahsilatı"
              deger={s.tahsilatPct}
              format={(n) => `%${n.toFixed(1)}`}
              altMetin="hedef %92"
              yon="up"
              icon={CircleDollarSign}
            />
            <MiniKpi
              baslik="Yapılandırma"
              deger={94.0}
              format={(n) => `%${n.toFixed(1)}`}
              altMetin="158.2 / 168.4 mlr ₺"
              yon="up"
              icon={Banknote}
            />
          </div>

          {/* Aktif/Pasif gauge + provizyon sayaç */}
          <div className="grid grid-cols-2 gap-3">
            <Panel baslik="Aktif/Pasif Oranı" durum="ok">
              <AktifPasifGauge deger={s.aktifPasif} />
            </Panel>
            <Panel baslik="Provizyon · Canlı" durum="info">
              <ProvCounter anlik={s.provizyonAnlik} bugun={s.provizyonBugun} />
            </Panel>
          </div>
        </div>
      </div>

      {/* ───── ALT: 5 canlı analiz paneli — İşlem Akışı dahil ───── */}
      <div className="grid min-h-0 gap-3 lg:grid-cols-[1.15fr_1fr_0.95fr_0.9fr_0.9fr]">
        <Panel
          baslik="Gelir vs Gider · Canlı Akış"
          altBaslik="mlr ₺ — son 60 tick"
          durum="ok"
          actions={
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-signal-info">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-info" />
              LIVE
            </span>
          }
        >
          <div className="min-h-0 flex-1 px-1 pb-1">
            <StreamChart data={s.series} />
          </div>
        </Panel>

        <Panel
          baslik="Anlık İşlem Akışı"
          altBaslik={`${fmtNum(a.tps)} işlem/sn · gerçek zamanlı`}
          durum="info"
          actions={
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-signal-info">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-info opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-info" />
              </span>
              CANLI
            </span>
          }
        >
          <IslemAkisi transactions={a.transactions} />
        </Panel>

        <Panel
          baslik="Yeni Sigortalı vs Yeni Emekli"
          altBaslik="12 aylık demografik akış"
          durum="info"
        >
          <div className="min-h-0 flex-1 px-1 pb-1">
            <EmeklilikTrend />
          </div>
        </Panel>

        <Panel
          baslik="Sağlık · Kurumsal Dağılım"
          altBaslik={`Aylık ${saglikDagilim.reduce((a, b) => a + b.tutar, 0).toFixed(1)} mlr ₺`}
          durum="warn"
        >
          <SaglikDonut />
        </Panel>

        <Panel
          baslik="Olay Akışı"
          altBaslik="Sistem & alarm günlüğü"
          durum="warn"
          actions={
            <span className="font-mono text-[9px] text-ink-dim">{s.alarms.length}</span>
          }
        >
          <OlayAkisi alarms={s.alarms} />
        </Panel>
      </div>
    </div>
  );
}

/** ───────────────── Üst kompakt başlık çubuğu ───────────────── */
function ScadaHeaderInternal({ s, a }: { s: ScadaState; a: LiveActivity }) {
  const kritikSayi = s.alarms.filter((al) => al.level === 'bad').length;
  const uyariSayi = s.alarms.filter((al) => al.level === 'warn').length;

  return (
    <header className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-border bg-bg-subtle px-4 py-2.5 shadow-card">
      <div className="flex items-center gap-3 min-w-0">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-signal-info text-white shadow-glow">
          <Activity size={20} strokeWidth={2.4} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-bold leading-none tracking-tight text-ink">
              Sosyal Güvenlik Kurumu · <span className="text-signal-info">Genel Durum</span>
            </span>
            <span className="hidden items-center gap-1 rounded-full bg-signal-info/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-signal-info sm:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-info" />
              CANLI
            </span>
          </div>
          <div className="mt-0.5 text-[10px] text-ink-dim">
            Aktif {fmtCompact(24_138_402)} · Pasif {fmtCompact(11_072_663)} · Aktüeryal
            <span className="ml-1 font-mono font-semibold text-signal-ok">
              +{s.aktuaryalDenge.toFixed(1)} mlr ₺
            </span>
          </div>
        </div>
      </div>

      {/* Orta: TPS — büyük rakam, sürekli oynar */}
      <div className="hidden items-center gap-4 md:flex">
        <TpsTicker tps={a.tps} totalToday={a.totalToday} />
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 font-mono text-[11px] lg:flex">
          <span className="flex items-center gap-1.5 rounded-full bg-signal-bad/10 px-2 py-1 text-signal-bad">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-bad" />
            {kritikSayi.toString().padStart(2, '0')} kritik
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-signal-warn/10 px-2 py-1 text-signal-warn">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-warn" />
            {uyariSayi.toString().padStart(2, '0')} uyarı
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-bg-elevated px-3 py-1.5 font-mono">
          <Zap size={12} className="text-signal-info" />
          <span className="text-xs font-semibold tabular-nums text-ink">
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

        <div className="hidden items-center gap-2 sm:flex">
          <HeartPulse size={14} className="animate-pulse text-signal-ok" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

/** Header ortasında büyük TPS sayacı + bugün toplamı */
function TpsTicker({ tps, totalToday }: { tps: number; totalToday: number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-signal-info/30 bg-signal-info/[0.06] px-3 py-1.5">
      <Radio size={14} className="animate-pulse text-signal-info" />
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-xl font-black tabular-nums text-signal-info">
          <AnimatedNumber value={tps} duration={250} format={fmtNum} />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-dim">
          işlem/sn
        </span>
      </div>
      <div className="hidden border-l border-border pl-3 lg:block">
        <div className="text-[9px] uppercase tracking-wider text-ink-dim">Bugün</div>
        <div className="font-mono text-xs font-semibold tabular-nums text-ink">
          <AnimatedNumber value={totalToday} duration={300} format={fmtNum} />
        </div>
      </div>
    </div>
  );
}
