import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUp, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { SignalLevel } from '@/types';
import { AnimatedNumber } from './AnimatedNumber';
import { Sparkline } from './Sparkline';
import { TrafficLight } from './TrafficLight';

interface KpiCardProps {
  baslik: string;
  altBaslik?: string;
  deger: number;
  format?: (n: number) => string;
  yoy?: number;
  hedef?: { etiket: string; deger: string };
  spark?: number[];
  level?: SignalLevel;
  icon?: LucideIcon;
  /** Geliri yüksek olunca iyi mi, kötü mü? Default: high-good */
  inverse?: boolean;
  delay?: number;
}

export function KpiCard({
  baslik,
  altBaslik,
  deger,
  format,
  yoy,
  hedef,
  spark,
  level,
  icon: Icon,
  inverse = false,
  delay = 0,
}: KpiCardProps) {
  const trendIyi = yoy === undefined ? null : inverse ? yoy < 0 : yoy > 0;
  const trendNotr = yoy !== undefined && Math.abs(yoy) < 0.5;
  const TrendIcon = trendNotr ? ArrowRight : trendIyi ? ArrowUp : ArrowDown;
  const trendRenk = trendNotr
    ? 'text-ink-muted bg-ink/5 ring-ink/10'
    : trendIyi
      ? 'text-signal-ok bg-signal-okDim ring-signal-ok/20'
      : 'text-signal-bad bg-signal-badDim ring-signal-bad/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.65, 0.3, 0.95] }}
      className="card card-hover group"
    >
      <div className="card-header">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {Icon && (
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink/[0.04] text-ink-muted ring-1 ring-inset ring-ink/[0.08]">
                <Icon size={14} strokeWidth={2} />
              </span>
            )}
            <p className="card-title">{baslik}</p>
            {level && <TrafficLight level={level} size="sm" />}
          </div>
          {altBaslik && <p className="card-subtitle">{altBaslik}</p>}
        </div>
        {yoy !== undefined && (
          <span className={cn('pill ring-1 ring-inset', trendRenk)}>
            <TrendIcon size={11} strokeWidth={2.5} />
            {Math.abs(yoy).toFixed(1)}%
          </span>
        )}
      </div>

      <div className="card-body">
        <div className="flex items-end justify-between gap-3">
          <div className="stat-num-lg">
            <AnimatedNumber value={deger} format={format} />
          </div>
          {spark && <Sparkline data={spark} />}
        </div>

        {hedef && (
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-ink-dim">{hedef.etiket}</span>
            <span className="font-mono text-ink-muted">{hedef.deger}</span>
          </div>
        )}
      </div>

      {/* Hover sheen — light'ta koyu tint, dark'ta beyaz tint (ink CSS var ile) */}
      <div
        className="pointer-events-none absolute -top-1/2 left-0 h-[200%] w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(115deg, transparent 30%, rgb(var(--ink) / 0.06) 50%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}
