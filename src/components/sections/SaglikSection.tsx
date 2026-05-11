import { motion } from 'framer-motion';
import { Activity, HeartPulse, Hospital, ShieldCheck, Zap } from 'lucide-react';
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '@/components/ui/ChartCard';
import { KpiCard } from '@/components/ui/KpiCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  gssOzet,
  kronikKalemler,
  provizyonGunluk,
  provizyonOzet,
  saglikDagilim,
} from '@/data/mockData';
import { cn } from '@/lib/cn';
import { fmtCompact, fmtNum, fmtPct } from '@/lib/format';

export function SaglikSection() {
  const toplamSaglik = useMemo(
    () => saglikDagilim.reduce((s, r) => s + r.tutar, 0),
    [],
  );

  const provizyonDegisim =
    ((provizyonOzet.bugun - provizyonOzet.dun) / provizyonOzet.dun) * 100;

  return (
    <section className="space-y-5">
      <SectionHeader
        index={3}
        baslik="Sağlık & Provizyon"
        altBaslik="Giderlerin en dinamik ve suistimale en açık alanı — kurum, kalem ve gün bazlı izleme"
        icon={HeartPulse}
        accent="from-rose-500 to-amber-500"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          baslik="Aylık Sağlık Harcaması"
          altBaslik="Nisan 2026 toplamı"
          deger={toplamSaglik * 1_000_000_000}
          format={(n) => `${(n / 1_000_000_000).toFixed(1)} mlr ₺`}
          yoy={11.4}
          hedef={{ etiket: 'Geçen yıl aynı ay', deger: '46.8 mlr ₺' }}
          spark={[41, 43, 44, 45, 46, 47, 48, 51, 49, 47, 50, 52]}
          level="warn"
          icon={Hospital}
          inverse
          delay={0}
        />
        <KpiCard
          baslik="Anlık Provizyon"
          altBaslik="Şu an üretilen tekil provizyon"
          deger={provizyonOzet.anlik}
          format={(n) => fmtNum(Math.round(n))}
          yoy={4.6}
          hedef={{ etiket: 'Bugün toplam', deger: fmtCompact(provizyonOzet.bugun) }}
          spark={provizyonGunluk.slice(-12).map((p) => p.sayi)}
          level="info"
          icon={Zap}
          delay={0.05}
        />
        <KpiCard
          baslik="Kronik Hastalık Payı"
          altBaslik="Yüksek maliyetli kalemler toplam içinde"
          deger={57.5}
          format={(n) => `%${n.toFixed(1)}`}
          yoy={2.4}
          hedef={{ etiket: 'Pay artış eşiği', deger: '%3' }}
          spark={[51, 52, 52, 53, 54, 54, 55, 55, 56, 56, 57, 57]}
          level="warn"
          icon={Activity}
          inverse
          delay={0.1}
        />
        <KpiCard
          baslik="GSS Kapsamı (60/c-1)"
          altBaslik="Primi devlet tarafından ödenen"
          deger={gssOzet.kapsam60c1}
          format={(n) => fmtCompact(n)}
          yoy={gssOzet.degisim}
          hedef={{ etiket: 'Gelir testindeki', deger: fmtCompact(gssOzet.gelirTesti) }}
          spark={[8812, 8780, 8740, 8690, 8650, 8620, 8580, 8540, 8510, 8480, 8450, 8426]}
          level="ok"
          icon={ShieldCheck}
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        {/* Donut: Kurumsal dağılım */}
        <ChartCard
          baslik="Kurumsal Harcama Dağılımı"
          altBaslik="Toplam giderin kurum tipine göre kırılımı"
          className="xl:col-span-2"
          delay={0.2}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={saglikDagilim}
                    dataKey="tutar"
                    nameKey="kurum"
                    innerRadius={62}
                    outerRadius={92}
                    paddingAngle={2}
                    stroke="rgba(10,14,26,0.6)"
                    strokeWidth={2}
                  >
                    {saglikDagilim.map((d, i) => (
                      <Cell key={i} fill={d.renk} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => `${v.toFixed(1)} mlr ₺`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase tracking-wider text-ink-dim">Toplam</span>
                <span className="font-display text-2xl font-bold text-ink">
                  {toplamSaglik.toFixed(1)}
                </span>
                <span className="text-[10px] font-mono text-ink-muted">mlr ₺</span>
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-1.5">
              {saglikDagilim.map((d) => (
                <div
                  key={d.kurum}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-ink/[0.04]"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ background: d.renk }}
                    />
                    <span className="text-xs text-ink">{d.kurum}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="font-mono text-ink-muted">{d.tutar.toFixed(1)} mlr</span>
                    <span className="w-10 text-right font-semibold text-ink">
                      {fmtPct(d.yuzde)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Provizyon 24 saatlik */}
        <ChartCard
          baslik="24 Saatlik Provizyon Akışı"
          altBaslik="Saat bazlı tekil provizyon sayısı (sistem canlılığı)"
          badge={
            <span className="pill pill-info">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-info" />{' '}
              Pik {provizyonOzet.pikSaat}
            </span>
          }
          className="xl:col-span-3"
          delay={0.25}
        >
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={provizyonGunluk} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="grdProv" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="saat"
                  tickLine={false}
                  axisLine={false}
                  interval={2}
                />
                <YAxis
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  tickLine={false}
                  axisLine={false}
                  width={42}
                />
                <Tooltip
                  formatter={(v: number) => fmtNum(v)}
                  cursor={{ stroke: 'rgba(6,182,212,0.4)' }}
                />
                <Area
                  type="monotone"
                  dataKey="sayi"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fill="url(#grdProv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg bg-ink/[0.04] p-3 ring-1 ring-inset ring-border">
              <div className="text-[10px] uppercase tracking-wider text-ink-dim">Bugün toplam</div>
              <div className="font-display text-lg font-bold text-ink">
                {fmtNum(provizyonOzet.bugun)}
              </div>
            </div>
            <div className="rounded-lg bg-ink/[0.04] p-3 ring-1 ring-inset ring-border">
              <div className="text-[10px] uppercase tracking-wider text-ink-dim">Dün toplam</div>
              <div className="font-display text-lg font-bold text-ink-muted">
                {fmtNum(provizyonOzet.dun)}
              </div>
            </div>
            <div className="rounded-lg bg-ink/[0.04] p-3 ring-1 ring-inset ring-border">
              <div className="text-[10px] uppercase tracking-wider text-ink-dim">Değişim</div>
              <div className="font-display text-lg font-bold text-signal-ok">
                +{provizyonDegisim.toFixed(1)}%
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        baslik="Yüksek Maliyetli Kronik Kalemler"
        altBaslik="Toplam bütçedeki pay (%) ve yıllık değişim (YoY)"
        delay={0.3}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {kronikKalemler.map((k, i) => (
            <motion.div
              key={k.ad}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.06 * i }}
              className="group relative overflow-hidden rounded-xl border border-border bg-bg-elevated p-4 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold text-ink">{k.ad}</div>
                  <div className="mt-0.5 text-[11px] text-ink-dim">
                    Aylık {k.tutar.toFixed(1)} mlr ₺
                  </div>
                </div>
                <span
                  className={cn(
                    'pill text-[10px]',
                    k.trend > 5 ? 'pill-bad' : k.trend > 2 ? 'pill-warn' : 'pill-ok',
                  )}
                >
                  YoY +{k.trend.toFixed(1)}%
                </span>
              </div>

              <div className="mt-3 flex items-end justify-between">
                <div className="font-display text-2xl font-bold text-ink">
                  %{k.pay.toFixed(1)}
                </div>
                <div className="text-[10px] text-ink-dim">toplam içinde</div>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(k.pay / 25) * 100}%` }}
                  transition={{ duration: 0.9, delay: 0.06 * i, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </ChartCard>
    </section>
  );
}
