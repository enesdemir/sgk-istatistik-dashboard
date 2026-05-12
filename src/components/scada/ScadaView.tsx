import { motion } from 'framer-motion';
import {
  Activity,
  ArrowUpRight,
  Banknote,
  Building2,
  CircleDollarSign,
  FileText,
  Gavel,
  HeartPulse,
  Hospital,
  Pill,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TurkeyHeatmap } from '@/components/charts/TurkeyHeatmap';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { TrafficLight } from '@/components/ui/TrafficLight';
import {
  denetimSeri,
  ilHarita,
  kronikKalemler,
  ozet,
  saglikDagilim,
  sayiPanelleri,
  yerliIthal,
} from '@/data/mockData';
import { useScadaData, type AlarmEvent, type ScadaState, type StreamPoint } from '@/hooks/useScadaData';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/cn';
import { fmtCompact, fmtNum, fmtTLCompact } from '@/lib/format';
import type { SayiPaneliData } from '@/types';

type SignalLevel = 'ok' | 'warn' | 'bad' | 'info';

/** Panel kabı — SGK üslubu */
function Panel({
  baslik,
  durum = 'ok',
  className,
  children,
  actions,
  altBaslik,
  icon: Icon,
}: {
  baslik?: string;
  altBaslik?: string;
  durum?: SignalLevel;
  className?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  icon?: typeof CircleDollarSign;
}) {
  return (
    <section
      className={cn(
        'relative flex min-h-0 flex-col overflow-hidden rounded-xl border bg-bg-surface shadow-card',
        durum === 'bad'
          ? 'border-signal-bad/30'
          : durum === 'warn'
            ? 'border-signal-warn/30'
            : durum === 'info'
              ? 'border-signal-info/30'
              : 'border-border',
        className,
      )}
    >
      {baslik && (
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <TrafficLight level={durum} size="md" pulse={durum !== 'ok'} />
              {Icon && <Icon size={16} className="text-ink-muted" strokeWidth={2.2} />}
              <span className="truncate text-base font-semibold uppercase tracking-wider text-ink">
                {baslik}
              </span>
            </div>
            {altBaslik && (
              <div className="mt-0.5 truncate pl-[26px] text-xs text-ink-dim">{altBaslik}</div>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
        </header>
      )}
      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  );
}

/** ───── SayiPaneli — Günlük / Haftalık / Yıllık net rakamlar ───── */
const ICON_BY_ID: Record<string, typeof CircleDollarSign> = {
  'saglik-recete': Pill,
  'hastane-recete': Hospital,
  'emekli-sayisi': UserCheck,
  'aktif-sigortali': Users,
  'icra-dosya': Gavel,
  'butce-perf': Banknote,
};

function SayiPaneli({ data }: { data: SayiPaneliData }) {
  const Icon = ICON_BY_ID[data.id] ?? FileText;
  const fmt = (n: number) =>
    data.format === 'tl' ? fmtTLCompact(n) : fmtCompact(n);

  return (
    <Panel
      baslik={data.baslik}
      altBaslik={data.altBaslik}
      durum={data.durum}
      icon={Icon}
      actions={
        <ArrowUpRight size={16} strokeWidth={2.4} className="text-signal-ok" />
      }
    >
      <div className="grid h-full grid-cols-3 gap-2 p-2">
        {[
          { l: 'GÜNLÜK', v: data.gunluk },
          { l: 'HAFTALIK', v: data.haftalik },
          { l: 'YILLIK', v: data.yillik },
        ].map((c) => (
          <div
            key={c.l}
            className="flex flex-col justify-between rounded-lg border border-border bg-bg-elevated px-3 py-2.5"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-ink-dim">
              {c.l}
            </div>
            <div className="mt-2 font-display text-3xl font-black leading-none tracking-tight tabular-nums text-ink">
              {fmt(c.v)}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/** ───── Sağlık Harcamaları (3 grup + 6 kalem) ───── */
const SAGLIK_GRUP_RENK: Record<'Hastane' | 'Eczane' | 'Sağlık', string> = {
  Hastane: '#0066B3',
  Eczane: '#3395d3',
  Sağlık: '#057A55',
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
    <div className="flex h-full min-h-0 flex-col gap-2 px-2.5 py-2">
      <div className="grid shrink-0 grid-cols-3 gap-1.5">
        {(['Hastane', 'Eczane', 'Sağlık'] as const).map((g) => (
          <div key={g} className="rounded-md border border-border bg-bg-elevated px-2 py-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-dim">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: SAGLIK_GRUP_RENK[g] }}
              />
              {g}
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-display text-2xl font-black tabular-nums text-ink">
                {gruplar[g].toFixed(1)}
              </span>
              <span className="text-[10px] font-mono text-ink-dim">mlr ₺</span>
            </div>
          </div>
        ))}
      </div>
      <ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden">
        {saglikDagilim.map((d) => (
          <li
            key={d.kurum}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-2 text-sm"
          >
            <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: d.renk }} />
            <div className="min-w-0">
              <div className="truncate text-ink">{d.kurum}</div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-bg-elevated">
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
            <span className="shrink-0 font-mono text-base font-semibold tabular-nums text-ink">
              {d.tutar.toFixed(1)}
              <span className="ml-0.5 text-[10px] font-normal text-ink-dim">mlr</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** ───── Kronik Hastalık — yüzdesiz, sadece tutar ───── */
function KronikList() {
  const max = useMemo(() => Math.max(...kronikKalemler.map((k) => k.tutar)), []);
  return (
    <ul className="flex h-full min-h-0 flex-col gap-1.5 px-2.5 py-2 text-sm">
      {kronikKalemler.map((k) => (
        <li key={k.ad} className="grid grid-cols-[1fr_auto] items-center gap-2.5">
          <div className="min-w-0">
            <div className="truncate text-ink">{k.ad}</div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-bg-elevated">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300"
                style={{ width: `${(k.tutar / max) * 100}%`, opacity: 0.85 }}
              />
            </div>
          </div>
          <span className="font-mono text-lg font-bold tabular-nums text-ink">
            {k.tutar.toFixed(1)}
            <span className="ml-0.5 text-[10px] font-normal text-ink-dim">mlr ₺</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** ───── Yerli/İthal İlaç — mutlak rakam (yüzde değil) ───── */
function YerliIthalMini() {
  return (
    <div className="flex h-full flex-col gap-3 px-3 py-2.5">
      {yerliIthal.map((row) => {
        const total = row.yerli + row.ithal;
        const yerliWidth = (row.yerli / total) * 100;
        return (
          <div key={row.ad} className="text-sm">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-dim">
                {row.ad}
              </span>
              <span className="text-[11px] font-mono text-ink-dim">{row.birim}</span>
            </div>
            <div className="flex h-4 overflow-hidden rounded-md ring-1 ring-inset ring-border">
              <div
                className="bg-gradient-to-r from-brand-500 to-brand-400"
                style={{ width: `${yerliWidth}%` }}
              />
              <div
                className="bg-gradient-to-r from-signal-warn to-amber-400"
                style={{ width: `${100 - yerliWidth}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-base">
              <span className="font-mono font-bold tabular-nums text-brand-600">
                Yerli {row.yerli.toFixed(1)}
              </span>
              <span className="font-mono font-bold tabular-nums text-signal-warn">
                İthal {row.ithal.toFixed(1)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** ───── Denetim Performansı (iptal gün + tasarruf) ───── */
function DenetimMini() {
  const sonAy = denetimSeri[denetimSeri.length - 1];
  return (
    <div className="flex h-full flex-col gap-2 px-2.5 py-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-border bg-bg-elevated px-2.5 py-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-dim">
            İptal Gün
          </div>
          <div className="mt-0.5 font-display text-2xl font-black tabular-nums text-signal-info">
            {fmtCompact(sonAy.iptalGun)}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-bg-elevated px-2.5 py-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-dim">
            Tasarruf
          </div>
          <div className="mt-0.5 font-display text-2xl font-black tabular-nums text-signal-ok">
            {sonAy.tasarruf}{' '}
            <span className="text-[11px] font-normal text-ink-dim">mn ₺</span>
          </div>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={denetimSeri.slice(-12)} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <Line
              type="monotone"
              dataKey="tasarruf"
              stroke="#057A55"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="yersizOdeme"
              stroke="#C01C1C"
              strokeWidth={1.8}
              strokeDasharray="3 2"
              dot={false}
              isAnimationActive={false}
            />
            <Tooltip contentStyle={{ fontSize: 12 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** ───── Gelir vs Gider Stream (canlı) ───── */
function StreamMini({ data }: { data: StreamPoint[] }) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="ms-gelir" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0066B3" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#0066B3" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ms-gider" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#C01C1C" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#C01C1C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgb(var(--ink) / 0.06)" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="t" hide />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={24}
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) => `${Math.round(v)}`}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip
            isAnimationActive={false}
            labelFormatter={(t: any) => new Date(t as number).toLocaleTimeString('tr-TR')}
            formatter={(v: number, n) => [`${v.toFixed(1)} mlr ₺`, n]}
            contentStyle={{ fontSize: 12 }}
          />
          <Area
            type="monotone"
            dataKey="gider"
            stroke="#C01C1C"
            strokeWidth={1.8}
            fill="url(#ms-gider)"
            isAnimationActive={false}
            dot={false}
            name="Gider"
          />
          <Area
            type="monotone"
            dataKey="gelir"
            stroke="#0066B3"
            strokeWidth={2}
            fill="url(#ms-gelir)"
            isAnimationActive={false}
            dot={false}
            name="Gelir"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** ───── Olay Akışı ───── */
function OlayAkisiMini({ alarms }: { alarms: AlarmEvent[] }) {
  return (
    <ul className="flex h-full min-h-0 flex-col gap-1 overflow-hidden px-2 py-1.5 text-sm">
      {alarms.slice(0, 7).map((a) => (
        <motion.li
          key={a.id}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-md border border-border bg-bg-elevated px-2 py-1.5"
        >
          <span
            className={cn(
              'inline-flex h-2 w-2 shrink-0 rounded-full',
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
          <span className="shrink-0 font-mono text-[11px] text-ink-dim">
            {a.time.toLocaleTimeString('tr-TR', { hour12: false }).slice(0, 5)}
          </span>
        </motion.li>
      ))}
    </ul>
  );
}

/** ───── Ana View ───── */
export function ScadaView() {
  useTheme(); // light moda kilitler
  const s = useScadaData();
  return (
    <>
      <ScadaHeader s={s} />
      <ScadaDashboard s={s} />
    </>
  );
}

function ScadaDashboard({ s }: { s: ScadaState }) {
  return (
    <div
      className="grid w-full gap-2 font-sans"
      style={{
        height: 'calc(100vh - 7rem)',
        gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
        gridTemplateRows: '1.5fr 1fr',
      }}
    >
      {/* ═══ ÜST: SOL 3 SayiPaneli · HARİTA · SAĞ 3 SayiPaneli ═══ */}
      <div className="col-span-3 grid min-h-0 grid-rows-3 gap-2">
        <SayiPaneli data={sayiPanelleri[0]} />
        <SayiPaneli data={sayiPanelleri[1]} />
        <SayiPaneli data={sayiPanelleri[2]} />
      </div>

      <div className="col-span-6 min-h-0">
        <Panel
          baslik="Türkiye İl Bazlı Yoğunluk"
          altBaslik="saha denetimi ve harcama indeksi"
          durum="info"
          icon={Building2}
          actions={
            <span className="flex items-center gap-1.5 rounded-full bg-signal-info/15 px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider text-signal-info">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-info" />
              CANLI
            </span>
          }
        >
          <div className="min-h-0 flex-1 px-1 py-1">
            <TurkeyHeatmap veri={ilHarita} metric="yogunluk" />
          </div>
        </Panel>
      </div>

      <div className="col-span-3 grid min-h-0 grid-rows-3 gap-2">
        <SayiPaneli data={sayiPanelleri[3]} />
        <SayiPaneli data={sayiPanelleri[4]} />
        <SayiPaneli data={sayiPanelleri[5]} />
      </div>

      {/* ═══ ALT: 6 analiz paneli ═══ */}
      <Panel
        baslik="Sağlık Harcamaları"
        altBaslik={`Aylık ${saglikDagilim.reduce((a, b) => a + b.tutar, 0).toFixed(1)} mlr ₺ · Hastane / Eczane / Sağlık`}
        durum="warn"
        icon={HeartPulse}
        className="col-span-3"
      >
        <SaglikDagilimPanel />
      </Panel>

      <Panel
        baslik="Kronik & Yüksek Maliyetli"
        altBaslik="onkoloji, diyabet, kardiyo · aylık tutar"
        durum="warn"
        className="col-span-2"
      >
        <KronikList />
      </Panel>

      <Panel
        baslik="Yerli vs İthal İlaç"
        altBaslik="adet & maliyet"
        durum="info"
        icon={Pill}
        className="col-span-2"
      >
        <YerliIthalMini />
      </Panel>

      <Panel
        baslik="Denetim Performansı"
        altBaslik={`son ${denetimSeri[denetimSeri.length - 1].ay}`}
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
          <span className="flex items-center gap-1.5 rounded-full bg-signal-info/15 px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-signal-info">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-info" />
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
        altBaslik={`${s.alarms.length} kayıt`}
        durum="warn"
        className="col-span-1"
      >
        <OlayAkisiMini alarms={s.alarms} />
      </Panel>
    </div>
  );
}

/** ───── Header (yüzdesiz, light) ───── */
function ScadaHeader({ s }: { s: ScadaState }) {
  const kritikSayi = s.alarms.filter((al) => al.level === 'bad').length;
  const uyariSayi = s.alarms.filter((al) => al.level === 'warn').length;
  const aktifPasif = ozet.aktifSigortali / ozet.pasifSigortali;

  return (
    <header className="mb-3 flex items-center justify-between gap-4 rounded-xl border border-border bg-bg-subtle px-4 py-3 shadow-card">
      <div className="flex items-center gap-4 min-w-0">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
          <Activity size={26} strokeWidth={2.4} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold leading-none tracking-tight text-ink">
              SGK · <span className="text-brand-600">Genel Durum</span>
            </span>
            <span className="hidden items-center gap-1.5 rounded-full bg-signal-info/12 px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-[0.15em] text-signal-info sm:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-info" />
              CANLI
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink-dim">
            <span>
              Aktif{' '}
              <span className="font-mono text-base font-bold tabular-nums text-ink">
                {fmtCompact(ozet.aktifSigortali)}
              </span>
            </span>
            <span>
              Pasif{' '}
              <span className="font-mono text-base font-bold tabular-nums text-ink">
                {fmtCompact(ozet.pasifSigortali)}
              </span>
            </span>
            <span>
              Oran{' '}
              <span className="font-mono text-base font-bold tabular-nums text-ink">
                {aktifPasif.toFixed(2)}
              </span>
            </span>
            <span>
              Aktüeryal{' '}
              <span className="font-mono text-base font-bold tabular-nums text-signal-ok">
                +{s.aktuaryalDenge.toFixed(1)} mlr ₺
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 font-mono text-sm md:flex">
          <span className="flex items-center gap-1.5 rounded-full bg-signal-bad/10 px-2.5 py-1 font-semibold text-signal-bad">
            <span className="h-2 w-2 rounded-full bg-signal-bad" />
            {kritikSayi.toString().padStart(2, '0')} kritik
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-signal-warn/10 px-2.5 py-1 font-semibold text-signal-warn">
            <span className="h-2 w-2 rounded-full bg-signal-warn" />
            {uyariSayi.toString().padStart(2, '0')} uyarı
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-elevated px-3 py-2 font-mono">
          <Zap size={14} className="text-signal-info" />
          <span className="text-lg font-bold tabular-nums text-ink">
            {s.time.toLocaleTimeString('tr-TR', { hour12: false })}
          </span>
          <span className="hidden text-xs text-ink-dim sm:inline">
            {s.time.toLocaleDateString('tr-TR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </header>
  );
}
