import { ScadaView } from '@/components/scada/ScadaView';

/**
 * SGK Genel Durum — SCADA tarzı tek ekran dashboard.
 * Menü, navigasyon ve scrol yok; tüm bileşenler viewport'a sığar ve canlı tick'lerle güncellenir.
 */
function App() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <main className="mx-auto h-screen max-w-[1920px] px-3 py-3 sm:px-4">
        <ScadaView />
      </main>
    </div>
  );
}

export default App;
