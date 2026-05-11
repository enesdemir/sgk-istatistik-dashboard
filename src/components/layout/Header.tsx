import { Bell, Calendar, Download, RefreshCw, Search } from 'lucide-react';
import { ozet } from '@/data/mockData';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-30 -mx-6 mb-6 border-b border-border bg-bg-subtle/95 px-6 py-4 backdrop-blur-md lg:-mx-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
              Genel Durum Paneli
            </h1>
            <span className="pill pill-info">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-info" /> Canlı
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ink-muted">
            Sosyal Güvenlik Kurumu • Sunum Modu • Tüm veriler{' '}
            <span className="font-mono text-ink">DEMO</span> amaçlıdır
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden items-center gap-2 rounded-lg border border-border bg-bg-surface/80 px-3 py-1.5 text-xs text-ink-muted xl:flex">
            <Search size={14} />
            <span>Hızlı arama…</span>
            <kbd className="ml-2 rounded border border-border bg-ink/[0.04] px-1.5 py-px font-mono text-[10px]">
              ⌘K
            </kbd>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-surface/80 px-3 py-1.5">
            <Calendar size={14} className="text-ink-muted" />
            <span className="text-xs font-medium text-ink">{ozet.donem}</span>
            <span className="ml-2 text-[10px] text-ink-dim">son güncelleme</span>
            <span className="text-[10px] font-mono text-ink-muted">{ozet.guncellemeTarihi}</span>
          </div>

          <ThemeToggle />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-surface/80 text-ink-muted transition-colors hover:bg-bg-elevated hover:text-ink"
            title="Yenile"
          >
            <RefreshCw size={14} />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-surface/80 text-ink-muted transition-colors hover:bg-bg-elevated hover:text-ink"
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
