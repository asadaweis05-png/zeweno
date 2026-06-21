// src/components/CountdownTimer.jsx
import React, { useState, useEffect } from 'react';

function getTimeLeft(endDate) {
  const diff = new Date(endDate) - new Date();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

export default function CountdownTimer({ endDate, compact = false }) {
  const [time, setTime] = useState(getTimeLeft(endDate));

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(endDate)), 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (time.expired) return (
    <span className="badge-red text-xs font-gaming">ENDED</span>
  );

  if (compact) return (
    <div className="flex items-center gap-1 font-gaming text-xs">
      {time.days > 0 && <span className="neon-text-blue">{time.days}d</span>}
      <span className="neon-text-blue">{String(time.hours).padStart(2,'0')}h</span>
      <span className="text-text-muted">:</span>
      <span className="neon-text-blue">{String(time.minutes).padStart(2,'0')}m</span>
      <span className="text-text-muted">:</span>
      <span className="neon-text-green">{String(time.seconds).padStart(2,'0')}s</span>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      {[
        { label: 'DAYS', value: time.days },
        { label: 'HRS', value: time.hours },
        { label: 'MIN', value: time.minutes },
        { label: 'SEC', value: time.seconds },
      ].map(({ label, value }, i) => (
        <React.Fragment key={label}>
          {i > 0 && <span className="text-neon-blue font-gaming text-lg font-bold">:</span>}
          <div className="flex flex-col items-center">
            <div
              className="w-14 h-14 flex items-center justify-center rounded-lg font-gaming font-bold text-xl"
              style={{
                background: 'rgba(0,207,255,0.1)',
                border: '1px solid rgba(0,207,255,0.3)',
                color: label === 'SEC' ? '#00FF99' : '#00CFFF',
                textShadow: label === 'SEC' ? '0 0 8px #00FF9980' : '0 0 8px #00CFFF80',
              }}
            >
              {String(value).padStart(2, '0')}
            </div>
            <span className="text-text-muted text-xs mt-1 font-body tracking-wider">{label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
