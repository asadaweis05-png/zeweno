// src/pages/Home.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Eye, Star, Trophy, Zap, Gift, ShoppingBag, TrendingUp, ChevronRight, Play } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import StatsCounter from '../components/StatsCounter';
import CountdownTimer from '../components/CountdownTimer';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';

function ArticleCard({ article, featured = false }) {
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date);
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  if (featured) return (
    <Link to={`/gamezeweno/news/${article.slug}`} className="group flex flex-col gaming-card overflow-hidden h-full">
      <div className="relative h-56 overflow-hidden shrink-0">
        <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`badge-${article.category.includes('PUBG') ? 'purple' : 'blue'} text-xs uppercase tracking-wider`}>{article.category}</span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-gaming font-bold text-lg text-white group-hover:text-neon-blue transition-colors line-clamp-2 mb-3 leading-snug">{article.title}</h3>
        <p className="text-text-muted text-sm font-body line-clamp-3 mb-4 flex-1">{article.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-text-muted font-body mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Clock size={12} className="text-neon-blue" />{article.read_time}m read</span>
            <span className="flex items-center gap-1"><Eye size={12} className="text-neon-purple" />{(article.views / 1000).toFixed(1)}k</span>
          </div>
          <span className="text-white/40">{timeAgo(article.published_at)}</span>
        </div>
      </div>
    </Link>
  );

  return (
    <Link to={`/gamezeweno/news/${article.slug}`} className="group flex gap-4 p-4 rounded-xl transition-all duration-200 hover:bg-white/3">
      <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0">
        <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="flex-1 min-w-0">
        <span className={`badge-${article.category.includes('PUBG') ? 'purple' : 'blue'} text-xs mb-1`}>{article.category}</span>
        <h4 className="font-semibold text-sm font-body text-white group-hover:text-neon-blue transition-colors line-clamp-2 mt-1">{article.title}</h4>
        <div className="flex items-center gap-2 text-xs text-text-muted font-body mt-1">
          <Clock size={10} />{article.read_time}m
          <span className="text-text-muted/40">•</span>
          <Eye size={10} />{(article.views / 1000).toFixed(1)}k
        </div>
      </div>
    </Link>
  );
}

