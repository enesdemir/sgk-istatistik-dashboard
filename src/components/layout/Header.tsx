import { Bell, Calendar, Download, Menu, RefreshCw, Search } from 'lucide-react';
import { ozet } from '@/data/mockData';

interface HeaderProps {
  /** Mobil drawer'ı açan handler — sadece lg altında butonu gösterir */
  onOpenMobileNav?: () => void;
}

export function Header({ onOpenMobileNav }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 -mx-4 mb-6 border-b border-border bg-bg-subtle/95 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobil hamburger — sadece lg altında görünür */}
          {onOpenMobileNav && (
            <button
              type="button"
              onClick={onOpenMobileNav}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-surface text-ink-muted transition-colors hover:bg-bg-elevated hover:text-ink lg:hidden"
              aria-label="Menüyü aç"
            >
              <Menu size={16} />
            </button>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <h1 className="truncate font-display text-lg font-bold tracking-tight text-ink sm:text-2xl">
                Genel Durum Paneli
              </h1>
              <span className="hidden shrink-0 pill pill-info sm:inline-flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-info" /> Canlı
              </span>
            </div>
            <p className="mt-0.5 hidden truncate text-xs text-ink-muted sm:block">
              Sosyal Güvenlik Kurumu • Sunum Modu • Tüm veriler{' '}
              <span className="font-mono text-ink">DEMO</span> amaçlıdır
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <div className="hidden items-center gap-2 rounded-lg border border-border bg-bg-surface/80 px-3 py-1.5 text-xs text-ink-muted xl:flex">
            <Search size={14} />
            <span>Hızlı arama…</span>
            <kbd className="ml-2 rounded border border-border bg-ink/[0.04] px-1.5 py-px font-mono text-[10px]">
              ⌘K
            </kbd>
          </div>

          <div className="hidden items-center gap-2 rounded-lg border border-border bg-bg-surface/80 px-3 py-1.5 md:flex">
            <Calendar size={14} className="text-ink-muted" />
            <span className="text-xs font-medium text-ink">{ozet.donem}</span>
            <span className="ml-2 hidden text-[10px] text-ink-dim lg:inline">son güncelleme</span>
            <span className="hidden text-[10px] font-mono text-ink-muted lg:inline">
              {ozet.guncellemeTarihi}
            </span>
          </div>

          <button
            type="button"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-surface/80 text-ink-muted transition-colors hover:bg-bg-elevated hover:text-ink sm:flex"
            title="Yenile"
          >
            <RefreshCw size={14} />
          </button>
          <button
            type="button"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-surface/80 text-ink-muted transition-colors hover:bg-bg-elevated hover:text-ink sm:flex"
            title="Rapor indir"
          >
            <Download size={14} />
          </button>
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-surface/80 text-ink-muted transition-colors hover:bg-bg-elevated hover:text-ink"
            title="Bildirimler"
          >
            <Bell size={14} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-signal-bad ring-2 ring-bg" />
          </button>
        </div>
      </div>
    </header>
  );
}
