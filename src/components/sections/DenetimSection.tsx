import { motion } from 'framer-motion';
import { Eye, Map, ShieldAlert, Skull, TrendingDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TurkeyHeatmap } from '@/components/charts/TurkeyHeatmap';
import { ChartCard } from '@/components/ui/ChartCard';
import { KpiCard } from '@/components/ui/KpiCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { denetimOzet, denetimSeri, ilHarita } from '@/data/mockData';
import { cn } from '@/lib/cn';
import { fmtCompact, fmtNum, fmtPct, fmtTLCompact } from '@/lib/format';

type Metric = 'yogunluk' | 'kayitDisi' | 'toplamHarcama';

const METRIC_LABEL: Record<Metric, { kisa: string; uzun: string }> = {
  yogunluk: { kisa: 'Denetim Yoğunluğu', uzun: 'Saha denetimi indeksi (0-100)' },
  kayitDisi: { kisa: 'Kayıt Dışı Oranı', uzun: 'Tahmini kayıt dışı istihdam (%)' },
  toplamHarcama: { kisa: 'Toplam Harcama', uzun: 'İl bazlı yıllık SGK gideri (mn ₺)' },
};

export function DenetimSection() {
  const [metric, setMetric] = useState<Metric>('kayitDisi');

  const sonAy = denetimSeri[denetimSeri.length - 1];
  const onceki = denetimSeri[0];
  const tasarrufYoY = ((sonAy.tasarruf - onceki.tasarruf) / onceki.tasarruf) * 100;
  const iptalGunYoY = ((sonAy.iptalGun - onceki.iptalGun) / onceki.iptalGun) * 100;

  const top5KayitDisi = useMemo(() => {
    return [...ilHarita].sort((a, b) => b.kayitDisi - a.kayitDisi).slice(0, 6);
  }, []);

  return (
    <section className="space-y-5">
      <SectionHeader
        index={5}
        baslik="Denetim & Risk Yönetimi"
        altBaslik="Sahte sigortalılık, kayıt dışı istihdam ve yersiz ödemelerin sistemden tasarrufu"
        icon={ShieldAlert}
        accent="from-orange-500 to-rose-500"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          baslik="Tasarruf (aylık)"
          altBaslik="Denetimler sonucu önlenen ödeme"
          deger={sonAy.tasarruf * 1_000_000}
          format={(n) => fmtTLCompact(n)}
          yoy={tasarrufYoY}
          hedef={{ etiket: 'YBD', deger: `${fmtCompact(denetimSeri.reduce((s, r) => s + r.tasarruf, 0))} mn ₺` }}
          spark={denetimSeri.map((r) => r.tasarruf)}
          level="ok"
          icon={Skull}
          delay={0}
        />
        <KpiCard
          baslik="İptal Edilen Prim Gün"
          altBaslik="Sahte sigortalılık tespiti"
          deger={sonAy.iptalGun}
          format={(n) => fmtCompact(n)}
          yoy={iptalGunYoY}
          hedef={{ etiket: 'Ortalama (12 ay)', deger: fmtCompact(denetimSeri.reduce((s, r) => s + r.iptalGun, 0) / 12) }}
          spark={denetimSeri.map((r) => r.iptalGun)}
          level="info"
          icon={Eye}
          delay={0.05}
        />
        <KpiCard
          baslik="Kayıt Dışı (tahmini)"
          altBaslik="Saha verisi ile harmanlanmış"
          deger={denetimOzet.kayitDisiOran}
          format={(n) => `%${n.toFixed(1)}`}
          yoy={
            ((denetimOzet.kayitDisiOran - denetimOzet.kayitDisiOranOnceki) /
              denetimOzet.kayitDisiOranOnceki) *
            100
          }
          hedef={{ etiket: 'Hedef', deger: '≤ %20' }}
          spark={[24.6, 24.4, 24.3, 24.1, 23.9, 23.7, 23.5, 23.4, 23.2, 23.0, 22.9, 22.8]}
          level="warn"
          icon={TrendingDown}
          inverse
          delay={0.1}
        />
        <KpiCard
          baslik="Takipteki Yersiz Ödeme"
          altBaslik="Geri alınması beklenen"
          deger={denetimOzet.takiptekiYersizOdeme}
          format={(n) => fmtTLCompact(n)}
          yoy={9.6}
          hedef={{ etiket: 'Geri alınan (yıl)', deger: fmtTLCompact(denetimOzet.geriAlinan) }}
          spark={[84, 92, 79, 76, 88, 96, 102, 118, 124, 108, 116, 132]}
          level="warn"
          icon={ShieldAlert}
          inverse
          delay={0.15}
        />
      </div>

      {/* Heatmap */}
      <ChartCard
        baslik="Türkiye İl Bazlı Isı Haritası"
        altBaslik={METRIC_LABEL[metric].uzun}
        badge={
          <span className="pill pill-info">
            <Map size={11} /> 81 il
          </span>
        }
        actions={
          <div className="inline-flex rounded-lg border border-border bg-bg-elevated p-0.5">
            {(['yogunluk', 'kayitDisi', 'toplamHarcama'] as Metric[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetric(m)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors',
                  metric === m
                    ? 'bg-brand-500/15 text-brand-200 ring-1 ring-inset ring-brand-500/30'
                    : 'text-ink-muted hover:text-ink',
                )}
              >
                {METRIC_LABEL[m].kisa}
              </button>
            ))}
          </div>
        }
        delay={0.2}
      >
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_280px]">
          <div className="rounded-xl border border-border bg-bg-elevated p-2">
            <TurkeyHeatmap veri={ilHarita} metric={metric} />
          </div>

          <div className="space-y-2">
            <div className="px-1 text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim">
              En riskli iller — kayıt dışı
            </div>
            {top5KayitDisi.map((il, i) => (
              <motion.div
                key={il.il}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
                className="flex items-center gap-3 rounded-lg border border-border bg-bg-elevated p-2.5 ring-1 ring-inset ring-ink/[0.04]"
              >
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-md font-mono text-[11px] font-semibold text-white"
                  style={{
                    background: `linear-gradient(135deg, hsl(${20 + i * 8}, 80%, 45%), hsl(${0 + i * 6}, 75%, 50%))`,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-ink">{il.il}</div>
                  <div className="text-[10px] text-ink-dim">
                    Harcama {fmtCompact(il.toplamHarcama * 1_000_000)}
                  </div>
                </div>
                <span className="pill pill-bad text-[10px]">{fmtPct(il.kayitDisi)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </ChartCard>

      <ChartCard
        baslik="12 Aylık Denetim Performansı"
        altBaslik="İptal edilen prim günleri ve tasarruf edilen tutar"
        delay={0.3}
      >
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={denetimSeri} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid stroke="rgba(148,163,184,0.06)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="ay" tickLine={false} axisLine={false} />
              <YAxis
                yAxisId="left"
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                tickLine={false}
                axisLine={false}
                width={42}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(v) => `${v}mn`}
                tickLine={false}
                axisLine={false}
                width={42}
              />
              <Tooltip
                formatter={(v: number, name) => {
                  if (name === 'İptal edilen prim gün') return fmtNum(v);
                  return `${v} mn ₺`;
                }}
              />
              <Legend iconType="circle" iconSize={8} />
              <Bar
                yAxisId="left"
                dataKey="iptalGun"
                name="İptal edilen prim gün"
                fill="#5b8bff"
                radius={[3, 3, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="tasarruf"
                name="Tasarruf (mn ₺)"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#10b981' }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="yersizOdeme"
                name="Yersiz ödeme tespiti (mn ₺)"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={{ r: 2.5, fill: '#ef4444' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </section>
  );
}
