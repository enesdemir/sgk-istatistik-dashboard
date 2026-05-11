import { motion } from 'framer-motion';
import {
  Banknote,
  CircleDollarSign,
  Coins,
  Scale,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '@/components/ui/ChartCard';
import { KpiCard } from '@/components/ui/KpiCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TrafficLight } from '@/components/ui/TrafficLight';
import {
  aktifPasifHedef,
  aylikGelirGider,
  ozet,
  yapilandirmaSeri,
} from '@/data/mockData';
import { fmtCompact, fmtPct, fmtTLCompact } from '@/lib/format';

export function GelirGiderSection() {
  const gelirGiderOrani = (ozet.toplamPrimGelir / ozet.toplamGider) * 100;
  const aktifPasif = aktifPasifHedef.guncel;
  const aktifPasifSapma = ((aktifPasif - aktifPasifHedef.hedef) / aktifPasifHedef.hedef) * 100;
  const yapTahsilOran =
    (ozet.yapilandirmaTahsilat / ozet.yapilandirmaBeklenen) * 100;

  const aktifPasifPct = (aktifPasif / aktifPasifHedef.hedef) * 100;

  return (
    <section className="space-y-5">
      <SectionHeader
        index={1}
        baslik="Gelir-Gider & Aktüeryal Denge"
        altBaslik="Sistemin mali sürdürülebilirliği — prim gelirlerinin emekli aylığı ve sağlık giderlerini karşılama düzeyi"
        icon={CircleDollarSign}
        accent="from-brand-500 to-signal-info"
      />

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          baslik="Gelir / Gider Oranı"
          altBaslik="Prim gelirinin gideri karşılama yüzdesi"
          deger={gelirGiderOrani}
          format={(n) => `%${n.toFixed(1)}`}
          yoy={4.6}
          hedef={{ etiket: 'Hedef', deger: '≥ %100' }}
          spark={[103.8, 104.4, 105.1, 106.0, 106.8, 107.6, 108.2, 109.1, 110.0, 110.6, 110.9, 111.4]}
          level="ok"
          icon={Scale}
          inverse={false}
          delay={0}
        />
        <KpiCard
          baslik="Aktüeryal Fazla"
          altBaslik="Bu yıl gelir - gider fazlası"
          deger={Math.abs(ozet.aktuaryalDenge)}
          format={(n) => `+${fmtTLCompact(n)}`}
          yoy={18.4}
          hedef={{ etiket: 'Geçen yıl', deger: '+196 mlr ₺' }}
          spark={[124, 138, 142, 156, 168, 174, 182, 192, 202, 214, 224, 232]}
          level="ok"
          icon={TrendingUp}
          delay={0.05}
        />
        <KpiCard
          baslik="Prim Tahsilat Oranı"
          altBaslik="Tahakkukun nakit gerçekleşmesi"
          deger={ozet.tahsilatOrani}
          format={(n) => `%${n.toFixed(1)}`}
          yoy={2.4}
          hedef={{ etiket: 'Hedef', deger: '%92' }}
          spark={[89.8, 90.2, 90.6, 90.9, 91.2, 91.5, 91.7, 91.9, 92.1, 92.3, 92.5, 92.6]}
          level="ok"
          icon={Coins}
          delay={0.1}
        />
        <KpiCard
          baslik="Yapılandırma Tahsilatı"
          altBaslik="Aktif yapılandırmalardan gelen nakit"
          deger={ozet.yapilandirmaTahsilat}
          format={(n) => fmtTLCompact(n)}
          yoy={11.2}
          hedef={{ etiket: 'Bu yıl beklenen', deger: fmtTLCompact(ozet.yapilandirmaBeklenen) }}
          spark={[12.0, 12.5, 12.9, 13.0, 13.3, 13.7, 13.9, 14.4, 14.5, 14.4, 14.7, 14.9]}
          level="ok"
          icon={Banknote}
          delay={0.15}
        />
      </div>

      {/* Ana 12 aylık seri + Aktif/Pasif gauge yan yana */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <ChartCard
          baslik="12 Aylık Gelir-Gider Akışı"
          altBaslik="Aylık prim geliri vs. emekli aylığı, sağlık ve diğer giderler (milyar ₺)"
          badge={
            <span className="pill pill-info">
              <span className="h-1.5 w-1.5 rounded-full bg-signal-info" /> YoY karşılaştırmalı
            </span>
          }
          className="xl:col-span-2"
          delay={0.2}
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={aylikGelirGider} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="grdPrim" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#3b6bf5" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#3b6bf5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.06)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="ay" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={48} />
                <Tooltip
                  cursor={{ fill: 'rgba(91,139,255,0.05)' }}
                  formatter={(v: number) => `${v.toFixed(1)} mlr ₺`}
                  labelStyle={{ color: '#94a3b8', fontSize: 11 }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 8 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar
                  dataKey="emekli"
                  name="Emekli aylığı"
                  stackId="g"
                  fill="#ef4444"
                  fillOpacity={0.78}
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="saglik"
                  name="Sağlık"
                  stackId="g"
                  fill="#f59e0b"
                  fillOpacity={0.78}
                />
                <Bar
                  dataKey="diger"
                  name="Diğer"
                  stackId="g"
                  fill="#94a3b8"
                  fillOpacity={0.6}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="prim"
                  name="Prim geliri"
                  stroke="#5b8bff"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#5b8bff', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
                <Area
                  type="monotone"
                  dataKey="prim"
                  fill="url(#grdPrim)"
                  stroke="none"
                  legendType="none"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Aktif/Pasif gauge */}
        <ChartCard
          baslik="Aktif / Pasif Sigortalı Oranı"
          altBaslik="Kaç çalışan bir emekliyi finanse ediyor"
          badge={<TrafficLight level="ok" pulse label="Sağlıklı" />}
          delay={0.25}
        >
          <div className="flex flex-col gap-5">
            {/* Big number */}
            <div className="relative pt-2">
              <div className="flex items-baseline justify-center gap-2">
                <span className="stat-num-xl gradient-text">{aktifPasif.toFixed(2)}</span>
                <span className="text-base font-medium text-ink-muted">çalışan / emekli</span>
              </div>
              <div className="mt-1 text-center text-xs text-ink-dim">
                Hedef değer{' '}
                <span className="font-mono text-ink">{aktifPasifHedef.hedef.toFixed(2)}</span> •
                Geçen yıl{' '}
                <span className="font-mono text-ink-muted">
                  {aktifPasifHedef.oncekiYil.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Gauge bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-ink-dim">
                <span>0.0</span>
                <span>Hedef 2.0</span>
                <span>3.0</span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-bg-elevated ring-1 ring-inset ring-border">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (aktifPasif / 3.0) * 100)}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-signal-bad via-signal-warn to-signal-ok"
                />
                <div
                  className="absolute top-1/2 h-5 w-0.5 -translate-y-1/2 bg-ink/70"
                  style={{ left: `${(aktifPasifHedef.hedef / 3.0) * 100}%` }}
                  title="Hedef"
                />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="pill pill-ok">
                  Hedef üzerinde +{fmtPct(aktifPasifSapma)}
                </span>
                <span className="text-ink-dim">
                  {fmtCompact(ozet.aktifSigortali)} aktif · {fmtCompact(ozet.pasifSigortali)} pasif
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-signal-ok/[0.07] p-3 ring-1 ring-inset ring-signal-ok/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-signal-ok">
                <Users size={13} /> Demografik güç sinyali
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">
                Aktif/pasif oranı hedef üzerinde seyrediyor; 2,18 ile geçen yılki 2,05'i de geçti.
                Genç sigortalı girişi sistemin aktüeryal fazlasını besliyor.
              </p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Yapılandırma */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <ChartCard
          baslik="Yapılandırma Nakit Akışı"
          altBaslik="Beklenen vs gerçekleşen tahsilat (milyar ₺)"
          badge={
            <span className="pill pill-warn">Boşluk %{(100 - yapTahsilOran).toFixed(1)}</span>
          }
          className="xl:col-span-2"
          delay={0.3}
        >
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yapilandirmaSeri} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="grdBek" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="grdTahsil" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.06)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="ay" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={36} />
                <Tooltip
                  formatter={(v: number) => `${v.toFixed(1)} mlr ₺`}
                  cursor={{ stroke: 'rgba(91,139,255,0.3)', strokeWidth: 1 }}
                />
                <Legend iconType="circle" iconSize={8} />
                <Area
                  type="monotone"
                  dataKey="beklenen"
                  name="Beklenen"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  fill="url(#grdBek)"
                />
                <Area
                  type="monotone"
                  dataKey="tahsil"
                  name="Gerçekleşen"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#grdTahsil)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Gelir-Gider diverging: gelir pozitif yönde, gider negatif yönde, net çizgi sıfır eksenine bağlı */}
        <ChartCard
          baslik="12 Aylık Gelir & Gider"
          altBaslik="Gelir pozitif, gider negatif eksende — net çizgi sıfırdan sapma (milyar ₺)"
          delay={0.35}
        >
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={aylikGelirGider.map((r) => {
                  const gider = r.emekli + r.saglik + r.diger;
                  return {
                    ay: r.ay,
                    gelir: r.prim,
                    gider: -gider,
                    net: r.prim - gider,
                  };
                })}
                margin={{ top: 8, right: 4, left: -8, bottom: 0 }}
              >
                <CartesianGrid stroke="rgba(148,163,184,0.06)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="ay" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  tickFormatter={(v: number) => `${Math.abs(v)}`}
                />
                <ReferenceLine y={0} stroke="rgb(var(--ink) / 0.35)" strokeWidth={1} />
                <Tooltip
                  cursor={{ fill: 'rgba(91,139,255,0.05)' }}
                  formatter={(v: number, name) => [`${Math.abs(v).toFixed(1)} mlr ₺`, name]}
                />
                <Legend iconType="circle" iconSize={8} />
                <Bar
                  dataKey="gelir"
                  name="Gelir"
                  fill="#10b981"
                  fillOpacity={0.85}
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="gider"
                  name="Gider"
                  fill="#ef4444"
                  fillOpacity={0.85}
                  radius={[0, 0, 3, 3]}
                />
                <Line
                  type="monotone"
                  dataKey="net"
                  name="Net"
                  stroke="#5b8bff"
                  strokeWidth={2.2}
                  dot={{ r: 2.8, fill: '#5b8bff', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-ink/[0.04] p-3 ring-1 ring-inset ring-border">
            <span className="text-xs text-ink-muted">Yıl başından bu yana net</span>
            <span className="font-display text-lg font-semibold text-signal-ok">
              +{fmtTLCompact(Math.abs(ozet.aktuaryalDenge))}
            </span>
          </div>
        </ChartCard>
      </div>

      <p className="px-1 text-[11px] text-ink-dim">
        <Wallet size={11} className="mr-1 inline -mt-0.5" />
        Prim tahakkukunun %92.6'sı nakit gerçekleşiyor, yapılandırma boşluğu yıllık {fmtPct(6.0)}'a indi. Aktif/Pasif {aktifPasifPct.toFixed(0)}% düzeyinde — hedef üzerinde.
      </p>
    </section>
  );
}
