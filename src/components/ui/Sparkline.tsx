interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: string;
}

/**
 * Lightweight inline SVG sparkline — KPI kartlarında trend göstermek için.
 * Recharts'tan farklı olarak DOM yükü düşük (her KPI kartında çağrılabilir).
 */
export function Sparkline({
  data,
  width = 96,
  height = 32,
  color = '#5b8bff',
  fill = 'rgba(91, 139, 255, 0.16)',
}: SparklineProps) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y] as const;
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  const last = points[points.length - 1];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={fill} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#spark-${color})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill={color}>
        <animate attributeName="r" values="2.5;4;2.5" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
