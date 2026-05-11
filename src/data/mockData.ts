/**
 * Sunum demo verisi — gerçekçi SGK büyüklükleri baz alınarak üretilmiş, tamamen mock.
 * Hiçbiri canlı sistemle bağlantılı değildir.
 */
import type {
  AlertItem,
  AylikSeri,
  DenetimSerisi,
  DosyaBaglamaIl,
  EczaneKalem,
  IlIsiHaritasi,
  KronikKalem,
  ProvizyonSeri,
  SaglikDagilim,
  SayiPaneliData,
  YapilandirmaSerisi,
  YeniEmekliSerisi,
  YerliIthal,
} from '@/types';

export const ozet = {
  donem: '2026 / Nisan',
  donemKisa: 'Nis 26',
  guncellemeTarihi: '11 Mayıs 2026 • 09:42',
  aktifSigortali: 24_138_402,
  pasifSigortali: 11_072_663,
  toplamPrimGelir: 2_270_000_000_000, // ₺ (kümülatif yıllık tahakkuk) — gider üzerinde
  toplamGider: 2_037_900_000_000, // ₺
  aktuaryalDenge: 232_100_000_000, // ₺ POZİTİF — gelir > gider (aktüeryal fazla)
  tahsilatOrani: 92.6, // % — hedef üzerinde
  yapilandirmaTahsilat: 158_200_000_000, // ₺
  yapilandirmaBeklenen: 168_400_000_000, // ₺
};

export const aktifPasifHedef = {
  guncel: 2.18,
  hedef: 2.0,
  oncekiYil: 2.05,
};

/** Gelir-Gider 12 aylık seri (milyar ₺) — prim sürekli toplam gideri aşıyor (aktüeryal fazla) */
export const aylikGelirGider: AylikSeri[] = [
  { ay: 'May 25', prim: 205, emekli: 142, saglik: 41, diger: 7 },
  { ay: 'Haz 25', prim: 211, emekli: 144, saglik: 43, diger: 7 },
  { ay: 'Tem 25', prim: 218, emekli: 148, saglik: 44, diger: 8 },
  { ay: 'Ağu 25', prim: 223, emekli: 150, saglik: 45, diger: 8 },
  { ay: 'Eyl 25', prim: 229, emekli: 153, saglik: 46, diger: 8 },
  { ay: 'Eki 25', prim: 235, emekli: 156, saglik: 47, diger: 8 },
  { ay: 'Kas 25', prim: 239, emekli: 159, saglik: 48, diger: 9 },
  { ay: 'Ara 25', prim: 258, emekli: 168, saglik: 51, diger: 11 },
  { ay: 'Oca 26', prim: 248, emekli: 172, saglik: 49, diger: 9 },
  { ay: 'Şub 26', prim: 242, emekli: 174, saglik: 47, diger: 9 },
  { ay: 'Mar 26', prim: 251, emekli: 176, saglik: 50, diger: 10 },
  { ay: 'Nis 26', prim: 260, emekli: 178, saglik: 52, diger: 10 },
];

export const yapilandirmaSeri: YapilandirmaSerisi[] = [
  { ay: 'May 25', beklenen: 12.4, tahsil: 12.0 },
  { ay: 'Haz 25', beklenen: 12.8, tahsil: 12.5 },
  { ay: 'Tem 25', beklenen: 13.1, tahsil: 12.9 },
  { ay: 'Ağu 25', beklenen: 13.2, tahsil: 13.0 },
  { ay: 'Eyl 25', beklenen: 13.6, tahsil: 13.3 },
  { ay: 'Eki 25', beklenen: 13.9, tahsil: 13.7 },
  { ay: 'Kas 25', beklenen: 14.1, tahsil: 13.9 },
  { ay: 'Ara 25', beklenen: 14.6, tahsil: 14.4 },
  { ay: 'Oca 26', beklenen: 14.8, tahsil: 14.5 },
  { ay: 'Şub 26', beklenen: 14.9, tahsil: 14.4 },
  { ay: 'Mar 26', beklenen: 15.1, tahsil: 14.7 },
  { ay: 'Nis 26', beklenen: 15.3, tahsil: 14.9 },
];

