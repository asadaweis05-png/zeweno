export default function ProgressRing({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 10,
  color = 'var(--accent-cyan)',
  bgColor = 'var(--border-subtle)',
  label = '',
  showValue = true,
  valueLabel = '',
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference - pct * circumference;

  return (
    <div className="progress-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      {showValue && (
        <div className="progress-ring-text">
          <span className="progress-ring-value" style={{ fontSize: size * 0.2 }}>
            {valueLabel || value}
          </span>
          {label && <span className="progress-ring-label">{label}</span>}
        </div>
      )}
    </div>
  );
}
