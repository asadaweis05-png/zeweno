// src/pages/Profile.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Settings, LogOut, ShoppingBag, Gift, BookOpen, Calendar, Star, Shield, Edit3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';

export default function Profile() {
  const { user, signOut, openAuth } = useAuth();
  const { accounts, giveaways, articles } = useGame();

  if (!user) return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="text-center max-w-sm mx-auto px-4">
        <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.2)' }}>
          <User size={40} className="text-neon-blue" />
        </div>
        <h2 className="text-2xl font-gaming font-bold gradient-text mb-2">Sign In Required</h2>
        <p className="text-text-muted font-body mb-6">Create an account to track your giveaway entries, saved articles, and purchase history.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => openAuth('login')} className="btn-secondary px-6">Sign In</button>
          <button onClick={() => openAuth('register')} className="btn-primary px-6"><span>Register</span></button>
        </div>
      </div>
    </div>
  );

  const joinedDate = new Date(user.joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const stats = [
    { icon: <BookOpen size={18} />, label: 'Articles Read', value: user.articles_read || 12, color: '#00CFFF' },
    { icon: <Gift size={18} />, label: 'Giveaways Entered', value: user.giveaways_entered || 3, color: '#00FF99' },
    { icon: <ShoppingBag size={18} />, label: 'Accounts Owned', value: 0, color: '#7A5CFF' },
    { icon: <Star size={18} />, label: 'Member Since', value: '2026', color: '#FFD700' },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Profile Hero */}
      <div className="relative overflow-hidden py-16"
        style={{ background: 'linear-gradient(135deg, rgba(0,207,255,0.06) 0%, rgba(122,92,255,0.06) 100%)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="bg-gaming-grid absolute inset-0 opacity-30" />
        <div className="glow-orb-blue w-64 h-64 top-0 left-0" />
        <div className="container-gaming relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <img src={user.avatar} alt="" className="w-24 h-24 rounded-2xl border-2"
                style={{ borderColor: 'rgba(0,207,255,0.5)', boxShadow: '0 0 20px rgba(0,207,255,0.2)' }} />
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: '#151515', border: '1px solid rgba(0,207,255,0.3)' }}>
                <Edit3 size={14} className="text-neon-blue" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <h1 className="text-2xl font-gaming font-black text-white">{user.username}</h1>
                <span className="badge-blue text-xs">Gamer</span>
              </div>
              <p className="text-text-muted text-sm font-body">{user.email}</p>
              <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start text-xs text-text-muted font-body">
                <Calendar size={12} />Joined {joinedDate}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
                <Settings size={15} /> Settings
              </button>
              <button onClick={signOut} className="btn-danger text-sm px-4 py-2 flex items-center gap-2">
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-gaming py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map(({ icon, label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="gaming-card p-5 text-center"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}>
                {icon}
              </div>
              <div className="font-gaming font-bold text-xl mb-0.5" style={{ color }}>{value}</div>
              <div className="text-text-muted text-xs font-body">{label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Articles */}
            <div className="gaming-card p-5">
              <h3 className="font-gaming font-bold text-white mb-4 flex items-center gap-2"><BookOpen size={16} className="text-neon-blue" />Recent Articles</h3>
              <div className="space-y-3">
                {articles.slice(0, 4).map(article => (
                  <Link key={article.id} to={`/gamezeweno/news/${article.slug}`} className="group flex gap-3 p-3 rounded-lg hover:bg-white/3 transition-colors">
                    <img src={article.thumbnail} alt="" className="w-14 h-10 object-cover rounded-lg shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold font-body text-text-secondary group-hover:text-white transition-colors line-clamp-1">{article.title}</p>
                      <div className="flex items-center gap-2 text-xs text-text-muted font-body mt-0.5">
                        <span className={`badge-${article.category.includes('PUBG') ? 'purple' : 'blue'} text-xs`}>{article.category}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/gamezeweno/news" className="block text-center mt-3 text-sm text-neon-blue hover:underline font-body">View All News →</Link>
            </div>

            {/* Giveaway Entries */}
            <div className="gaming-card p-5">
              <h3 className="font-gaming font-bold text-white mb-4 flex items-center gap-2"><Gift size={16} className="text-neon-green" />Active Giveaway Entries</h3>
              <div className="space-y-3">
                {giveaways.map(g => (
                  <div key={g.id} className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ background: 'rgba(0,255,153,0.04)', border: '1px solid rgba(0,255,153,0.1)' }}>
                    <img src={g.image} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold font-body text-white line-clamp-1">{g.title}</p>
                      <p className="text-xs text-neon-green font-body">{g.prize_value > 0 ? `$${g.prize_value} Prize` : g.prize}</p>
                    </div>
                    <span className="badge-green text-xs shrink-0">Entered</span>
                  </div>
                ))}
              </div>
              <Link to="/gamezeweno/giveaways" className="block text-center mt-3 text-sm text-neon-green hover:underline font-body">View All Giveaways →</Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Account Info */}
            <div className="gaming-card p-5" style={{ border: '1px solid rgba(0,207,255,0.15)' }}>
              <h4 className="font-gaming font-bold text-sm gradient-text mb-4">Account Details</h4>
              <div className="space-y-3">
                {[
                  { label: 'Username', value: user.username },
                  { label: 'Email', value: user.email },
                  { label: 'Account Type', value: 'Standard Gamer' },
                  { label: 'Status', value: '● Active', valueClass: 'text-neon-green' },
                ].map(({ label, value, valueClass }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-white/4">
                    <span className="text-xs text-text-muted font-body">{label}</span>
                    <span className={`text-xs font-semibold font-body ${valueClass || 'text-white'}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badge */}
            <div className="gaming-card p-5 text-center"
              style={{ background: 'linear-gradient(135deg, rgba(0,207,255,0.05), rgba(122,92,255,0.05))' }}>
              <Shield size={32} className="mx-auto mb-3 text-neon-blue" />
              <h4 className="font-gaming font-bold text-white text-sm mb-1">Verified Member</h4>
              <p className="text-text-muted text-xs font-body">Your account is in good standing. All purchases are protected.</p>
            </div>

            {/* Quick Links */}
            <div className="gaming-card p-5">
              <h4 className="font-gaming font-bold text-sm text-text-secondary mb-3">Quick Links</h4>
              <div className="space-y-2">
                {[
                  { label: '🛒 Browse Accounts', href: '/gamezeweno/accounts' },
                  { label: '🎁 Enter Giveaways', href: '/gamezeweno/giveaways' },
                  { label: '📰 Read News', href: '/gamezeweno/news' },
                ].map(({ label, href }) => (
                  <Link key={href} to={href}
                    className="block px-3 py-2.5 rounded-lg text-sm font-body text-text-muted hover:text-white hover:bg-white/5 transition-all">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