/** Dosya bağlama performansı — ilk 8 il (gün cinsinden ortalama) */
export const dosyaBaglamaIller: DosyaBaglamaIl[] = [
  { il: 'İstanbul', ortGun: 42 },
  { il: 'Ankara', ortGun: 34 },
  { il: 'İzmir', ortGun: 38 },
  { il: 'Bursa', ortGun: 36 },
  { il: 'Antalya', ortGun: 31 },
  { il: 'Konya', ortGun: 28 },
  { il: 'Adana', ortGun: 33 },
  { il: 'Gaziantep', ortGun: 29 },
];

export const yeniEmekliSeri: YeniEmekliSerisi[] = [
  { ay: 'May 25', yeniSigortali: 184_300, yeniEmekli: 124_000, eyt: 38_400 },
  { ay: 'Haz 25', yeniSigortali: 192_100, yeniEmekli: 131_200, eyt: 42_300 },
  { ay: 'Tem 25', yeniSigortali: 178_400, yeniEmekli: 128_600, eyt: 39_900 },
  { ay: 'Ağu 25', yeniSigortali: 168_700, yeniEmekli: 119_400, eyt: 36_800 },
  { ay: 'Eyl 25', yeniSigortali: 173_900, yeniEmekli: 125_100, eyt: 38_200 },
  { ay: 'Eki 25', yeniSigortali: 181_600, yeniEmekli: 130_800, eyt: 41_500 },
  { ay: 'Kas 25', yeniSigortali: 175_400, yeniEmekli: 132_900, eyt: 40_700 },
  { ay: 'Ara 25', yeniSigortali: 188_200, yeniEmekli: 148_300, eyt: 49_600 },
  { ay: 'Oca 26', yeniSigortali: 169_700, yeniEmekli: 156_400, eyt: 56_200 },
  { ay: 'Şub 26', yeniSigortali: 164_800, yeniEmekli: 142_100, eyt: 44_800 },
  { ay: 'Mar 26', yeniSigortali: 178_900, yeniEmekli: 138_700, eyt: 41_300 },
  { ay: 'Nis 26', yeniSigortali: 186_300, yeniEmekli: 135_900, eyt: 39_600 },
];

export const istisnaiBasvurular = {
  toplam: 12_840,
  oran: 4.2, // %
  oncekiAy: 11_980,
  oncekiAyOran: 3.9,
};

/**
 * Sağlık harcaması kalemleri (milyar ₺ / Nisan 2026).
 * Ana gruplar: Hastane (devlet/üniv/özel), Eczane (ilaç), Sağlık (aile hekimliği + diğer).
 */
export const saglikDagilim: SaglikDagilim[] = [
  { kurum: 'Devlet Hastanesi', tutar: 22.4, yuzde: 28.3, renk: '#3b6bf5', grup: 'Hastane' },
  { kurum: 'Üniversite Hastanesi', tutar: 11.8, yuzde: 14.9, renk: '#06b6d4', grup: 'Hastane' },
  { kurum: 'Özel Hastane', tutar: 14.6, yuzde: 18.4, renk: '#f59e0b', grup: 'Hastane' },
  { kurum: 'Eczane (ilaç)', tutar: 19.8, yuzde: 25.0, renk: '#a855f7', grup: 'Eczane' },
  { kurum: 'Aile Hekimliği', tutar: 6.4, yuzde: 8.1, renk: '#10b981', grup: 'Sağlık' },
  { kurum: 'Lab / Görüntüleme / Diğer', tutar: 4.2, yuzde: 5.3, renk: '#94a3b8', grup: 'Sağlık' },
];

