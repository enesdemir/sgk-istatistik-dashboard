import { cn } from '@/lib/cn';
import type { SignalLevel } from '@/types';

interface TrafficLightProps {
  level: SignalLevel;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  label?: string;
}

const colorMap: Record<SignalLevel, { dot: string; ring: string; ringPulse: string }> = {
  ok: { dot: 'bg-signal-ok', ring: 'ring-signal-ok/20', ringPulse: 'bg-signal-ok/60' },
  warn: { dot: 'bg-signal-warn', ring: 'ring-signal-warn/20', ringPulse: 'bg-signal-warn/60' },
  bad: { dot: 'bg-signal-bad', ring: 'ring-signal-bad/20', ringPulse: 'bg-signal-bad/60' },
  info: { dot: 'bg-signal-info', ring: 'ring-signal-info/20', ringPulse: 'bg-signal-info/60' },
};

const sizeMap = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
};

export function TrafficLight({ level, size = 'md', pulse = true, label }: TrafficLightProps) {
  const c = colorMap[level];
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative inline-flex">
        {pulse && (
          <span
            className={cn('absolute inline-flex h-full w-full rounded-full opacity-75 animate-pulse-ring', c.ringPulse)}
          />
        )}
        <span
          className={cn(
            'relative inline-flex rounded-full ring-4',
            sizeMap[size],
            c.dot,
            c.ring,
          )}
        />
      </span>
      {label && <span className="text-xs font-medium text-ink-muted">{label}</span>}
    </span>
  );
}
