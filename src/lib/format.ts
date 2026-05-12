const trNumber = new Intl.NumberFormat('tr-TR');
const trCompact = new Intl.NumberFormat('tr-TR', { notation: 'compact', maximumFractionDigits: 2 });
const trCompactInt = new Intl.NumberFormat('tr-TR', { notation: 'compact', maximumFractionDigits: 0 });
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
export const fmtCompactInt = (n: number) => trCompactInt.format(n);
export const fmtTL = (n: number) => trCurrency.format(n);
export const fmtTLCompact = (n: number) => trCurrencyCompact.format(n);
export const fmtPct = (n: number) => trPercent.format(n / 100);

export const fmtSigned = (n: number, suffix = '') =>
  `${n > 0 ? '+' : ''}${trNumber.format(n)}${suffix}`;

export const fmtSignedPct = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(1)}%`;

/**
 * Compact rakamı (sayı, birim) parçaları olarak döner — split layout için.
 * Örn: 6_220_000_000 → { value: "6,22", unit: "Mr" }
 *      388_800_000 → { value: "389", unit: "Mn" }
 */
export function fmtCompactParts(n: number): { value: string; unit: string } {
  const abs = Math.abs(n);
  let value: number;
  let unit: string;
  if (abs >= 1e12) {
    value = n / 1e12;
    unit = 'Tn';
  } else if (abs >= 1e9) {
    value = n / 1e9;
    unit = 'Mr';
  } else if (abs >= 1e6) {
    value = n / 1e6;
    unit = 'Mn';
  } else if (abs >= 1e3) {
    value = n / 1e3;
    unit = 'B';
  } else {
    value = n;
    unit = '';
  }
  const decimals = Math.abs(value) >= 100 ? 0 : Math.abs(value) >= 10 ? 1 : 2;
  return {
    value: value.toLocaleString('tr-TR', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: 0,
    }),
    unit,
  };
}