export const kronikKalemler: KronikKalem[] = [
  { ad: 'Onkoloji', tutar: 18.4, pay: 21.6, trend: 8.3 },
  { ad: 'Diyabet', tutar: 9.7, pay: 11.4, trend: 4.1 },
  { ad: 'Kardiyovasküler', tutar: 8.1, pay: 9.5, trend: 2.7 },
  { ad: 'Romatoloji', tutar: 4.8, pay: 5.6, trend: 3.4 },
  { ad: 'Nefroloji (Diyaliz)', tutar: 5.6, pay: 6.6, trend: 1.9 },
  { ad: 'Psikiyatri', tutar: 2.4, pay: 2.8, trend: 11.2 },
];

/** Günlük provizyon — 24 saatlik dilim */
export const provizyonGunluk: ProvizyonSeri[] = Array.from({ length: 24 }, (_, h) => {
  const base = h < 7 ? 4_000 : h < 9 ? 38_000 : h < 12 ? 96_000 : h < 14 ? 72_000 : h < 18 ? 88_000 : 24_000;
  const noise = Math.round((Math.sin(h * 1.7) * 0.5 + 0.5) * 8_000);
  return { saat: `${String(h).padStart(2, '0')}:00`, sayi: base + noise };
});

export const provizyonOzet = {
  anlik: 1_842,
  bugun: 1_184_300,
  dun: 1_092_700,
  pikSaat: '11:00',
};

export const gssOzet = {
  kapsam60c1: 8_426_400,
  oncekiYil: 8_812_300,
  degisim: -4.4,
  gelirTesti: 1_142_300,
};

/** Eczane / ilaç istatistikleri */
export const eczaneOzet: EczaneKalem[] = [
  { ad: 'Reçete Başı Ort. Maliyet', deger: 624.8, trend: 18.7 },
  { ad: 'Aylık Reçete Sayısı (mn)', deger: 32.4, trend: 2.1 },
  { ad: 'E-Reçete Kullanım', deger: 98.6, trend: 0.4 },
  { ad: 'Eczane Sayısı', deger: 27_600, trend: 0.8 },
];

/** Yerli/İthal ilaç — mutlak rakam (yüzde değil) */
export const yerliIthal: YerliIthal[] = [
  { ad: 'Adet · aylık', yerli: 26.2, ithal: 6.2, birim: 'mn reçete' },
  { ad: 'Maliyet · aylık', yerli: 9.3, ithal: 10.5, birim: 'mlr ₺' },
];

/**
 * 6 ana ölçüm — günlük/haftalık/yıllık net rakamlar (yüzdesiz).
 * Sağlık reçete, hastane reçete, emekli sayısı, aktif sigortalı, aktif icra dosya, bütçe performansı.
 */
export const sayiPanelleri: SayiPaneliData[] = [
  {
    id: 'saglik-recete',
    baslik: 'Sağlık · Reçete',
    altBaslik: 'sgk provizyon kapsamı',
    gunluk: 1_080_000,
    haftalik: 7_480_000,
    yillik: 388_800_000,
    format: 'compact',
    durum: 'info',
  },
  {
    id: 'hastane-recete',
    baslik: 'Hastane · Reçete',
    altBaslik: 'hastane içi yazılan',
    gunluk: 378_000,
    haftalik: 2_618_000,
    yillik: 136_080_000,
    format: 'compact',
    durum: 'info',
  },
  {
    id: 'emekli-sayisi',
    baslik: 'Emekli · Yeni Bağlanan',
    altBaslik: 'aylık ort 135.900',
    gunluk: 4_530,
    haftalik: 31_700,
    yillik: 1_580_000,
    format: 'compact',
    durum: 'warn',
  },
  {
    id: 'aktif-sigortali',
    baslik: 'Aktif Sigortalı · Net Giriş',
    altBaslik: 'toplam 24.1 mn',
    gunluk: 2_350,
    haftalik: 16_460,
    yillik: 856_000,
    format: 'compact',
    durum: 'ok',
  },
  {
    id: 'icra-dosya',
    baslik: 'Aktif İcra Dosya',
    altBaslik: 'yeni açılan · tahsilat takibi',
    gunluk: 8_630,
    haftalik: 60_400,
    yillik: 3_148_000,
    format: 'compact',
    durum: 'warn',
  },
  {
    id: 'butce-perf',
    baslik: 'Bütçe Performansı',
    altBaslik: 'prim tahakkuk',
    gunluk: 6_220_000_000,
    haftalik: 43_650_000_000,
    yillik: 2_270_000_000_000,
    format: 'tl',
    durum: 'ok',
  },
];

