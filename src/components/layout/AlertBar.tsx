import { motion } from 'framer-motion';
import { AlertTriangle, BellRing, ChevronRight, XOctagon } from 'lucide-react';
import { aktifUyarilar } from '@/data/mockData';
import { cn } from '@/lib/cn';

export function AlertBar() {
  const kritikSayi = aktifUyarilar.filter((u) => u.level === 'bad').length;
  const uyariSayi = aktifUyarilar.filter((u) => u.level === 'warn').length;
  const enAgir = kritikSayi > 0 ? 'bad' : 'warn';

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'mb-6 overflow-hidden rounded-2xl border bg-gradient-to-r via-bg-surface to-bg-surface shadow-card',
        enAgir === 'bad'
          ? 'border-signal-bad/25 from-signal-bad/[0.10]'
          : 'border-signal-warn/25 from-signal-warn/[0.10]',
      )}
    >
      <div className="flex flex-wrap items-stretch divide-x divide-border">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <div className="relative">
            <div
              className={cn(
                'absolute inset-0 animate-ping rounded-full',
                enAgir === 'bad' ? 'bg-signal-bad/40' : 'bg-signal-warn/40',
              )}
            />
            <div
              className={cn(
                'relative grid h-9 w-9 place-items-center rounded-full text-white',
                enAgir === 'bad' ? 'bg-signal-bad' : 'bg-signal-warn',
              )}
            >
              {enAgir === 'bad' ? <XOctagon size={16} strokeWidth={2.4} /> : <BellRing size={16} strokeWidth={2.4} />}
            </div>
          </div>
          <div>
            <div
              className={cn(
                'text-[11px] font-mono uppercase tracking-[0.18em]',
                enAgir === 'bad' ? 'text-signal-bad' : 'text-signal-warn',
              )}
            >
              Hızlı Uyarı Sistemi
            </div>
            <div className="font-display text-sm font-semibold text-ink">
              {kritikSayi > 0 ? `${kritikSayi} kritik · ` : ''}
              {uyariSayi} dikkat sapma izleniyor
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-2 overflow-x-auto px-5 py-3">
          {aktifUyarilar.map((u, i) => (
            <motion.button
              key={u.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className={cn(
                'group flex items-center gap-2.5 whitespace-nowrap rounded-lg border px-3 py-1.5 text-left transition-colors',
                u.level === 'bad'
                  ? 'border-signal-bad/30 bg-signal-bad/[0.08] hover:bg-signal-bad/[0.14]'
                  : 'border-signal-warn/30 bg-signal-warn/[0.08] hover:bg-signal-warn/[0.14]',
              )}
            >
              <AlertTriangle
                size={13}
                className={u.level === 'bad' ? 'text-signal-bad' : 'text-signal-warn'}
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-ink">{u.title}</span>
                <span className="text-[10px] text-ink-muted">{u.detail}</span>
              </div>
              <ChevronRight
                size={13}
                className="text-ink-dim transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
              />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
