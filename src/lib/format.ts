const trNumber = new Intl.NumberFormat('tr-TR');
const trCompact = new Intl.NumberFormat('tr-TR', { notation: 'compact', maximumFractionDigits: 2 });
const trCurrency = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});
const trCurrencyCompact = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  notation: 'compact',
  maximumFractionDigits: 2,
});
const trPercent = new Intl.NumberFormat('tr-TR', {
  style: 'percent',
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

export const fmtNum = (n: number) => trNumber.format(n);
export const fmtCompact = (n: number) => trCompact.format(n);
export const fmtTL = (n: number) => trCurrency.format(n);
export const fmtTLCompact = (n: number) => trCurrencyCompact.format(n);
export const fmtPct = (n: number) => trPercent.format(n / 100);

export const fmtSigned = (n: number, suffix = '') =>
  `${n > 0 ? '+' : ''}${trNumber.format(n)}${suffix}`;

export const fmtSignedPct = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(1)}%`;