/** İl bazlı denetim / harcama yoğunluğu (ısı haritası) — 81 il */
export const ilHarita: IlIsiHaritasi[] = [
  { il: 'Adana', ilKodu: 'TR.01', yogunluk: 68, toplamHarcama: 1640, kayitDisi: 24.1 },
  { il: 'Adıyaman', ilKodu: 'TR.02', yogunluk: 22, toplamHarcama: 320, kayitDisi: 31.2 },
  { il: 'Afyonkarahisar', ilKodu: 'TR.03', yogunluk: 28, toplamHarcama: 410, kayitDisi: 22.4 },
  { il: 'Ağrı', ilKodu: 'TR.04', yogunluk: 18, toplamHarcama: 210, kayitDisi: 38.1 },
  { il: 'Amasya', ilKodu: 'TR.05', yogunluk: 20, toplamHarcama: 240, kayitDisi: 18.7 },
  { il: 'Ankara', ilKodu: 'TR.06', yogunluk: 88, toplamHarcama: 4180, kayitDisi: 14.6 },
  { il: 'Antalya', ilKodu: 'TR.07', yogunluk: 74, toplamHarcama: 2240, kayitDisi: 26.8 },
  { il: 'Artvin', ilKodu: 'TR.08', yogunluk: 12, toplamHarcama: 110, kayitDisi: 16.4 },
  { il: 'Aydın', ilKodu: 'TR.09', yogunluk: 42, toplamHarcama: 920, kayitDisi: 23.7 },
  { il: 'Balıkesir', ilKodu: 'TR.10', yogunluk: 48, toplamHarcama: 1120, kayitDisi: 19.8 },
  { il: 'Bilecik', ilKodu: 'TR.11', yogunluk: 18, toplamHarcama: 180, kayitDisi: 14.2 },
  { il: 'Bingöl', ilKodu: 'TR.12', yogunluk: 14, toplamHarcama: 140, kayitDisi: 34.6 },
  { il: 'Bitlis', ilKodu: 'TR.13', yogunluk: 16, toplamHarcama: 160, kayitDisi: 36.4 },
  { il: 'Bolu', ilKodu: 'TR.14', yogunluk: 22, toplamHarcama: 280, kayitDisi: 17.1 },
  { il: 'Burdur', ilKodu: 'TR.15', yogunluk: 18, toplamHarcama: 200, kayitDisi: 21.3 },
  { il: 'Bursa', ilKodu: 'TR.16', yogunluk: 76, toplamHarcama: 2680, kayitDisi: 15.4 },
  { il: 'Çanakkale', ilKodu: 'TR.17', yogunluk: 26, toplamHarcama: 360, kayitDisi: 18.6 },
  { il: 'Çankırı', ilKodu: 'TR.18', yogunluk: 14, toplamHarcama: 140, kayitDisi: 20.4 },
  { il: 'Çorum', ilKodu: 'TR.19', yogunluk: 22, toplamHarcama: 300, kayitDisi: 22.8 },
  { il: 'Denizli', ilKodu: 'TR.20', yogunluk: 44, toplamHarcama: 980, kayitDisi: 20.1 },
  { il: 'Diyarbakır', ilKodu: 'TR.21', yogunluk: 38, toplamHarcama: 680, kayitDisi: 32.8 },
  { il: 'Edirne', ilKodu: 'TR.22', yogunluk: 22, toplamHarcama: 270, kayitDisi: 17.4 },
  { il: 'Elazığ', ilKodu: 'TR.23', yogunluk: 24, toplamHarcama: 340, kayitDisi: 23.6 },
  { il: 'Erzincan', ilKodu: 'TR.24', yogunluk: 16, toplamHarcama: 170, kayitDisi: 21.2 },
  { il: 'Erzurum', ilKodu: 'TR.25', yogunluk: 28, toplamHarcama: 460, kayitDisi: 26.4 },
  { il: 'Eskişehir', ilKodu: 'TR.26', yogunluk: 36, toplamHarcama: 720, kayitDisi: 16.8 },
  { il: 'Gaziantep', ilKodu: 'TR.27', yogunluk: 58, toplamHarcama: 1240, kayitDisi: 28.4 },
  { il: 'Giresun', ilKodu: 'TR.28', yogunluk: 18, toplamHarcama: 220, kayitDisi: 20.7 },
  { il: 'Gümüşhane', ilKodu: 'TR.29', yogunluk: 10, toplamHarcama: 90, kayitDisi: 24.1 },
  { il: 'Hakkari', ilKodu: 'TR.30', yogunluk: 8, toplamHarcama: 70, kayitDisi: 38.2 },
  { il: 'Hatay', ilKodu: 'TR.31', yogunluk: 42, toplamHarcama: 880, kayitDisi: 27.4 },
  { il: 'Isparta', ilKodu: 'TR.32', yogunluk: 22, toplamHarcama: 290, kayitDisi: 19.4 },
  { il: 'Mersin', ilKodu: 'TR.33', yogunluk: 54, toplamHarcama: 1180, kayitDisi: 24.2 },
  { il: 'İstanbul', ilKodu: 'TR.34', yogunluk: 100, toplamHarcama: 8420, kayitDisi: 17.2 },
  { il: 'İzmir', ilKodu: 'TR.35', yogunluk: 82, toplamHarcama: 3280, kayitDisi: 16.8 },
  { il: 'Kars', ilKodu: 'TR.36', yogunluk: 12, toplamHarcama: 120, kayitDisi: 28.6 },
  { il: 'Kastamonu', ilKodu: 'TR.37', yogunluk: 16, toplamHarcama: 180, kayitDisi: 17.4 },
  { il: 'Kayseri', ilKodu: 'TR.38', yogunluk: 48, toplamHarcama: 1020, kayitDisi: 18.6 },
  { il: 'Kırklareli', ilKodu: 'TR.39', yogunluk: 18, toplamHarcama: 220, kayitDisi: 16.8 },
  { il: 'Kırşehir', ilKodu: 'TR.40', yogunluk: 14, toplamHarcama: 150, kayitDisi: 19.4 },
  { il: 'Kocaeli', ilKodu: 'TR.41', yogunluk: 78, toplamHarcama: 2840, kayitDisi: 14.8 },
  { il: 'Konya', ilKodu: 'TR.42', yogunluk: 52, toplamHarcama: 1240, kayitDisi: 19.2 },
  { il: 'Kütahya', ilKodu: 'TR.43', yogunluk: 22, toplamHarcama: 290, kayitDisi: 22.4 },
  { il: 'Malatya', ilKodu: 'TR.44', yogunluk: 26, toplamHarcama: 380, kayitDisi: 24.6 },
  { il: 'Manisa', ilKodu: 'TR.45', yogunluk: 44, toplamHarcama: 940, kayitDisi: 20.4 },
  { il: 'Kahramanmaraş', ilKodu: 'TR.46', yogunluk: 32, toplamHarcama: 540, kayitDisi: 25.8 },
  { il: 'Mardin', ilKodu: 'TR.47', yogunluk: 24, toplamHarcama: 340, kayitDisi: 34.2 },
  { il: 'Muğla', ilKodu: 'TR.48', yogunluk: 38, toplamHarcama: 780, kayitDisi: 23.6 },
  { il: 'Muş', ilKodu: 'TR.49', yogunluk: 12, toplamHarcama: 110, kayitDisi: 36.8 },
  { il: 'Nevşehir', ilKodu: 'TR.50', yogunluk: 18, toplamHarcama: 220, kayitDisi: 20.4 },
  { il: 'Niğde', ilKodu: 'TR.51', yogunluk: 16, toplamHarcama: 170, kayitDisi: 22.1 },
  { il: 'Ordu', ilKodu: 'TR.52', yogunluk: 26, toplamHarcama: 380, kayitDisi: 24.8 },
  { il: 'Rize', ilKodu: 'TR.53', yogunluk: 18, toplamHarcama: 240, kayitDisi: 19.6 },
  { il: 'Sakarya', ilKodu: 'TR.54', yogunluk: 46, toplamHarcama: 1080, kayitDisi: 16.4 },
  { il: 'Samsun', ilKodu: 'TR.55', yogunluk: 38, toplamHarcama: 780, kayitDisi: 19.8 },
  { il: 'Siirt', ilKodu: 'TR.56', yogunluk: 14, toplamHarcama: 140, kayitDisi: 35.2 },
  { il: 'Sinop', ilKodu: 'TR.57', yogunluk: 12, toplamHarcama: 120, kayitDisi: 18.4 },
  { il: 'Sivas', ilKodu: 'TR.58', yogunluk: 22, toplamHarcama: 300, kayitDisi: 22.6 },
  { il: 'Tekirdağ', ilKodu: 'TR.59', yogunluk: 42, toplamHarcama: 920, kayitDisi: 18.6 },
  { il: 'Tokat', ilKodu: 'TR.60', yogunluk: 20, toplamHarcama: 260, kayitDisi: 23.4 },
  { il: 'Trabzon', ilKodu: 'TR.61', yogunluk: 32, toplamHarcama: 560, kayitDisi: 20.1 },
  { il: 'Tunceli', ilKodu: 'TR.62', yogunluk: 6, toplamHarcama: 50, kayitDisi: 18.6 },
  { il: 'Şanlıurfa', ilKodu: 'TR.63', yogunluk: 42, toplamHarcama: 820, kayitDisi: 33.4 },
  { il: 'Uşak', ilKodu: 'TR.64', yogunluk: 22, toplamHarcama: 280, kayitDisi: 21.4 },
  { il: 'Van', ilKodu: 'TR.65', yogunluk: 26, toplamHarcama: 400, kayitDisi: 32.7 },
  { il: 'Yozgat', ilKodu: 'TR.66', yogunluk: 18, toplamHarcama: 200, kayitDisi: 22.8 },
  { il: 'Zonguldak', ilKodu: 'TR.67', yogunluk: 28, toplamHarcama: 440, kayitDisi: 17.4 },
  { il: 'Aksaray', ilKodu: 'TR.68', yogunluk: 18, toplamHarcama: 220, kayitDisi: 21.6 },
  { il: 'Bayburt', ilKodu: 'TR.69', yogunluk: 8, toplamHarcama: 60, kayitDisi: 24.2 },
  { il: 'Karaman', ilKodu: 'TR.70', yogunluk: 14, toplamHarcama: 160, kayitDisi: 20.4 },
  { il: 'Kırıkkale', ilKodu: 'TR.71', yogunluk: 18, toplamHarcama: 220, kayitDisi: 19.8 },
  { il: 'Batman', ilKodu: 'TR.72', yogunluk: 20, toplamHarcama: 260, kayitDisi: 33.6 },
  { il: 'Şırnak', ilKodu: 'TR.73', yogunluk: 14, toplamHarcama: 130, kayitDisi: 37.8 },
  { il: 'Bartın', ilKodu: 'TR.74', yogunluk: 14, toplamHarcama: 150, kayitDisi: 18.7 },
  { il: 'Ardahan', ilKodu: 'TR.75', yogunluk: 8, toplamHarcama: 60, kayitDisi: 28.4 },
  { il: 'Iğdır', ilKodu: 'TR.76', yogunluk: 10, toplamHarcama: 90, kayitDisi: 34.2 },
  { il: 'Yalova', ilKodu: 'TR.77', yogunluk: 22, toplamHarcama: 280, kayitDisi: 16.2 },
  { il: 'Karabük', ilKodu: 'TR.78', yogunluk: 16, toplamHarcama: 200, kayitDisi: 19.4 },
  { il: 'Kilis', ilKodu: 'TR.79', yogunluk: 12, toplamHarcama: 110, kayitDisi: 29.6 },
  { il: 'Osmaniye', ilKodu: 'TR.80', yogunluk: 22, toplamHarcama: 300, kayitDisi: 26.4 },
  { il: 'Düzce', ilKodu: 'TR.81', yogunluk: 18, toplamHarcama: 230, kayitDisi: 18.2 },
];

