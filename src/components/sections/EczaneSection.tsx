import { motion } from 'framer-motion';
import { FileText, Globe, Pill, Smartphone, Store } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '@/components/ui/ChartCard';
import { KpiCard } from '@/components/ui/KpiCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { eczaneOzet, yerliIthal } from '@/data/mockData';
import { fmtCompact, fmtNum, fmtTL } from '@/lib/format';

const iconBy: Record<string, typeof Pill> = {
  'Reçete Başı Ort. Maliyet': FileText,
  'Aylık Reçete Sayısı (mn)': Pill,
  'E-Reçete Kullanım': Smartphone,
  'Eczane Sayısı': Store,
};

export function EczaneSection() {
  return (
    <section className="space-y-5">
      <SectionHeader
        index={4}
        baslik="Eczane & İlaç İstatistikleri"
        altBaslik="Reçete maliyeti, dijitalleşme seviyesi ve yerli-ithal ilaç payı"
        icon={Pill}
        accent="from-emerald-500 to-cyan-500"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {eczaneOzet.map((e, i) => {
          const isCurrency = e.ad === 'Reçete Başı Ort. Maliyet';
          const isPercent = e.ad === 'E-Reçete Kullanım';
          const format = (n: number) => {
            if (isCurrency) return fmtTL(n);
            if (isPercent) return `%${n.toFixed(1)}`;
            if (e.ad === 'Aylık Reçete Sayısı (mn)') return `${n.toFixed(1)} mn`;
            return fmtNum(Math.round(n));
          };
          const Icon = iconBy[e.ad] ?? Pill;
          const inverse = isCurrency; // maliyet artışı kötü
          const level =
            (inverse && e.trend > 10) || (!inverse && e.trend < 0)
              ? 'bad'
              : (inverse && e.trend > 5) || (!inverse && e.trend < 1)
                ? 'warn'
                : 'ok';
          return (
            <KpiCard
              key={e.ad}
              baslik={e.ad}
              deger={e.deger}
              format={format}
              yoy={e.trend}
              level={level}
              icon={Icon}
              inverse={inverse}
              delay={0.05 * i}
              spark={[
                e.deger * 0.92,
                e.deger * 0.94,
                e.deger * 0.95,
                e.deger * 0.96,
                e.deger * 0.97,
                e.deger * 0.98,
                e.deger * 0.99,
                e.deger,
              ]}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Yerli vs İthal */}
        <ChartCard
          baslik="Yerli vs İthal İlaç Payı"
          altBaslik="Stratejik gösterge — adet ve maliyet bazlı dağılım"
          className="xl:col-span-2"
          delay={0.2}
        >
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={yerliIthal}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid stroke="rgba(148,163,184,0.06)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `%${v}`} />
                <YAxis
                  type="category"
                  dataKey="ad"
                  tickLine={false}
                  axisLine={false}
                  width={70}
                  tick={{ fontSize: 13, fill: '#e7ecf3' }}
                />
                <Tooltip formatter={(v: number) => `%${v}`} />
                <Legend iconType="circle" iconSize={8} />
                <Bar
                  dataKey="yerli"
                  stackId="a"
                  name="Yerli"
                  fill="#10b981"
                  radius={[6, 0, 0, 6]}
                />
                <Bar
                  dataKey="ithal"
                  stackId="a"
                  name="İthal"
                  fill="#f59e0b"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-[11px] text-ink-dim">
            Adet bazında <span className="text-signal-ok font-medium">yerli ilaç payı %81</span>{' '}
            iken maliyet bazında bu oran <span className="text-signal-warn font-medium">%47</span>;
            yüksek maliyetli onkoloji ve biyolojik tedavi kalemleri farkın temel nedeni.
          </p>
        </ChartCard>

        {/* Dijitalleşme gauge */}
        <ChartCard
          baslik="E-Reçete Dijitalleşme"
          altBaslik="Kullanım yaygınlığı"
          delay={0.25}
        >
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="relative">
              <svg width={200} height={120} viewBox="0 0 200 120">
                <defs>
                  <linearGradient id="dijGrd" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                {/* Track */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="rgba(148,163,184,0.14)"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                {/* Progress */}
                <motion.path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="url(#dijGrd)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray="251.3"
                  initial={{ strokeDashoffset: 251.3 }}
                  animate={{ strokeDashoffset: 251.3 * (1 - 0.986) }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                <span className="font-display text-3xl font-bold text-ink">%98.6</span>
                <span className="text-[10px] uppercase tracking-wider text-ink-dim">
                  e-reçete oranı
                </span>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-ink/[0.04] p-2.5 text-center ring-1 ring-inset ring-border">
                <div className="text-[10px] uppercase tracking-wider text-ink-dim">
                  Aylık reçete
                </div>
                <div className="font-display text-base font-semibold text-ink">32.4 mn</div>
              </div>
              <div className="rounded-lg bg-ink/[0.04] p-2.5 text-center ring-1 ring-inset ring-border">
                <div className="text-[10px] uppercase tracking-wider text-ink-dim">
                  Sözleşmeli eczane
                </div>
                <div className="font-display text-base font-semibold text-ink">
                  {fmtCompact(27600)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-signal-ok/[0.07] p-2.5 ring-1 ring-inset ring-signal-ok/20">
              <Globe size={14} className="shrink-0 text-signal-ok" />
              <p className="text-[11px] leading-relaxed text-ink-muted">
                Dijitalleşme dünya ortalamasının üzerinde. Sıradaki adım Avrupa ülkeleri ile
                karşılıklı e-reçete kabulü.
              </p>
            </div>
          </div>
        </ChartCard>
      </div>
    </section>
  );
}
