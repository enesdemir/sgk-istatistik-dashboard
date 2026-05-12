import { ScadaView } from '@/components/scada/ScadaView';

/**
 * SGK Genel Durum — SCADA tarzı tek ekran dashboard.
 * Menü, navigasyon ve scrol yok; tüm bileşenler viewport'a sığar ve canlı tick'lerle güncellenir.
 */
function App() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <main className="flex h-screen w-full flex-col overflow-hidden px-3 py-2 sm:px-4">
        <ScadaView />
      </main>
    </div>
  );
}

export default App;