export const denetimSeri: DenetimSerisi[] = [
  { ay: 'May 25', iptalGun: 184_000, tasarruf: 246, yersizOdeme: 84 },
  { ay: 'Haz 25', iptalGun: 198_000, tasarruf: 268, yersizOdeme: 92 },
  { ay: 'Tem 25', iptalGun: 176_000, tasarruf: 242, yersizOdeme: 79 },
  { ay: 'Ağu 25', iptalGun: 168_000, tasarruf: 228, yersizOdeme: 76 },
  { ay: 'Eyl 25', iptalGun: 192_000, tasarruf: 258, yersizOdeme: 88 },
  { ay: 'Eki 25', iptalGun: 214_000, tasarruf: 292, yersizOdeme: 96 },
  { ay: 'Kas 25', iptalGun: 226_000, tasarruf: 308, yersizOdeme: 102 },
  { ay: 'Ara 25', iptalGun: 248_000, tasarruf: 342, yersizOdeme: 118 },
  { ay: 'Oca 26', iptalGun: 232_000, tasarruf: 316, yersizOdeme: 124 },
  { ay: 'Şub 26', iptalGun: 218_000, tasarruf: 296, yersizOdeme: 108 },
  { ay: 'Mar 26', iptalGun: 242_000, tasarruf: 334, yersizOdeme: 116 },
  { ay: 'Nis 26', iptalGun: 256_000, tasarruf: 358, yersizOdeme: 132 },
];

