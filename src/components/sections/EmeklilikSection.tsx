import { motion } from 'framer-motion';
import { Clock, TrendingUp, UserPlus, Users, UsersRound } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '@/components/ui/ChartCard';
import { KpiCard } from '@/components/ui/KpiCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TrafficLight } from '@/components/ui/TrafficLight';
import { dosyaBaglamaIller, istisnaiBasvurular, yeniEmekliSeri } from '@/data/mockData';
import { cn } from '@/lib/cn';
import { fmtCompact, fmtNum, fmtPct } from '@/lib/format';

const HEDEF_GUN = 30;

export function EmeklilikSection() {
  const ortBaglama =
    dosyaBaglamaIller.reduce((s, i) => s + i.ortGun, 0) / dosyaBaglamaIller.length;
  const sonAy = yeniEmekliSeri[yeniEmekliSeri.length - 1];
  const oncekiYilAyniAy = yeniEmekliSeri[0];

  const yeniSigortaliYoY = ((sonAy.yeniSigortali - oncekiYilAyniAy.yeniSigortali) / oncekiYilAyniAy.yeniSigortali) * 100;
  const yeniEmekliYoY = ((sonAy.yeniEmekli - oncekiYilAyniAy.yeniEmekli) / oncekiYilAyniAy.yeniEmekli) * 100;

  const maxBaglama = Math.max(...dosyaBaglamaIller.map((i) => i.ortGun));

  return (
    <section className="space-y-5">
      <SectionHeader
        index={2}
        baslik="Emeklilik & Sigortalı"
        altBaslik="Hizmet kalitesi ve demografik yük göstergeleri — dilekçeden bağlanmaya, EYT etkilerine kadar"
        icon={UsersRound}
        accent="from-indigo-500 to-brand-500"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          baslik="Ortalama Dosya Bağlama"
          altBaslik="Dilekçeden maaş bağlanmasına kadar"
          deger={ortBaglama}
          format={(n) => `${n.toFixed(0)} gün`}
          yoy={8.2}
          hedef={{ etiket: 'Hedef', deger: `≤ ${HEDEF_GUN} gün` }}
          spark={[32, 33, 34, 33, 35, 34, 36, 36, 35, 35, 34, 34]}
          level={ortBaglama > HEDEF_GUN ? 'warn' : 'ok'}
          icon={Clock}
          inverse
          delay={0}
        />
        <KpiCard
          baslik="Aylık Yeni Sigortalı"
          altBaslik="Sisteme giriş — son ay"
          deger={sonAy.yeniSigortali}
          format={(n) => fmtCompact(n)}
          yoy={yeniSigortaliYoY}
          hedef={{ etiket: 'YoY referans', deger: fmtCompact(oncekiYilAyniAy.yeniSigortali) }}
          spark={yeniEmekliSeri.map((r) => r.yeniSigortali)}
          level="info"
          icon={UserPlus}
          delay={0.05}
        />
        <KpiCard
          baslik="Aylık Yeni Emekli"
          altBaslik="Sistemden çıkış — son ay"
          deger={sonAy.yeniEmekli}
          format={(n) => fmtCompact(n)}
          yoy={yeniEmekliYoY}
          hedef={{ etiket: 'YoY referans', deger: fmtCompact(oncekiYilAyniAy.yeniEmekli) }}
          spark={yeniEmekliSeri.map((r) => r.yeniEmekli)}
          level="warn"
          icon={Users}
          inverse
          delay={0.1}
        />
        <KpiCard
          baslik="EYT Başvurusu (ay)"
          altBaslik="Aktif olarak süren EYT akışı"
          deger={sonAy.eyt}
          format={(n) => fmtCompact(n)}
          yoy={3.1}
          hedef={{ etiket: 'Pik (Oca 26)', deger: fmtCompact(56_200) }}
          spark={yeniEmekliSeri.map((r) => r.eyt)}
          level="info"
          icon={TrendingUp}
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <ChartCard
          baslik="Yeni Sigortalı vs Yeni Emekli"
          altBaslik="12 aylık akış — sistemin demografik momentumu"
          badge={
            <span className="pill pill-info">
              Net akış{' '}
              <span className="font-mono">{fmtCompact(sonAy.yeniSigortali - sonAy.yeniEmekli)}</span>
            </span>
          }
          className="xl:col-span-2"
          delay={0.2}
        >
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yeniEmekliSeri} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="grdSig" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="grdEm" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="grdEyt" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.06)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="ay" tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  tickLine={false}
                  axisLine={false}
                  width={42}
                />
                <Tooltip
                  formatter={(v: number, name) => [fmtNum(v), name]}
                  cursor={{ stroke: 'rgba(91,139,255,0.3)' }}
                />
                <Legend iconType="circle" iconSize={8} />
                <Area
                  type="monotone"
                  dataKey="yeniSigortali"
                  name="Yeni Sigortalı"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fill="url(#grdSig)"
                />
                <Area
                  type="monotone"
                  dataKey="yeniEmekli"
                  name="Yeni Emekli"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  fill="url(#grdEm)"
                />
                <Area
                  type="monotone"
                  dataKey="eyt"
                  name="EYT içinden"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  fill="url(#grdEyt)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          baslik="İstisnai Durum Payı"
          altBaslik="Olağandışı başvuruların toplam içindeki oranı"
          badge={<TrafficLight level="warn" label="Artıyor" />}
          delay={0.25}
        >
          <div className="flex flex-col items-center gap-4 py-2">
            {/* Donut-like radial */}
            <div className="relative">
              <svg width={160} height={160} viewBox="0 0 160 160" className="-rotate-90">
                <circle cx="80" cy="80" r="64" stroke="rgba(148,163,184,0.12)" strokeWidth="14" fill="none" />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="64"
                  stroke="url(#istisnaGrd)"
                  strokeWidth="14"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 64}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 64 - (istisnaiBasvurular.oran / 100) * (2 * Math.PI * 64) * 4,
                  }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="istisnaGrd" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
                <span className="font-display text-3xl font-bold text-ink">
                  %{istisnaiBasvurular.oran.toFixed(1)}
                </span>
                <span className="text-[10px] uppercase tracking-[0.15em] text-ink-dim">
                  toplam içinde
                </span>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-ink/[0.04] p-2 ring-1 ring-inset ring-border">
                <div className="text-[10px] uppercase tracking-wider text-ink-dim">Bu ay</div>
                <div className="font-display text-base font-semibold text-ink">
                  {fmtNum(istisnaiBasvurular.toplam)}
                </div>
              </div>
              <div className="rounded-lg bg-ink/[0.04] p-2 ring-1 ring-inset ring-border">
                <div className="text-[10px] uppercase tracking-wider text-ink-dim">Önceki ay</div>
                <div className="font-display text-base font-semibold text-ink-muted">
                  {fmtNum(istisnaiBasvurular.oncekiAy)}
                </div>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        baslik="İllere Göre Dosya Bağlama Süresi"
        altBaslik={`Hedef: ${HEDEF_GUN} gün altı — performans göstergesi (büyük illerden seçki)`}
        delay={0.3}
      >
        <div className="space-y-2.5">
          {dosyaBaglamaIller.map((il, i) => {
            const hedefAsim = il.ortGun - HEDEF_GUN;
            const pct = (il.ortGun / maxBaglama) * 100;
            const level: 'ok' | 'warn' | 'bad' =
              il.ortGun <= HEDEF_GUN ? 'ok' : il.ortGun <= HEDEF_GUN + 5 ? 'warn' : 'bad';
            const fillColor =
              level === 'ok' ? 'bg-signal-ok' : level === 'warn' ? 'bg-signal-warn' : 'bg-signal-bad';
            return (
              <motion.div
                key={il.il}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.05 * i }}
                className="grid grid-cols-[120px_1fr_auto] items-center gap-3"
              >
                <div className="flex items-center gap-2">
                  <TrafficLight level={level} size="sm" pulse={false} />
                  <span className="text-sm font-medium text-ink">{il.il}</span>
                </div>
                <div className="relative h-7 overflow-hidden rounded-md bg-bg-elevated ring-1 ring-inset ring-border">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, delay: 0.05 * i, ease: 'easeOut' }}
                    className={cn('h-full rounded-md', fillColor)}
                    style={{ opacity: 0.6 }}
                  />
                  <div
                    className="absolute top-0 h-full w-0.5 bg-ink/40"
                    style={{ left: `${(HEDEF_GUN / maxBaglama) * 100}%` }}
                    title={`Hedef: ${HEDEF_GUN} gün`}
                  />
                  <div className="absolute inset-0 flex items-center justify-end pr-2 text-[11px] font-mono text-ink">
                    {il.ortGun} gün
                  </div>
                </div>
                <span
                  className={cn(
                    'pill text-[10px]',
                    hedefAsim <= 0
                      ? 'pill-ok'
                      : hedefAsim <= 5
                        ? 'pill-warn'
                        : 'pill-bad',
                  )}
                >
                  {hedefAsim > 0 ? `+${hedefAsim} gün` : 'Hedefte'}
                </span>
              </motion.div>
            );
          })}
        </div>
      </ChartCard>
    </section>
  );
}
