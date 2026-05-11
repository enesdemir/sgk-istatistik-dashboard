import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ChartCardProps {
  baslik: string;
  altBaslik?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ChartCard({
  baslik,
  altBaslik,
  badge,
  actions,
  children,
  className,
  delay = 0,
}: ChartCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.2, 0.65, 0.3, 0.95] }}
      className={cn('card', className)}
    >
      <header className="card-header">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-semibold tracking-tight text-ink">{baslik}</h3>
            {badge}
          </div>
          {altBaslik && <p className="card-subtitle">{altBaslik}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
      <div className="card-body">{children}</div>
    </motion.section>
  );
}
