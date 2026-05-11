# SGK • Genel Durum Paneli (Sunum Demo)

Sosyal Güvenlik Kurumu için **sunum amaçlı**, frontend-only React dashboard. Hiçbir
gerçek SGK sistemine bağlanmaz; tüm rakamlar `src/data/mockData.ts` içinde tanımlı.

## Stack

- Vite 5 + React 18 + TypeScript
- Tailwind CSS 3 (özel renk paleti, koyu tema)
- Recharts (line / area / bar / pie / composed)
- d3-geo + GeoJSON ile özel Türkiye ısı haritası
- Framer Motion ile geçiş ve sayı animasyonları
- Lucide React ikonları

## Bölümler

1. **Genel Bakış** — Hero özet, hızlı skor tablosu, mini ısı haritası
2. **Gelir-Gider & Aktüeryal Denge** — Aktif/pasif gauge, 12 aylık gelir-gider, yapılandırma akışı, net bakiye
3. **Emeklilik & Sigortalı** — Dosya bağlama süreleri, yeni emekli vs sigortalı, EYT, istisnai başvuru
4. **Sağlık & Provizyon** — Kurum dağılımı donut, 24 saatlik provizyon akışı, kronik kalemler, GSS
5. **Eczane & İlaç** — Reçete başı maliyet, e-reçete yarım gauge, yerli/ithal pay
6. **Denetim & Risk** — Türkiye ısı haritası (3 metrik), 12 aylık denetim performansı, en riskli iller

## Çalıştırma

```bash
npm install
npm run dev
# http://localhost:5174
```

## Klavye

- `⌘/Ctrl + 1..6` → bölümler arası hızlı geçiş
- Sidebar üzerinden de tıklanabilir

## Notlar

- Türkiye GeoJSON dosyası `public/geo/tr-cities.json` altında. d3-geo Mercator
  projeksiyonu ile fitSize uygulanır.
- Tüm KPI kartlarındaki sayılar `AnimatedNumber` ile 0'dan animasyonla yazılır.
- "Hızlı Uyarı Sistemi" üst barı; hedeften %10+ sapan göstergeleri pulse animasyonu ile vurgular.
