import {
  Activity,
  BadgeAlert,
  CircleDollarSign,
  HeartPulse,
  LayoutDashboard,
  Pill,
  Settings,
  ShieldAlert,
  UserCircle2,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/cn';

interface SidebarProps {
  active: string;
  onSelect: (id: string) => void;
}

const NAV = [
  { id: 'overview', label: 'Genel Bakış', icon: LayoutDashboard },
  { id: 'gelir-gider', label: 'Gelir-Gider', icon: CircleDollarSign, badge: 'Kritik' },
  { id: 'emeklilik', label: 'Emeklilik & Sigortalı', icon: Users },
  { id: 'saglik', label: 'Sağlık & Provizyon', icon: HeartPulse },
  { id: 'eczane', label: 'Eczane & İlaç', icon: Pill },
  { id: 'denetim', label: 'Denetim & Risk', icon: ShieldAlert, badge: '5' },
];

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[252px] shrink-0 flex-col border-r border-border bg-bg-subtle px-4 py-5 lg:flex">
      {/* Logo */}
      <div className="mb-7 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-signal-info shadow-glow">
          <Activity size={20} className="text-white" strokeWidth={2.4} />
        </div>
        <div>
          <div className="font-display text-base font-bold tracking-tight text-ink">SGK</div>
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim">
            Genel Durum
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        <div className="px-2 pb-2 text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim">
          Paneller
        </div>
        {NAV.map((n) => {
          const Icon = n.icon;
          const isActive = active === n.id;
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => onSelect(n.id)}
              className={cn('nav-link w-full text-left', isActive && 'nav-link-active')}
            >
              <Icon
                size={16}
                strokeWidth={2}
                className={cn(isActive ? 'text-brand-300' : 'text-ink-dim')}
              />
              <span className="flex-1">{n.label}</span>
              {n.badge && (
                <span
                  className={cn(
                    'pill text-[10px]',
                    n.badge === 'Kritik' ? 'pill-bad' : 'pill-warn',
                  )}
                >
                  {n.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-0.5 pt-4">
        <div className="divider mb-3" />
        <button type="button" className="nav-link w-full text-left">
          <BadgeAlert size={16} strokeWidth={2} className="text-ink-dim" />
          <span className="flex-1">Uyarılar</span>
          <span className="pill pill-bad text-[10px]">2</span>
        </button>
        <button type="button" className="nav-link w-full text-left">
          <Settings size={16} strokeWidth={2} className="text-ink-dim" />
          <span>Ayarlar</span>
        </button>

        <div className="mt-4 flex items-center gap-3 rounded-lg bg-ink/[0.04] px-3 py-2.5 ring-1 ring-inset ring-ink/[0.06]">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-signal-info text-white">
            <UserCircle2 size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-ink">Başkanlık Ofisi</div>
            <div className="truncate text-[10px] text-ink-dim">demo@sgk.gov.tr</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
