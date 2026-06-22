// src/pages/Accounts.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, Star, ShoppingBag, Shield, Zap, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useGame } from '../context/GameContext';

const GAME_FILTERS = ['All', 'eFootball', 'PUBG'];
const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Newest', value: 'newest' },
];

function AccountCard({ account }) {
  return (
    <Link to={`/gamezeweno/accounts/${account.id}`} className="group gaming-card overflow-hidden block h-full flex flex-col">
      <div className="relative h-44 overflow-hidden shrink-0">
        <img src={account.image} alt={account.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #151515 20%, transparent 70%)' }} />
        {account.badge && (
          <div className="absolute top-3 right-3">
            <span className={`badge-${account.badge === 'HOT' ? 'red' : account.badge === 'RARE' ? 'purple' : account.badge === 'FEATURED' ? 'blue' : 'green'} text-xs font-gaming`}>
              {account.badge}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`badge-${account.game === 'PUBG' ? 'purple' : 'blue'} text-xs`}>{account.game}</span>
          {account.verified && <span className="badge-green text-xs">✓ Verified</span>}
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="font-gaming font-bold text-sm text-neon-blue">Lvl {account.level}</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-sm font-body text-white group-hover:text-neon-blue transition-colors line-clamp-1 mb-2">{account.title}</h3>

        {/* Rare Items */}
        <div className="flex flex-wrap gap-1 mb-3">
          {account.rare_items.slice(0, 2).map(item => (
            <span key={item} className="text-xs px-2 py-0.5 rounded font-body"
              style={{ background: 'rgba(255,215,0,0.08)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.15)' }}>
              ⭐ {item}
            </span>
          ))}
          {account.rare_items.length > 2 && (
            <span className="text-xs text-text-muted font-body">+{account.rare_items.length - 2} more</span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} className={i < Math.floor(account.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/15'} />
          ))}
          <span className="text-xs text-text-secondary font-body ml-1">{account.rating} ({account.seller_sales} sold)</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
          <div>
            <span className="price-tag text-xl">${account.price}</span>
            <span className="text-text-muted text-xs font-body ml-1">USD</span>
          </div>
          <button className="btn-green text-xs px-4 py-2">Buy Now</button>
        </div>
      </div>
    </Link>
  );
}

export default function Accounts() {
  const { accounts, loading } = useGame();
  const [gameFilter, setGameFilter] = useState('All');
  const [sort, setSort] = useState('featured');
  const [search, setSearch] = useState('');
  const [priceMax, setPriceMax] = useState(500);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = gameFilter === 'All' ? accounts : accounts.filter(a => a.game === gameFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a => a.title.toLowerCase().includes(q) || a.rare_items.some(i => i.toLowerCase().includes(q)));
    }
    list = list.filter(a => a.price <= priceMax);
    switch (sort) {
      case 'price_asc': return [...list].sort((a, b) => a.price - b.price);
      case 'price_desc': return [...list].sort((a, b) => b.price - a.price);
      case 'rating': return [...list].sort((a, b) => b.rating - a.rating);
      case 'newest': return [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      default: return [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [accounts, gameFilter, sort, search, priceMax]);

  const featured = accounts.filter(a => a.featured).slice(0, 3);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Banner */}
      <div className="relative overflow-hidden py-16"
        style={{ background: 'linear-gradient(135deg, rgba(122,92,255,0.08) 0%, rgba(0,207,255,0.06) 100%)', borderBottom: '1px solid rgba(122,92,255,0.15)' }}>
        <div className="bg-gaming-grid absolute inset-0 opacity-30" />
        <div className="glow-orb-purple w-96 h-96 -top-40 right-0" />
        <div className="container-gaming relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag size={20} className="text-neon-purple" />
            <span className="text-neon-purple text-sm font-semibold font-body tracking-wider uppercase">Marketplace</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-gaming font-black mb-3">
            <span className="gradient-text">Premium</span> <span className="text-white">Accounts</span>
          </h1>
          <p className="text-text-secondary font-body max-w-lg mb-6">Verified eFootball and PUBG accounts with secure purchase guarantee. All sellers rated and verified.</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm font-body"><Shield size={15} className="text-neon-green" /><span className="text-neon-green font-semibold">Secure Purchase</span></div>
            <div className="flex items-center gap-2 text-sm font-body"><Zap size={15} className="text-neon-blue" /><span className="text-neon-blue font-semibold">Instant Delivery</span></div>
          </div>
        </div>
      </div>

      <div className="container-gaming py-10">
        {/* Featured Accounts Banner */}
        {!loading && featured.length > 0 && (
          <div className="mb-10">
            <h2 className="section-title gradient-text mb-5 flex items-center gap-2"><Star size={20} />Featured Accounts</h2>
            <div className="cards-grid-3">
              {featured.map(acc => <AccountCard key={acc.id} account={acc} />)}
            </div>
          </div>
        )}

        <div className="neon-divider mb-8" />

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" placeholder="Search accounts, items..." value={search} onChange={e => setSearch(e.target.value)} className="input-gaming pl-10 h-11" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary text-sm px-4 h-11 flex items-center gap-2">
            <SlidersHorizontal size={15} /> Filters {showFilters ? '▲' : '▼'}
          </button>
          <div className="relative">
            <button onClick={() => setSortOpen(!sortOpen)} className="btn-secondary text-sm px-4 h-11 flex items-center gap-2 whitespace-nowrap">
              {SORT_OPTIONS.find(s => s.value === sort)?.label} <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 top-full mt-1 w-48 glass-card py-1 rounded-xl z-20 overflow-hidden"
                  style={{ border: '1px solid rgba(0,207,255,0.15)' }}>
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => { setSort(opt.value); setSortOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-body transition-colors hover:bg-white/5"
                      style={{ color: sort === opt.value ? '#00CFFF' : '#A0A0A0' }}>
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6">
              <div className="gaming-card p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-text-muted font-body uppercase tracking-wider mb-3">Game</p>
                    <div className="flex gap-2">
                      {GAME_FILTERS.map(g => (
                        <button key={g} onClick={() => setGameFilter(g)}
                          className={`category-tab ${gameFilter === g ? 'active' : ''}`}>{g}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-muted font-body uppercase tracking-wider mb-3">Max Price: <span className="text-neon-green">${priceMax}</span></p>
                    <input type="range" min="10" max="500" step="10" value={priceMax} onChange={e => setPriceMax(+e.target.value)}
                      className="w-full accent-neon-blue" style={{ accentColor: '#00CFFF' }} />
                    <div className="flex justify-between text-xs text-text-muted font-body mt-1"><span>$10</span><span>$500</span></div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-muted font-body uppercase tracking-wider mb-3">Quick Filters</p>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setPriceMax(50)} className="category-tab text-xs">Under $50</button>
                      <button onClick={() => setPriceMax(100)} className="category-tab text-xs">Under $100</button>
                      <button onClick={() => { setGameFilter('All'); setPriceMax(500); }} className="category-tab text-xs">Reset</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {GAME_FILTERS.map(g => (
            <button key={g} onClick={() => setGameFilter(g)} className={`category-tab ${gameFilter === g ? 'active' : ''}`}>{g}</button>
          ))}
          <span className="ml-auto text-text-muted text-sm font-body self-center">{filtered.length} accounts</span>
        </div>

        {/* Accounts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <div key={i} className="h-80 skeleton rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="mx-auto text-text-muted mb-4" />
            <h3 className="text-xl font-gaming font-bold text-text-secondary mb-2">No Accounts Found</h3>
            <p className="text-text-muted font-body mb-4">Try adjusting your filters or price range.</p>
            <button onClick={() => { setGameFilter('All'); setPriceMax(500); setSearch(''); }} className="btn-secondary">Reset All Filters</button>
          </div>
        ) : (
          <motion.div layout className="cards-grid-3">
            {filtered.map((acc, i) => (
              <motion.div key={acc.id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <AccountCard account={acc} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
