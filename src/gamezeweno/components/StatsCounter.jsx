// src/components/StatsCounter.jsx
import React, { useState, useEffect, useRef } from 'react';

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
}

function StatItem({ icon, value, label, suffix = '', color = '#00CFFF', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 2000, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const formattedCount = count >= 1000
    ? (count / 1000).toFixed(count >= 10000 ? 0 : 1) + 'K'
    : count.toString();

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center p-6 gaming-card group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform duration-300"
        style={{ background: `${color}20`, border: `1px solid ${color}40` }}
      >
        {icon}
      </div>
      <div
        className="text-3xl md:text-4xl font-gaming font-bold mb-1"
        style={{ color, textShadow: `0 0 12px ${color}60` }}
      >
        {formattedCount}{suffix}
      </div>
      <div className="text-text-secondary text-sm font-body">{label}</div>
    </div>
  );
}

export default function StatsCounter({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatItem icon="📰" value={stats.total_articles} label="Total Articles" suffix="+" color="#00CFFF" delay={0} />
      <StatItem icon="💳" value={stats.accounts_sold} label="Accounts Sold" suffix="+" color="#7A5CFF" delay={100} />
      <StatItem icon="🎁" value={stats.active_giveaways} label="Active Giveaways" color="#00FF99" delay={200} />
      <StatItem icon="👥" value={stats.registered_users} label="Registered Users" suffix="+" color="#00CFFF" delay={300} />
    </div>
  );
}
