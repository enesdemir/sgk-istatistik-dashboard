import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  index: number;
  baslik: string;
  altBaslik: string;
  icon: LucideIcon;
  accent?: string;
}

export function SectionHeader({
  index,
  baslik,
  altBaslik,
  icon: Icon,
  accent = 'from-brand-500 to-signal-info',
}: SectionHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="mb-5 flex items-center gap-4"
    >
      <span
        className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-glow`}
      >
        <Icon size={20} strokeWidth={2.2} />
      </span>
      <div className="flex-1">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-dim">
            Bölüm {String(index).padStart(2, '0')}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>
        <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">{baslik}</h2>
        <p className="text-sm text-ink-muted">{altBaslik}</p>
      </div>
    </motion.header>
  );
}
