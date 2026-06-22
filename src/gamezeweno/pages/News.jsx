// src/pages/News.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, Eye, ChevronRight, Filter, TrendingUp, Newspaper } from 'lucide-react';
import { useGame } from '../context/GameContext';

const CATEGORIES = ['All', 'eFootball News', 'PUBG News', 'Updates & Patches', 'Tournaments', 'Leaks & Rumors'];

function timeAgo(date) {
  const diff = Date.now() - new Date(date);
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

function ArticleCardLarge({ article }) {
  return (
    <Link to={`/gamezeweno/news/${article.slug}`} className="group gaming-card overflow-hidden flex flex-col md:flex-row h-full">
      <div className="relative md:w-80 h-52 md:h-auto shrink-0 overflow-hidden">
        <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent, #151515)' }} />
        <div className="absolute top-4 left-4">
          <span className={`badge-${article.category.includes('PUBG') ? 'purple' : article.category.includes('Leak') ? 'red' : 'blue'} text-xs`}>
            {article.category}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <div className="badge-green text-xs mb-3 inline-flex">⭐ FEATURED</div>
          <h2 className="text-xl font-gaming font-bold text-white group-hover:text-neon-blue transition-colors mb-3 leading-tight">{article.title}</h2>
          <p className="text-text-secondary font-body text-sm leading-relaxed line-clamp-3">{article.excerpt}</p>
        </div>
        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center gap-3 text-xs text-text-muted font-body">
            <img src={article.author_avatar} alt="" className="w-6 h-6 rounded-full border border-white/10" />
            <span>{article.author}</span>
            <span className="flex items-center gap-1"><Clock size={11} />{article.read_time}m</span>
            <span className="flex items-center gap-1"><Eye size={11} />{(article.views / 1000).toFixed(1)}k</span>
          </div>
          <span className="flex items-center gap-1 text-neon-blue text-sm font-semibold group-hover:gap-2 transition-all">
            Read More <ChevronRight size={15} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ article }) {
  return (
    <Link to={`/gamezeweno/news/${article.slug}`} className="group gaming-card overflow-hidden block h-full flex flex-col">
      <div className="relative h-44 overflow-hidden shrink-0">
        <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #151515 0%, transparent 60%)' }} />
        <div className="absolute top-3 left-3">
          <span className={`badge-${article.category.includes('PUBG') ? 'purple' : article.category.includes('Leak') ? 'red' : 'blue'} text-xs`}>
            {article.category}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-white/70 font-body">
          <Clock size={10} />{article.read_time}m
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-gaming font-bold text-sm text-white group-hover:text-neon-blue transition-colors line-clamp-2 mb-2 flex-1">{article.title}</h3>
        <p className="text-text-muted text-xs font-body line-clamp-2 mb-3">{article.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-text-muted font-body pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <img src={article.author_avatar} alt="" className="w-5 h-5 rounded-full border border-white/10" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1"><Eye size={10} />{(article.views / 1000).toFixed(1)}k</span>
            <span>{timeAgo(article.published_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function News() {
  const { articles, loading } = useGame();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = activeCategory === 'All' ? articles : articles.filter(a => a.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.tags?.some(t => t.toLowerCase().includes(q)));
    }
    return list;
  }, [articles, activeCategory, search]);

  const featured = filtered.find(a => a.featured) || filtered[0];
  const rest = featured ? filtered.filter(a => a.id !== featured.id) : filtered;

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Banner */}
      <div className="relative overflow-hidden py-16"
        style={{ background: 'linear-gradient(135deg, rgba(0,207,255,0.06) 0%, rgba(122,92,255,0.06) 100%)', borderBottom: '1px solid rgba(0,207,255,0.1)' }}>
        <div className="bg-gaming-grid absolute inset-0 opacity-30" />
        <div className="glow-orb-blue w-80 h-80 -top-40 -left-20" />
        <div className="container-gaming relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Newspaper size={20} className="text-neon-blue" />
            <span className="text-neon-blue text-sm font-semibold font-body tracking-wider uppercase">Gaming News</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-gaming font-black gradient-text mb-3">Latest Updates</h1>
          <p className="text-text-secondary font-body max-w-lg">Breaking news, patch notes, tournament coverage, and exclusive leaks for eFootball and PUBG.</p>
        </div>
      </div>

      <div className="container-gaming py-10">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search articles, topics, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-gaming pl-10 h-11"
            />
          </div>
          <div className="flex items-center gap-1 text-text-muted text-sm font-body">
            <Filter size={15} />
            <span>{filtered.length} articles</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-5">
            <div className="h-64 skeleton rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <div key={i} className="h-72 skeleton rounded-xl" />)}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper size={48} className="mx-auto text-text-muted mb-4" />
            <h3 className="text-xl font-gaming font-bold text-text-secondary mb-2">No Articles Found</h3>
            <p className="text-text-muted font-body">Try a different search term or category.</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="btn-secondary mt-4 text-sm">Clear Filters</button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory + search} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Featured Article */}
              {featured && (
                <div className="mb-8">
                  <ArticleCardLarge article={featured} />
                </div>
              )}

              {/* Articles Grid */}
              {rest.length > 0 && (
                <div className="cards-grid-3">
                  {rest.map((article, i) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <ArticleCard article={article} />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Load More Placeholder */}
              <div className="text-center mt-10">
                <button className="btn-secondary px-8 py-3 text-sm">
                  Load More Articles
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
