// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Eye, Star, Trophy, Zap, Gift, ShoppingBag, TrendingUp, ChevronRight } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import StatsCounter from '../components/StatsCounter';
import CountdownTimer from '../components/CountdownTimer';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';

/* ─── helpers ─── */
const timeAgo = (date) => {
  const d = Math.floor((Date.now() - new Date(date)) / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return '1d ago';
  return `${d}d ago`;
};

/* ─── Article Card (featured grid) ─── */
function ArticleCard({ article }) {
  const isPubg = article.category.includes('PUBG') || article.category.includes('Leak');
  return (
    <Link
      to={`/gamezeweno/news/${article.slug}`}
      style={{
        display: 'flex', flexDirection: 'column',
        background: '#151515', border: '1px solid #1E1E1E',
        borderRadius: '14px', overflow: 'hidden',
        transition: 'all 0.3s ease', textDecoration: 'none',
        height: '100%',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(0,207,255,0.4)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.6), 0 0 20px rgba(0,207,255,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#1E1E1E';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden', flexShrink: 0 }}>
        <img src={article.thumbnail} alt={article.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #151515 0%, transparent 55%)' }} />
        <span style={{
          position: 'absolute', top: '12px', left: '12px',
          background: isPubg ? 'rgba(122,92,255,0.2)' : 'rgba(0,207,255,0.2)',
          color: isPubg ? '#7A5CFF' : '#00CFFF',
          border: `1px solid ${isPubg ? 'rgba(122,92,255,0.4)' : 'rgba(0,207,255,0.4)'}`,
          padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
          fontFamily: "'Exo 2', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {article.category}
        </span>
      </div>
      {/* Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
          fontSize: '15px', color: '#fff', lineHeight: 1.4,
          marginBottom: '10px', overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {article.title}
        </h3>
        <p style={{
          fontFamily: "'Exo 2', sans-serif", fontSize: '13px',
          color: '#606060', lineHeight: 1.6, flex: 1,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          marginBottom: '16px',
        }}>
          {article.excerpt}
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)',
          fontFamily: "'Exo 2', sans-serif", fontSize: '12px', color: '#606060',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={11} style={{ color: '#00CFFF' }} />{article.read_time}m
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Eye size={11} style={{ color: '#7A5CFF' }} />{(article.views / 1000).toFixed(1)}k
            </span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>{timeAgo(article.published_at)}</span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Account Card ─── */
function AccountCard({ account }) {
  const badgeColors = { HOT: '#FF4444', RARE: '#7A5CFF', FEATURED: '#00CFFF', NEW: '#00FF99' };
  const badgeBg = { HOT: 'rgba(255,68,68,0.15)', RARE: 'rgba(122,92,255,0.15)', FEATURED: 'rgba(0,207,255,0.15)', NEW: 'rgba(0,255,153,0.15)' };
  return (
    <Link
      to={`/gamezeweno/accounts/${account.id}`}
      style={{
        display: 'flex', flexDirection: 'column',
        background: '#151515', border: '1px solid #1E1E1E',
        borderRadius: '14px', overflow: 'hidden',
        transition: 'all 0.3s ease', textDecoration: 'none',
        height: '100%',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(0,207,255,0.35)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.6)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#1E1E1E';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden', flexShrink: 0 }}>
        <img src={account.image} alt={account.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #151515 5%, transparent 50%)' }} />
        {account.badge && (
          <span style={{
            position: 'absolute', top: '10px', right: '10px',
            background: badgeBg[account.badge] || 'rgba(0,207,255,0.15)',
            color: badgeColors[account.badge] || '#00CFFF',
            border: `1px solid ${badgeColors[account.badge] || '#00CFFF'}50`,
            padding: '2px 8px', borderRadius: '4px', fontSize: '10px',
            fontWeight: 800, fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.06em',
          }}>{account.badge}</span>
        )}
        <span style={{
          position: 'absolute', bottom: '10px', left: '10px',
          background: account.game === 'PUBG' ? 'rgba(122,92,255,0.25)' : 'rgba(0,207,255,0.25)',
          color: account.game === 'PUBG' ? '#7A5CFF' : '#00CFFF',
          border: `1px solid ${account.game === 'PUBG' ? 'rgba(122,92,255,0.5)' : 'rgba(0,207,255,0.5)'}`,
          padding: '2px 8px', borderRadius: '4px', fontSize: '10px',
          fontWeight: 700, fontFamily: "'Exo 2', sans-serif", textTransform: 'uppercase',
        }}>{account.game}</span>
      </div>
      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontFamily: "'Exo 2', sans-serif", fontWeight: 600,
          fontSize: '14px', color: '#fff', lineHeight: 1.4,
          marginBottom: '12px', overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {account.title}
        </h3>
        {/* Stats row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px', padding: '8px 12px', marginBottom: '14px',
          fontFamily: "'Exo 2', sans-serif",
        }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#00CFFF' }}>Lvl {account.level}</span>
          <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} style={{ color: i < Math.floor(account.rating) ? '#FFD700' : 'rgba(255,255,255,0.15)', fill: i < Math.floor(account.rating) ? '#FFD700' : 'transparent' }} />
            ))}
            <span style={{ fontSize: '11px', color: '#A0A0A0', marginLeft: '4px' }}>{account.rating}</span>
          </div>
        </div>
        {/* Price + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: '20px', color: '#00FF99', textShadow: '0 0 10px rgba(0,255,153,0.4)' }}>
            ${account.price}
          </span>
          <span style={{ fontFamily: "'Exo 2', sans-serif", fontSize: '13px', fontWeight: 600, color: '#00FF99', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Buy Now <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Giveaway Card (home preview) ─── */
function GiveawayCard({ giveaway }) {
  return (
    <Link
      to="/gamezeweno/giveaways"
      style={{
        display: 'flex', flexDirection: 'column',
        background: '#151515', border: '1px solid rgba(0,255,153,0.2)',
        borderRadius: '14px', overflow: 'hidden',
        transition: 'all 0.3s ease', textDecoration: 'none',
        height: '100%',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(0,255,153,0.5)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.6), 0 0 20px rgba(0,255,153,0.06)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(0,255,153,0.2)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden', flexShrink: 0 }}>
        <img src={giveaway.image} alt={giveaway.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #151515 5%, transparent 55%)' }} />
        <span style={{
          position: 'absolute', top: '10px', left: '10px',
          background: 'rgba(0,255,153,0.15)', color: '#00FF99',
          border: '1px solid rgba(0,255,153,0.4)',
          padding: '3px 10px', borderRadius: '4px', fontSize: '11px',
          fontWeight: 800, fontFamily: "'Orbitron', sans-serif",
          boxShadow: '0 0 12px rgba(0,255,153,0.2)',
          animation: 'glow-pulse 2s ease-in-out infinite',
        }}>🎁 LIVE</span>
        {giveaway.badge && (
          <span style={{
            position: 'absolute', top: '10px', right: '10px',
            background: giveaway.badge === 'HOT' ? 'rgba(255,68,68,0.2)' : 'rgba(0,207,255,0.2)',
            color: giveaway.badge === 'HOT' ? '#FF4444' : '#00CFFF',
            border: `1px solid ${giveaway.badge === 'HOT' ? 'rgba(255,68,68,0.4)' : 'rgba(0,207,255,0.4)'}`,
            padding: '2px 8px', borderRadius: '4px', fontSize: '10px',
            fontWeight: 700, fontFamily: "'Exo 2', sans-serif",
          }}>{giveaway.badge}</span>
        )}
      </div>
      {/* Content */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontFamily: "'Exo 2', sans-serif", fontWeight: 700, fontSize: '14px',
          color: '#fff', lineHeight: 1.4, marginBottom: '12px',
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {giveaway.title}
        </h3>
        {/* Prize highlight */}
        <div style={{
          background: 'rgba(0,255,153,0.08)', border: '1px solid rgba(0,255,153,0.2)',
          borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', textAlign: 'center',
        }}>
          <p style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '13px', color: '#00FF99', letterSpacing: '0.05em' }}>
            PRIZE: {giveaway.prize_value > 0 ? `$${giveaway.prize_value} VALUE` : (giveaway.prize || '').toUpperCase()}
          </p>
        </div>
        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px', padding: '10px 12px', marginTop: 'auto',
        }}>
          <CountdownTimer endDate={giveaway.ends_at} compact />
          <span style={{ fontFamily: "'Exo 2', sans-serif", fontSize: '11px', fontWeight: 700, color: '#606060', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {giveaway.entries?.toLocaleString()} entries
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Section Header ─── */
function SectionHeader({ icon, title, subtitle, href, hrefLabel = 'View All' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <span style={{ color: '#00CFFF' }}>{icon}</span>
          <h2 style={{
            fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
            fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', color: 'transparent',
            background: 'linear-gradient(135deg, #00CFFF, #7A5CFF)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>{title}</h2>
        </div>
        {subtitle && <p style={{ fontFamily: "'Exo 2', sans-serif", fontSize: '13px', color: '#606060', marginTop: '2px' }}>{subtitle}</p>}
      </div>
      {href && (
        <Link to={href} style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          fontSize: '13px', fontWeight: 600, color: '#00CFFF',
          fontFamily: "'Exo 2', sans-serif", textDecoration: 'none',
          transition: 'color 0.2s', flexShrink: 0,
        }}>
          {hrefLabel} <ChevronRight size={15} />
        </Link>
      )}
    </div>
  );
}

/* ─── Trending List Item ─── */
function TrendingItem({ article, index }) {
  const colors = ['#00CFFF', '#7A5CFF', '#00FF99'];
  const color = colors[index] || '#333';
  return (
    <Link
      to={`/gamezeweno/news/${article.slug}`}
      style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '14px 16px', textDecoration: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        transition: 'background 0.2s', position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#1A1A1A'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
        background: color, opacity: 0.7,
      }} />
      <span style={{
        fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
        fontSize: '22px', color, width: '36px', textAlign: 'center',
        flexShrink: 0, textShadow: index < 3 ? `0 0 12px ${color}60` : 'none',
        opacity: 0.85,
      }}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "'Exo 2', sans-serif", fontWeight: 600, fontSize: '13px',
          color: '#A0A0A0', lineHeight: 1.5,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: '4px',
        }}>
          {article.title}
        </p>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#606060', fontFamily: "'Exo 2', sans-serif" }}>
          <Eye size={10} style={{ color: 'rgba(0,207,255,0.6)' }} /> {(article.views / 1000).toFixed(1)}k views
        </span>
      </div>
    </Link>
  );
}

/* ─── Main Component ─── */
export default function Home() {
  const { articles, accounts, giveaways, stats, loading } = useGame();
  const { openAuth } = useAuth();

  const eFootballArticles = articles.filter(a => a.category === 'eFootball News').slice(0, 3);
  const pubgArticles = articles.filter(a => a.category === 'PUBG News' || a.category === 'Leaks & Rumors').slice(0, 3);
  const trending = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);
  const featuredAccounts = accounts.filter(a => a.featured).slice(0, 4);
  const activeGiveaways = giveaways.filter(g => g.status === 'active').slice(0, 3);

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: '64px' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src="/hero-bg.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.75) 50%, rgba(10,10,10,0.95) 100%)' }} />
          <div className="bg-gaming-grid" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
        </div>
        <ParticleBackground count={50} />
        <div className="glow-orb-blue" style={{ width: '380px', height: '380px', top: '-80px', left: '-80px' }} />
        <div className="glow-orb-purple" style={{ width: '300px', height: '300px', top: '33%', right: 0 }} />

        <div className="container-gaming" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '720px' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                marginBottom: '28px', padding: '8px 18px', borderRadius: '999px',
                background: 'rgba(0,207,255,0.08)', border: '1px solid rgba(0,207,255,0.25)',
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00FF99', display: 'inline-block', animation: 'glow-pulse 2s infinite' }} />
                <span style={{ fontFamily: "'Exo 2', sans-serif", fontSize: '13px', fontWeight: 600, color: '#00CFFF' }}>eFootball & PUBG Hub — Live</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', lineHeight: 1.08, marginBottom: '24px' }}
            >
              <span style={{ color: '#fff' }}>Your Ultimate</span><br />
              <span style={{ background: 'linear-gradient(135deg, #00CFFF, #7A5CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Gaming Hub</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
              style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#A0A0A0', marginBottom: '36px', maxWidth: '540px', lineHeight: 1.7 }}
            >
              Latest <span style={{ color: '#00CFFF', fontWeight: 600 }}>eFootball</span> & <span style={{ color: '#7A5CFF', fontWeight: 600 }}>PUBG</span> News, Premium Accounts, and Exclusive Giveaways — all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}
            >
              <Link to="/gamezeweno/news" className="btn-primary" style={{ padding: '14px 28px', fontSize: '15px', gap: '8px', display: 'inline-flex', alignItems: 'center' }}>
                <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={18} /> Read Latest News</span>
              </Link>
              <Link to="/gamezeweno/accounts" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={18} /> Browse Accounts
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }}
              style={{ display: 'flex', gap: '24px', marginTop: '48px', flexWrap: 'wrap' }}
            >
              {[{ label: '28K+ Users', color: '#00CFFF' }, { label: '248 Articles', color: '#7A5CFF' }, { label: '3 Live Giveaways', color: '#00FF99' }].map(({ label, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, display: 'inline-block' }} />
                  <span style={{ fontFamily: "'Exo 2', sans-serif", fontSize: '13px', fontWeight: 600, color }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 10 }}>
          <span style={{ fontFamily: "'Exo 2', sans-serif", fontSize: '10px', color: '#606060', letterSpacing: '0.15em' }}>SCROLL</span>
          <div style={{ width: '1px', height: '48px', background: 'linear-gradient(to bottom, #00CFFF, transparent)' }} />
        </motion.div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="section-padding bg-gaming-grid">
        <div className="container-gaming">
          <SectionHeader icon={<Trophy size={22} />} title="Gamezeweno Stats" subtitle="Our community by the numbers" />
          {loading ? (
            <div className="cards-grid-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '12px' }} />)}</div>
          ) : <StatsCounter stats={stats} />}
        </div>
      </section>

      {/* ═══ EFOOTBALL NEWS ═══ */}
      <section className="section-padding">
        <div className="container-gaming">
          <SectionHeader icon={<Zap size={22} />} title="Latest eFootball News" subtitle="Stay ahead of the meta" href="/gamezeweno/news" />
          <div className="cards-grid-3">
            {loading
              ? [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '340px', borderRadius: '14px' }} />)
              : eFootballArticles.map(a => <ArticleCard key={a.id} article={a} />)
            }
          </div>
        </div>
      </section>

      {/* ═══ PUBG NEWS ═══ */}
      <section className="section-padding" style={{ background: 'rgba(122,92,255,0.03)' }}>
        <div className="container-gaming">
          <SectionHeader icon={<Zap size={22} />} title="Latest PUBG News" subtitle="Battlegrounds intel & updates" href="/gamezeweno/news" />
          <div className="cards-grid-3">
            {loading
              ? [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '340px', borderRadius: '14px' }} />)
              : pubgArticles.map(a => <ArticleCard key={a.id} article={a} />)
            }
          </div>
        </div>
      </section>

      {/* ═══ TRENDING + FEATURED ACCOUNTS ═══ */}
      <section className="section-padding bg-gaming-grid">
        <div className="container-gaming">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px' }}>

            {/* Trending */}
            <div>
              <SectionHeader icon={<TrendingUp size={22} />} title="Trending" href="/gamezeweno/news" hrefLabel="All News" />
              <div style={{ background: '#151515', border: '1px solid #1E1E1E', borderRadius: '14px', overflow: 'hidden' }}>
                {loading
                  ? [...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: '72px', margin: '12px', borderRadius: '8px' }} />)
                  : trending.map((article, i) => <TrendingItem key={article.id} article={article} index={i} />)
                }
              </div>
            </div>

            {/* Featured Accounts */}
            <div>
              <SectionHeader icon={<ShoppingBag size={22} />} title="Featured Accounts" subtitle="Premium listings" href="/gamezeweno/accounts" />
              <div className="cards-grid-4">
                {loading
                  ? [...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '300px', borderRadius: '14px' }} />)
                  : featuredAccounts.map(acc => <AccountCard key={acc.id} account={acc} />)
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ACTIVE GIVEAWAYS ═══ */}
      <section className="section-padding" style={{ background: 'linear-gradient(135deg, rgba(0,255,153,0.03), rgba(0,207,255,0.03))' }}>
        <div className="container-gaming">
          <SectionHeader icon={<Gift size={22} />} title="Active Giveaways" subtitle="Enter now for a chance to win" href="/gamezeweno/giveaways" />
          <div className="cards-grid-3">
            {loading
              ? [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '380px', borderRadius: '14px' }} />)
              : activeGiveaways.map(g => <GiveawayCard key={g.id} giveaway={g} />)
            }
          </div>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{
              marginTop: '48px', padding: '48px 32px', borderRadius: '20px',
              textAlign: 'center', position: 'relative', overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(0,207,255,0.06), rgba(122,92,255,0.06))',
              border: '1px solid rgba(0,207,255,0.15)',
            }}
          >
            <div className="glow-orb-blue" style={{ width: '256px', height: '256px', top: '-128px', left: '25%' }} />
            <div style={{ position: 'relative', zIndex: 10 }}>
              <Gift size={44} style={{ margin: '0 auto 20px', color: '#00FF99', filter: 'drop-shadow(0 0 12px rgba(0,255,153,0.4))' }} />
              <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: 'clamp(1.4rem, 4vw, 2rem)', background: 'linear-gradient(135deg, #00FF99, #00CFFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '12px' }}>
                Win Premium Gaming Rewards
              </h3>
              <p style={{ fontFamily: "'Exo 2', sans-serif", color: '#A0A0A0', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px', lineHeight: 1.7, fontSize: '15px' }}>
                Join thousands of gamers competing for exclusive eFootball accounts, PUBG items, and gift cards.
              </p>
              <Link to="/gamezeweno/giveaways" className="btn-green" style={{ padding: '14px 32px', fontSize: '15px' }}>
                Enter Giveaways Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
