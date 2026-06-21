// src/pages/AccountDetail.jsx
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Shield, Zap, CheckCircle, ShoppingBag, User, Trophy, Clock } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';

export default function AccountDetail() {
  const { id } = useParams();
  const { getAccountById, accounts, loading } = useGame();
  const { user, openAuth } = useAuth();
  const navigate = useNavigate();
  const account = getAccountById(id);
  const similar = accounts.filter(a => a.id !== id && a.game === account?.game).slice(0, 3);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (loading) return (
    <div className="min-h-screen pt-24 container-gaming">
      <div className="h-96 skeleton rounded-xl mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-12 skeleton rounded" />)}</div>
        <div className="h-64 skeleton rounded-xl" />
      </div>
    </div>
  );

  if (!account) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-gaming font-bold text-text-secondary mb-4">Account Not Found</h2>
        <Link to="/gamezeweno/accounts" className="btn-secondary">← Back to Marketplace</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <img src={account.image} alt={account.title} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.4), rgba(10,10,10,1))' }} />
        <div className="absolute bottom-6 left-0 right-0 container-gaming">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-white text-sm font-body mb-3 transition-colors">
            <ArrowLeft size={15} /> Back to Marketplace
          </button>
          <div className="flex flex-wrap gap-2">
            <span className={`badge-${account.game === 'PUBG' ? 'purple' : 'blue'}`}>{account.game}</span>
            {account.verified && <span className="badge-green">✓ Verified</span>}
            {account.badge && <span className={`badge-${account.badge === 'HOT' ? 'red' : account.badge === 'RARE' ? 'purple' : 'blue'} font-gaming`}>{account.badge}</span>}
          </div>
        </div>
      </div>

      <div className="container-gaming py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-gaming font-black text-white mb-3">{account.title}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(account.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'} />
                  ))}
                  <span className="ml-1 text-text-secondary font-body">{account.rating} rating</span>
                </div>
                <span className="text-text-muted font-body">{account.seller_sales} sold</span>
              </div>
            </div>

            <p className="text-text-secondary font-body leading-relaxed">{account.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { icon: <Trophy size={20} />, label: 'Account Level', value: `Level ${account.level}`, color: '#00CFFF' },
                { icon: <Star size={20} />, label: 'Rating', value: `${account.rating}/5.0`, color: '#FFD700' },
                { icon: <ShoppingBag size={20} />, label: 'Times Sold', value: `${account.seller_sales}x`, color: '#7A5CFF' },
              ].map(({ icon, label, value, color }) => (
                <div key={label} className="gaming-card p-4 text-center">
                  <div className="flex justify-center mb-2" style={{ color }}>{icon}</div>
                  <div className="font-gaming font-bold text-lg" style={{ color }}>{value}</div>
                  <div className="text-text-muted text-xs font-body">{label}</div>
                </div>
              ))}
            </div>

            {/* Rare Items */}
            <div className="gaming-card p-5">
              <h3 className="font-gaming font-bold text-white mb-4 flex items-center gap-2"><Star size={16} className="text-yellow-400" />Rare Items & Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {account.rare_items.map(item => (
                  <div key={item} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.12)' }}>
                    <CheckCircle size={14} className="text-neon-green shrink-0" />
                    <span className="text-sm font-body" style={{ color: '#FFD700' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: <Shield size={18} />, label: 'Secure Purchase', desc: '100% money-back guarantee', color: '#00FF99' },
                { icon: <Zap size={18} />, label: 'Instant Delivery', desc: 'Account access within minutes', color: '#00CFFF' },
                { icon: <CheckCircle size={18} />, label: 'Verified Seller', desc: `${account.seller} • ${account.seller_rating}★`, color: '#7A5CFF' },
              ].map(({ icon, label, desc, color }) => (
                <div key={label} className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
                  <span style={{ color }}>{icon}</span>
                  <div>
                    <p className="text-xs font-semibold font-body" style={{ color }}>{label}</p>
                    <p className="text-xs text-text-muted font-body">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Card */}
          <div className="lg:col-span-1">
            <div className="gaming-card p-6 sticky top-20"
              style={{ border: '1px solid rgba(0,207,255,0.2)', boxShadow: '0 0 30px rgba(0,207,255,0.05)' }}>
              <div className="text-center mb-6">
                <div className="price-tag text-4xl mb-1">${account.price}</div>
                <span className="text-text-muted text-sm font-body">USD — One-time payment</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm font-body text-text-secondary">
                  <CheckCircle size={14} className="text-neon-green shrink-0" /> Full account access
                </div>
                <div className="flex items-center gap-2 text-sm font-body text-text-secondary">
                  <CheckCircle size={14} className="text-neon-green shrink-0" /> Email & password transfer
                </div>
                <div className="flex items-center gap-2 text-sm font-body text-text-secondary">
                  <CheckCircle size={14} className="text-neon-green shrink-0" /> 24h support included
                </div>
                <div className="flex items-center gap-2 text-sm font-body text-text-secondary">
                  <CheckCircle size={14} className="text-neon-green shrink-0" /> Refund if not as described
                </div>
              </div>

              <button
                onClick={() => !user && openAuth('login')}
                className="btn-primary w-full py-4 text-base mb-3"
              >
                <span className="flex items-center gap-2 justify-center">
                  <ShoppingBag size={18} /> {user ? 'Purchase Now' : 'Sign In to Purchase'}
                </span>
              </button>
              <button className="btn-secondary w-full py-3 text-sm">Contact Seller</button>

              <div className="mt-4 p-3 rounded-lg text-xs text-text-muted font-body text-center"
                style={{ background: 'rgba(0,255,153,0.05)', border: '1px solid rgba(0,255,153,0.1)' }}>
                🔒 Secure payment processing
              </div>

              {/* Seller Info */}
              <div className="mt-5 pt-5 border-t border-white/5">
                <p className="text-xs text-text-muted font-body mb-2">Seller Information</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(0,207,255,0.15)', color: '#00CFFF', border: '1px solid rgba(0,207,255,0.3)' }}>
                    {account.seller[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white font-body">{account.seller}</p>
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-text-muted font-body">{account.seller_rating} • {account.seller_sales} sales</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Accounts */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="section-title gradient-text mb-5">Similar Accounts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {similar.map(acc => (
                <Link key={acc.id} to={`/accounts/${acc.id}`} className="group gaming-card overflow-hidden block">
                  <div className="h-36 overflow-hidden">
                    <img src={acc.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-sm font-body text-white group-hover:text-neon-blue transition-colors line-clamp-1 mb-1">{acc.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="price-tag text-lg">${acc.price}</span>
                      <span className="badge-blue text-xs">Lvl {acc.level}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