export const denetimOzet = {
  kayitDisiOran: 22.8, // %
  kayitDisiOranOnceki: 24.1,
  takiptekiYersizOdeme: 4_240_000_000, // ₺
  geriAlinan: 1_180_000_000, // ₺
};

/** Üst uyarı barı için kritik sapmalar — yüzdesiz, mutlak rakamlı */
export const aktifUyarilar: AlertItem[] = [
  {
    id: 'al-1',
    level: 'warn',
    title: 'İstanbul dosya bağlama süresi yüksek',
    detail: '42 gün — hedef 30 gün',
    sapma: 40.0,
    bolum: 'Emeklilik',
  },
  {
    id: 'al-2',
    level: 'warn',
    title: 'Onkoloji harcama artış eğiliminde',
    detail: 'Aylık 18.4 mlr ₺ — toplam içinde lider kalem',
    sapma: 8.3,
    bolum: 'Sağlık',
  },
  {
    id: 'al-3',
    level: 'warn',
    title: 'Reçete başı maliyet yükseliyor',
    detail: 'Ortalama 624,80 ₺ — ilaç enflasyonu izleniyor',
    sapma: 18.7,
    bolum: 'Eczane',
  },
  {
    id: 'al-4',
    level: 'warn',
    title: 'Şanlıurfa kayıt dışı istihdam yoğun',
    detail: 'Saha denetim önceliği — tahmini 1,2 mn çalışan',
    sapma: 13.4,
    bolum: 'Denetim',
  },
];
