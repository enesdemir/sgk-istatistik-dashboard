export type SignalLevel = 'ok' | 'warn' | 'bad' | 'info';

export interface AlertItem {
  id: string;
  level: Exclude<SignalLevel, 'info'>;
  title: string;
  detail: string;
  sapma: number;
  bolum: string;
}

export interface KpiPoint {
  label: string;
  value: number;
}

export interface AylikSeri {
  ay: string;
  prim: number;
  emekli: number;
  saglik: number;
  diger: number;
}

export interface YapilandirmaSerisi {
  ay: string;
  beklenen: number;
  tahsil: number;
}

export interface DosyaBaglamaIl {
  il: string;
  ortGun: number;
}

export interface YeniEmekliSerisi {
  ay: string;
  yeniSigortali: number;
  yeniEmekli: number;
  eyt: number;
}

export type SaglikGrup = 'Hastane' | 'Eczane' | 'Sağlık';

export interface SaglikDagilim {
  kurum: string;
  tutar: number; // mlr ₺/ay
  yuzde: number;
  renk: string;
  grup: SaglikGrup;
}

export interface KronikKalem {
  ad: string;
  tutar: number;
  pay: number;
  trend: number;
}

export interface ProvizyonSeri {
  saat: string;
  sayi: number;
}

export interface IlIsiHaritasi {
  il: string;
  /** TÜİK il kodu (string olarak 2 hane: "01" Adana vs.) */
  ilKodu: string;
  yogunluk: number;
  toplamHarcama: number;
  kayitDisi: number;
}

export interface EczaneKalem {
  ad: string;
  deger: number;
  trend: number;
}

export interface YerliIthal {
  ad: string;
  yerli: number;
  ithal: number;
  birim: string;
}

export interface SayiPaneliData {
  id: string;
  baslik: string;
  altBaslik?: string;
  gunluk: number;
  haftalik: number;
  yillik: number;
  format: 'compact' | 'tl';
  durum: 'ok' | 'warn' | 'bad' | 'info';
}

export interface DenetimSerisi {
  ay: string;
  iptalGun: number;
  tasarruf: number;
  yersizOdeme: number;
}
