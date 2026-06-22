// src/pages/Giveaways.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Trophy, Users, CheckCircle, Clock, Sparkles, MessageCircle } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import CountdownTimer from '../components/CountdownTimer';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { PAST_WINNERS } from '../services/gameData';

const TwitterIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3v6Z" />
  </svg>
);

const InstagramIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

function GiveawayCard({ giveaway, index }) {
  const { user, openAuth } = useAuth();
  const [entered, setEntered] = useState(false);
  const progressPct = Math.min((giveaway.entries / giveaway.max_entries) * 100, 100);

  const reqIcons = {
    'Twitter': <TwitterIcon size={12} />, 'YouTube': <YoutubeIcon size={12} />,
    'Instagram': <InstagramIcon size={12} />, 'Discord': <MessageCircle size={12} />,
  };

  const handleEnter = () => {
    if (!user) { openAuth('register'); return; }
    setEntered(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="gaming-card overflow-hidden"
      style={{ border: entered ? '1px solid rgba(0,255,153,0.4)' : undefined }}
    >
      {/* Prize Image */}
      <div className="relative h-48 overflow-hidden">
        <img src={giveaway.image} alt={giveaway.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #151515 10%, transparent 60%)' }} />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="badge-green font-gaming text-xs">🎁 LIVE</span>
          {giveaway.badge && (
            <span className={`badge-${giveaway.badge === 'HOT' ? 'red' : giveaway.badge === 'ENDING SOON' ? 'red' : 'blue'} text-xs`}>{giveaway.badge}</span>
          )}
        </div>
        <div className="absolute bottom-3 right-3">
          <div className="px-3 py-1.5 rounded-lg font-gaming font-bold text-sm"
            style={{ background: 'rgba(0,255,153,0.15)', border: '1px solid rgba(0,255,153,0.4)', color: '#00FF99' }}>
            ${giveaway.prize_value} VALUE
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-gaming font-bold text-white text-base mb-2 line-clamp-1">{giveaway.title}</h3>
        <p className="text-text-muted text-sm font-body line-clamp-2 mb-4">{giveaway.description}</p>

        {/* Countdown */}
        <div className="mb-4">
          <p className="text-xs text-text-muted font-body mb-2 flex items-center gap-1"><Clock size={11} />Ends in:</p>
          <CountdownTimer endDate={giveaway.ends_at} />
        </div>

        {/* Entry Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-body mb-1.5">
            <span className="text-text-muted flex items-center gap-1"><Users size={10} />{giveaway.entries.toLocaleString()} entries</span>
            <span className="text-text-muted">{giveaway.max_entries.toLocaleString()} max</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #00CFFF, #00FF99)' }}
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-text-secondary font-body mb-2">Entry Requirements:</p>
          <div className="space-y-1.5">
            {giveaway.requirements.map((req, i) => {
              const icon = Object.entries(reqIcons).find(([k]) => req.includes(k))?.[1] || <CheckCircle size={12} />;
              return (
                <div key={i} className="flex items-start gap-2 text-xs font-body text-text-muted">
                  <span className={`shrink-0 mt-0.5 ${entered ? 'text-neon-green' : 'text-neon-blue'}`}>{entered ? <CheckCircle size={12} /> : icon}</span>
                  {req}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        {entered ? (
          <div className="w-full py-3 rounded-lg text-center text-sm font-semibold font-body"
            style={{ background: 'rgba(0,255,153,0.15)', border: '1px solid rgba(0,255,153,0.4)', color: '#00FF99' }}>
            ✓ You're Entered! Good Luck 🎉
          </div>
        ) : (
          <button onClick={handleEnter} className="btn-green w-full py-3 text-sm">
            Enter Giveaway — Free!
          </button>
        )}
      </div>
    </motion.div>
  );
}

function WinnerCard({ winner }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-4 p-4 gaming-card"
    >
      <img src={winner.avatar} alt="" className="w-11 h-11 rounded-full border-2 border-neon-green/40 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm font-body text-white">{winner.username}</p>
        <p className="text-xs text-neon-green font-body">Won: {winner.prize}</p>
      </div>
      <div className="text-xs text-text-muted font-body shrink-0">{winner.date}</div>
    </motion.div>
  );
}

export default function Giveaways() {
  const { giveaways, loading } = useGame();
  const active = giveaways.filter(g => g.status === 'active');

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden py-24"
        style={{ background: 'linear-gradient(135deg, rgba(0,255,153,0.05) 0%, rgba(0,207,255,0.05) 50%, rgba(122,92,255,0.05) 100%)' }}>
        <div className="bg-gaming-grid absolute inset-0 opacity-40" />
        <ParticleBackground count={30} />

        {/* Glow Orbs */}
        <div className="glow-orb-blue w-80 h-80 top-0 -left-20" />
        <div className="glow-orb-purple w-64 h-64 bottom-0 right-0" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0,255,153,0.04) 0%, transparent 70%)' }} />

        <div className="container-gaming relative z-10 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 animate-float"
              style={{ background: 'rgba(0,255,153,0.1)', border: '1px solid rgba(0,255,153,0.3)', boxShadow: '0 0 30px rgba(0,255,153,0.15)' }}>
              <Gift size={36} className="text-neon-green" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-gaming font-black mb-4"
          >
            <span className="gradient-text-green">Win Premium</span>
            <br />
            <span className="text-white">Gaming Rewards</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-text-secondary font-body max-w-xl mx-auto mb-8"
          >
            Join thousands of gamers competing for exclusive eFootball accounts, PUBG items, gift cards, and more — completely free to enter!
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {[
              { icon: '🎁', label: `${active.length} Active Giveaways`, color: '#00FF99' },
              { icon: '👥', label: '5,000+ Total Entries', color: '#00CFFF' },
              { icon: '🏆', label: '4 Past Winners', color: '#7A5CFF' },
            ].map(({ icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold font-body"
                style={{ background: `${color}10`, border: `1px solid ${color}30`, color }}>
                {icon} {label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Active Giveaways */}
      <section className="section-padding container-gaming">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={22} className="text-neon-green" />
          <h2 className="section-title gradient-text-green">Active Giveaways</h2>
          <span className="badge-green ml-2">{active.length} LIVE</span>
        </div>

        {loading ? (
          <div className="cards-grid-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-[500px] skeleton rounded-xl" />)}
          </div>
        ) : active.length === 0 ? (
          <div className="text-center py-16">
            <Gift size={48} className="mx-auto text-text-muted mb-4" />
            <p className="text-text-secondary font-body">No active giveaways right now. Check back soon!</p>
          </div>
        ) : (
          <div className="cards-grid-3">
            {active.map((g, i) => <GiveawayCard key={g.id} giveaway={g} index={i} />)}
          </div>
        )}
      </section>

      {/* Rules Section */}
      <section className="section-padding" style={{ background: 'rgba(0,207,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="container-gaming max-w-3xl mx-auto">
          <h2 className="section-title gradient-text text-center mb-8">Giveaway Rules</h2>
          <div className="cards-grid-2" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {[
              { num: '01', rule: 'Must complete all entry requirements listed on each giveaway card.' },
              { num: '02', rule: 'One entry per person. Multiple accounts will result in disqualification.' },
              { num: '03', rule: 'Winners are selected randomly and announced on our social media channels.' },
              { num: '04', rule: 'Winners must claim their prize within 48 hours of announcement.' },
              { num: '05', rule: 'Gamezeweno reserves the right to cancel giveaways for violation of terms.' },
              { num: '06', rule: 'Prizes are non-transferable and cannot be exchanged for cash.' },
            ].map(({ num, rule }) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex gap-4 p-4 gaming-card"
              >
                <span className="font-gaming font-black text-2xl shrink-0 neon-text-blue">{num}</span>
                <p className="text-text-secondary text-sm font-body leading-relaxed">{rule}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Winners */}
      <section className="section-padding container-gaming">
        <div className="flex items-center gap-2 mb-6">
          <Trophy size={22} className="text-yellow-400" />
          <h2 className="section-title text-white">Past <span className="gradient-text">Winners</span></h2>
        </div>
        <div className="cards-grid-3 mb-8">
          {PAST_WINNERS.map(winner => <WinnerCard key={winner.id} winner={winner} />)}
        </div>

        {/* Join CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center p-10 rounded-2xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(0,255,153,0.06), rgba(0,207,255,0.06))', border: '1px solid rgba(0,255,153,0.15)' }}
        >
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(0,255,153,0.08) 0%, transparent 60%)' }} />
          <div className="relative z-10">
            <Trophy size={48} className="mx-auto mb-4 text-yellow-400" style={{ filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.4))' }} />
            <h3 className="text-2xl font-gaming font-bold gradient-text-green mb-2">You Could Be Next!</h3>
            <p className="text-text-secondary font-body mb-6">Enter all active giveaways for maximum chances of winning.</p>
            <a href="#top" className="btn-green inline-flex px-8 py-3" onClick={() => window.scrollTo(0, 0)}>
              Enter All Giveaways Now
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