function AccountCard({ account }) {
  return (
    <Link to={`/gamezeweno/accounts/${account.id}`} className="group gaming-card flex flex-col overflow-hidden h-full">
      <div className="relative h-48 overflow-hidden shrink-0">
        <img src={account.image} alt={account.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/20 to-transparent" />
        {account.badge && (
          <div className="absolute top-3 right-3">
            <span className={`badge-${account.badge === 'HOT' ? 'red' : account.badge === 'RARE' ? 'purple' : account.badge === 'FEATURED' ? 'blue' : 'green'} text-xs font-gaming shadow-lg shadow-black/50`}>
              {account.badge}
            </span>
          </div>
        )}
        <div className="absolute bottom-4 left-4">
          <span className="badge-blue text-xs uppercase tracking-widest bg-[#151515]/80 backdrop-blur-md border-neon-blue/30">{account.game}</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-base font-body text-white group-hover:text-neon-blue transition-colors line-clamp-2 mb-3">{account.title}</h3>
        <div className="flex items-center gap-3 text-sm text-text-muted font-body mb-4 bg-white/5 p-2.5 rounded-lg border border-white/5">
          <span className="font-semibold text-white">Lvl {account.level}</span>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < Math.floor(account.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'} />
            ))}
            <span className="ml-1 font-semibold text-white">{account.rating}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="price-tag text-xl font-black">${account.price}</span>
          <span className="text-sm font-semibold text-neon-green group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
            Buy Now <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function GiveawayCard({ giveaway }) {
  return (
    <Link to="/gamezeweno/giveaways" className="group gaming-card flex flex-col overflow-hidden h-full border border-neon-green/20 hover:border-neon-green/50">
      <div className="relative h-44 overflow-hidden shrink-0">
        <img src={giveaway.image} alt={giveaway.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="badge-green text-xs font-gaming shadow-[0_0_15px_rgba(0,255,153,0.3)] animate-pulse">LIVE 🎁</span>
        </div>
        {giveaway.badge && (
          <div className="absolute top-3 right-3">
            <span className={`badge-${giveaway.badge === 'HOT' ? 'red' : giveaway.badge === 'NEW' ? 'blue' : 'purple'} text-xs font-bold shadow-lg shadow-black/50`}>{giveaway.badge}</span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-base font-body text-white group-hover:text-neon-green transition-colors line-clamp-2 mb-3">{giveaway.title}</h3>
        <div className="bg-neon-green/10 border border-neon-green/20 rounded-lg p-3 mb-4">
          <p className="text-neon-green text-sm font-gaming text-center font-bold tracking-wide">
            PRIZE: {giveaway.prize_value > 0 ? `$${giveaway.prize_value} VALUE` : giveaway.prize.toUpperCase()}
          </p>
        </div>
        <div className="flex items-center justify-between mt-auto bg-white/5 rounded-lg p-3 border border-white/5">
          <CountdownTimer endDate={giveaway.ends_at} compact />
          <div className="w-px h-6 bg-white/10" />
          <span className="text-xs font-bold text-text-secondary font-body uppercase tracking-wider">{giveaway.entries.toLocaleString()} ENTRIES</span>
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({ icon, title, subtitle, href, hrefLabel = 'View All' }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-neon-blue">{icon}</span>
          <h2 className="section-title gradient-text">{title}</h2>
        </div>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {href && (
        <Link to={href} className="flex items-center gap-1 text-sm text-neon-blue hover:text-white font-semibold font-body transition-colors group">
          {hrefLabel} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const { articles, accounts, giveaways, stats, loading } = useGame();
  const { openAuth } = useAuth();

  const eFootballArticles = articles.filter(a => a.category === 'eFootball News').slice(0, 3);
  const pubgArticles = articles.filter(a => a.category === 'PUBG News' || a.category === 'Leaks & Rumors').slice(0, 3);
  const trending = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);
  const featuredAccounts = accounts.filter(a => a.featured).slice(0, 4);
  const activeGiveaways = giveaways.filter(g => g.status === 'active').slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ paddingTop: '64px' }}>
        {/* Background */}
        <div className="absolute inset-0">
          <img src="/hero-bg.png" alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.95) 100%)' }} />
          <div className="bg-gaming-grid absolute inset-0 opacity-40" />
        </div>

        {/* Particles */}
        <ParticleBackground count={50} />

        {/* Glow orbs */}
        <div className="glow-orb-blue w-96 h-96 -top-20 -left-20" />
        <div className="glow-orb-purple w-80 h-80 top-1/3 right-0" />

        {/* Hero Content */}
        <div className="container-gaming relative z-10">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full font-body text-sm"
                style={{ background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.3)' }}>
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="text-neon-blue font-semibold">eFootball & PUBG Hub — Live</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-gaming font-black leading-tight mb-6"
            >
              <span className="text-white">Your Ultimate</span>
              <br />
              <span className="gradient-text animate-neon-flicker">Gaming Hub</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg md:text-xl text-text-secondary font-body mb-8 max-w-xl leading-relaxed"
            >
              Latest <span className="text-neon-blue font-semibold">eFootball</span> & <span className="text-neon-purple font-semibold">PUBG</span> News, Premium Accounts, and Exclusive Giveaways — all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/gamezeweno/news" className="btn-primary px-8 py-4 text-base">
                <span className="flex items-center gap-2">
                  <TrendingUp size={18} /> Read Latest News
                </span>
              </Link>
              <Link to="/gamezeweno/accounts" className="btn-secondary px-8 py-4 text-base">
                <ShoppingBag size={18} /> Browse Accounts
              </Link>
            </motion.div>

            {/* Quick stats below hero */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap gap-6 mt-12"
            >
              {[
                { label: '28K+ Users', color: '#00CFFF' },
                { label: '248 Articles', color: '#7A5CFF' },
                { label: '3 Live Giveaways', color: '#00FF99' },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                  <span className="text-sm font-body font-semibold" style={{ color }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <span className="text-text-muted text-xs font-body tracking-widest">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-neon-blue to-transparent" />
        </motion.div>
      </section>

      {/* ═══ GAMING STATS ═══ */}
      <section className="section-padding bg-gaming-grid">
        <div className="container-gaming">
          <SectionHeader icon={<Trophy size={22} />} title="Gamezeweno Stats" subtitle="Our community by the numbers" />
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="h-32 skeleton rounded-xl" />)}
            </div>
          ) : (
            <StatsCounter stats={stats} />
          )}
        </div>
      </section>

      {/* ═══ EFOOTBALL NEWS ═══ */}
      <section className="section-padding">
        <div className="container-gaming">
          <SectionHeader icon={<Zap size={22} />} title="Latest eFootball News" subtitle="Stay ahead of the meta" href="/gamezeweno/news" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? [...Array(3)].map((_, i) => <div key={i} className="h-72 skeleton rounded-xl" />)
              : eFootballArticles.map(a => <ArticleCard key={a.id} article={a} featured />)
            }
          </div>
        </div>
      </section>

      {/* ═══ PUBG NEWS ═══ */}
      <section className="section-padding" style={{ background: 'rgba(122,92,255,0.03)' }}>
        <div className="container-gaming">
          <SectionHeader icon={<Zap size={22} />} title="Latest PUBG News" subtitle="Battlegrounds intel & updates" href="/gamezeweno/news" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? [...Array(3)].map((_, i) => <div key={i} className="h-72 skeleton rounded-xl" />)
              : pubgArticles.map(a => <ArticleCard key={a.id} article={a} featured />)
            }
          </div>
        </div>
      </section>

      {/* ═══ TRENDING + FEATURED ACCOUNTS ═══ */}
      <section className="section-padding bg-gaming-grid">
        <div className="container-gaming">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Trending */}
            <div className="lg:col-span-1">
              <SectionHeader icon={<TrendingUp size={22} />} title="Trending" href="/gamezeweno/news" hrefLabel="All News" />
              <div className="gaming-card divide-y divide-white/5 overflow-hidden">
                {loading
                  ? [...Array(5)].map((_, i) => <div key={i} className="h-20 skeleton m-4 rounded-lg" />)
                  : trending.map((article, i) => (
                    <Link key={article.id} to={`/gamezeweno/news/${article.slug}`} className="flex items-center gap-4 p-5 group hover:bg-[#1A1A1A] transition-all cursor-pointer relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-blue transform -translate-x-full group-hover:translate-x-0 transition-transform" style={{ background: i === 0 ? '#00CFFF' : i === 1 ? '#7A5CFF' : i === 2 ? '#00FF99' : '#333' }} />
                      <span className="font-gaming font-black text-3xl w-10 text-center opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all shrink-0"
                        style={{ color: i === 0 ? '#00CFFF' : i === 1 ? '#7A5CFF' : i === 2 ? '#00FF99' : '#444', textShadow: i < 3 ? `0 0 15px ${i === 0 ? '#00CFFF' : i === 1 ? '#7A5CFF' : '#00FF99'}40` : 'none' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold font-body text-text-secondary group-hover:text-white transition-colors line-clamp-2 leading-relaxed">{article.title}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-text-muted font-body font-medium">
                          <Eye size={12} className="text-neon-blue/70" /> {(article.views / 1000).toFixed(1)}k views
                        </div>
                      </div>
                    </Link>
                  ))
                }
              </div>
            </div>

            {/* Featured Accounts */}
            <div className="lg:col-span-2">
              <SectionHeader icon={<ShoppingBag size={22} />} title="Featured Accounts" subtitle="Premium listings" href="/gamezeweno/accounts" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {loading
                  ? [...Array(4)].map((_, i) => <div key={i} className="h-64 skeleton rounded-xl" />)
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
          <SectionHeader icon={<Gift size={22} />} title="Active Giveaways" subtitle="Enter now for a chance to win" href="/gamezeweno/giveaways" hrefLabel="View All" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? [...Array(3)].map((_, i) => <div key={i} className="h-56 skeleton rounded-xl" />)
              : activeGiveaways.map(g => <GiveawayCard key={g.id} giveaway={g} />)
            }
          </div>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 p-8 rounded-2xl text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(0,207,255,0.08), rgba(122,92,255,0.08))', border: '1px solid rgba(0,207,255,0.15)' }}
          >
            <div className="glow-orb-blue w-64 h-64 -top-32 left-1/4" />
            <div className="relative z-10">
              <Gift size={40} className="mx-auto mb-4 text-neon-green" />
              <h3 className="text-2xl font-gaming font-bold gradient-text mb-2">Win Premium Gaming Rewards</h3>
              <p className="text-text-secondary font-body mb-6 max-w-md mx-auto">Join thousands of gamers competing for exclusive eFootball accounts, PUBG items, and gift cards.</p>
              <Link to="/gamezeweno/giveaways" className="btn-green inline-flex px-8 py-3">
                Enter Giveaways Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>


    </div>
  );
}
