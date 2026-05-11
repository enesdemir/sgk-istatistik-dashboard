import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AlertBar } from '@/components/layout/AlertBar';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { DenetimSection } from '@/components/sections/DenetimSection';
import { EczaneSection } from '@/components/sections/EczaneSection';
import { EmeklilikSection } from '@/components/sections/EmeklilikSection';
import { GelirGiderSection } from '@/components/sections/GelirGiderSection';
import { OverviewSection } from '@/components/sections/OverviewSection';
import { SaglikSection } from '@/components/sections/SaglikSection';

type View =
  | 'overview'
  | 'gelir-gider'
  | 'emeklilik'
  | 'saglik'
  | 'eczane'
  | 'denetim';

function App() {
  const [view, setView] = useState<View>('overview');

  // Sunum demosu: ⌘/Ctrl + 1-6 ile bölüm değiştir
  useEffect(() => {
    const keys: Record<string, View> = {
      '1': 'overview',
      '2': 'gelir-gider',
      '3': 'emeklilik',
      '4': 'saglik',
      '5': 'eczane',
      '6': 'denetim',
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && keys[e.key]) {
        e.preventDefault();
        setView(keys[e.key]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const renderView = () => {
    switch (view) {
      case 'overview':
        return <OverviewSection />;
      case 'gelir-gider':
        return <GelirGiderSection />;
      case 'emeklilik':
        return <EmeklilikSection />;
      case 'saglik':
        return <SaglikSection />;
      case 'eczane':
        return <EczaneSection />;
      case 'denetim':
        return <DenetimSection />;
    }
  };

  return (
    <div className="flex min-h-screen bg-bg text-ink">
      <Sidebar active={view} onSelect={(id) => setView(id as View)} />

      <main className="flex-1 overflow-x-hidden px-6 pb-12 lg:px-8">
        <Header />
        {view !== 'overview' && <AlertBar />}

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.2, 0.65, 0.3, 0.95] }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>

        <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-[11px] text-ink-dim">
          <div>
            © {new Date().getFullYear()} Sosyal Güvenlik Kurumu • Bu panel sunum amaçlı demo
            sürümüdür.
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span>⌘/Ctrl + 1..6</span>
            <span className="text-ink-muted">bölümler arası geçiş</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
