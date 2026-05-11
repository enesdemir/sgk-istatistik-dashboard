import { motion } from 'framer-motion';
import {
  Activity,
  Banknote,
  Building2,
  HeartPulse,
  Pill,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { TurkeyHeatmap } from '@/components/charts/TurkeyHeatmap';
import { ChartCard } from '@/components/ui/ChartCard';
import { TrafficLight } from '@/components/ui/TrafficLight';
import { aktifPasifHedef, ilHarita, ozet } from '@/data/mockData';
import { fmtCompact, fmtPct, fmtTLCompact } from '@/lib/format';

const HEADLINE = [
  {
    baslik: 'Aktif Sigortalı',
    deger: fmtCompact(ozet.aktifSigortali),
    altDeger: 'kişi',
    yoy: 3.4,
    icon: Users,
  },
  {
    baslik: 'Pasif Sigortalı',
    deger: fmtCompact(ozet.pasifSigortali),
    altDeger: 'kişi',
    yoy: -2.6,
    icon: Building2,
    inverse: true,
  },
  {
    baslik: 'Yıllık Prim Geliri',
    deger: fmtTLCompact(ozet.toplamPrimGelir),
    altDeger: 'tahakkuk',
    yoy: 23.2,
    icon: Banknote,
  },
  {
    baslik: 'Yıllık Toplam Gider',
    deger: fmtTLCompact(ozet.toplamGider),
    altDeger: 'aylık + sağlık',
    yoy: 14.6,
    icon: HeartPulse,
    inverse: true,
  },
];

export function OverviewSection() {
  const aktifPasif = aktifPasifHedef.guncel;

  return (
    <section className="space-y-5">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card relative overflow-hidden"
      >
        <div
          className="pointer-events-none absolute inset-0 grid-fade"
          aria-hidden
        />
        <div className="relative grid grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="pill pill-info">
                <Activity size={11} /> {ozet.donem}
              </span>
              <span className="pill pill-ok">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-ok" />
                Aktüeryal fazla sürüyor
              </span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">
              Sosyal Güvenlik Kurumu •{' '}
              <span className="gradient-text">Genel Durum</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
              Aktif/pasif oranı{' '}
              <span className="font-mono text-ink">{aktifPasif.toFixed(2)}</span> ile 2,00 hedefinin
              üzerinde. Yıllık aktüeryal denge{' '}
              <span className="font-mono text-signal-ok">
                +{fmtTLCompact(Math.abs(ozet.aktuaryalDenge))}
              </span>{' '}
              fazla veriyor. Sağlık giderlerinde {fmtPct(11.4)} YoY artış sürse de prim tahsilatı{' '}
              {fmtPct(92.6)} ve denetim tasarrufu {fmtPct(45.5)} ile sistem güçlü tarafta.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {HEADLINE.map((h) => {
                const Icon = h.icon;
                const iyi = h.inverse ? h.yoy < 0 : h.yoy > 0;
                const TrendIcon = iyi ? TrendingUp : TrendingDown;
                return (
                  <div
                    key={h.baslik}
                    className="rounded-xl border border-border bg-bg-elevated p-3"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-dim">
                      <Icon size={11} /> {h.baslik}
                    </div>
                    <div className="mt-1 flex items-baseline justify-between gap-2">
                      <span className="font-display text-xl font-bold text-ink">{h.deger}</span>
                      <span className="text-[10px] text-ink-dim">{h.altDeger}</span>
                    </div>
                    <div
                      className={`mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium ${
                        iyi ? 'text-signal-ok' : 'text-signal-bad'
                      }`}
                    >
                      <TrendIcon size={10} /> {h.yoy > 0 ? '+' : ''}
                      {h.yoy.toFixed(1)}% YoY
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column: Quick scoreboard */}
          <div className="rounded-2xl border border-border bg-bg-elevated p-5">
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-ink-dim">
              Hızlı Skor Tablosu
            </div>
            <div className="mt-3 space-y-3">
              <ScoreRow label="Gelir/Gider" level="ok" value="%111.4" hedef="≥%100" />
              <ScoreRow label="Aktif/Pasif" level="ok" value="2.18" hedef="2.00" />
              <ScoreRow label="Tahsilat" level="ok" value="%92.6" hedef="%92" />
              <ScoreRow label="Yapılandırma" level="ok" value="%94.0" hedef="%90" />
              <ScoreRow label="Bağlama (gün)" level="warn" value="34" hedef="≤30" />
              <ScoreRow label="E-Reçete" level="ok" value="%98.6" hedef="%95" />
              <ScoreRow label="Denetim tasarruf" level="ok" value="358 mn ₺" hedef="≥250" />
              <ScoreRow label="Kayıt dışı" level="warn" value="%22.8" hedef="≤%20" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mini heatmap teaser */}
      <ChartCard
        baslik="Türkiye Geneli — Tek Bakışta"
        altBaslik="Kayıt dışı istihdam oranı (il bazlı tahmin)"
        delay={0.15}
      >
        <div className="rounded-xl border border-border bg-bg-elevated p-2">
          <TurkeyHeatmap veri={ilHarita} metric="kayitDisi" />
        </div>
        <p className="mt-3 text-[11px] text-ink-dim">
          Şanlıurfa, Mardin, Diyarbakır ve Hakkari hattı yüksek kayıt dışılık baskısı altında. Aynı
          illerde dosya bağlama ortalama 36 günü aşıyor.
        </p>
      </ChartCard>
    </section>
  );
}

function ScoreRow({
  label,
  level,
  value,
  hedef,
}: {
  label: string;
  level: 'ok' | 'warn' | 'bad';
  value: string;
  hedef: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <TrafficLight level={level} size="sm" pulse={level !== 'ok'} />
        <span className="text-sm text-ink">{label}</span>
      </div>
      <div className="flex items-baseline gap-2 font-mono">
        <span className="text-sm font-semibold text-ink">{value}</span>
        <span className="text-[10px] text-ink-dim">/ {hedef}</span>
      </div>
    </div>
  );
}
