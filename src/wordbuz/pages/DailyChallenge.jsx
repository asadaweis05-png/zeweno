import React, { useEffect, useState } from 'react';
import { Trophy, Clock, Users, Star, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PuzzlePlayer from '../components/PuzzlePlayer';
import { usePuzzles } from '../context/PuzzleContext';
import PageCard from '../components/PageCard';
import Modal from '../../components/common/Modal';

// Helper to request fullscreen lock (anti-cheat)
const requestLock = async () => {
  if (document.documentElement.requestFullscreen) {
    try {
      await document.documentElement.requestFullscreen();
    } catch (e) {
      console.warn('Fullscreen request denied', e);
    }
  }
};

const releaseLock = async () => {
  if (document.exitFullscreen && document.fullscreenElement) {
    try {
      await document.exitFullscreen();
    } catch (e) {
      console.warn('Exit fullscreen failed', e);
    }
  }
};

const DailyChallenge = () => {
  const { user, userProfile, awardDailyPrize } = useAuth();
  const { isSolved, loadDailyChallenge, activePuzzle } = usePuzzles();
  const [timeLeftStr, setTimeLeftStr] = useState('');
  const [showWinModal, setShowWinModal] = useState(false);
  const [prizeAwarded, setPrizeAwarded] = useState(false);

  // Timer to midnight for remaining time stat
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow - now;
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeftStr(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load daily IQ challenge and lock screen on mount
  useEffect(() => {
    if (user) {
      loadDailyChallenge();
      requestLock();
    }
    return () => {
      releaseLock();
    };
  }, [user, loadDailyChallenge]);

  // Award prize once when solved
  useEffect(() => {
    if (isSolved && activePuzzle?.isDaily && !prizeAwarded) {
      const claimPrize = async () => {
        const awarded = await awardDailyPrize(activePuzzle.id);
        if (awarded) {
          setShowWinModal(true);
          setPrizeAwarded(true);
        }
      };
      claimPrize();
    }
  }, [isSolved, activePuzzle, prizeAwarded, awardDailyPrize]);

  if (!user) {
    return (
      <div className="empty-state animate-fade-in" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Trophy size={64} style={{ color: 'var(--accent-amber)', marginBottom: '1rem' }} />
        <h2>Please Sign In</h2>
        <p className="text-secondary max-w-sm" style={{ textAlign: 'center' }}>
          To participate in the Daily IQ Challenge and win cash rewards, please sign in to your account.
        </p>
      </div>
    );
  }

  return (
    <PageCard className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <div className="page-header text-center mb-xl" style={{ marginBottom: '2.5rem' }}>
        <div className="badge badge-amber mb-md" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(255,149,0,0.1)', border: '1px solid rgba(255,149,0,0.3)',
          color: '#FF9500', padding: '6px 16px', borderRadius: '99px',
          fontSize: '0.85rem', fontWeight: 700, fontFamily: 'Orbitron, sans-serif',
          marginBottom: '1rem',
        }}>
          <Trophy size={14} /> $2.00 CASH PRIZE
        </div>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', color: '#fff' }}>
          Daily IQ Challenge
        </h1>
        <p className="text-secondary text-lg" style={{ color: '#A0A0A0', fontSize: '1.1rem' }}>
          One attempt. One answer. One daily reward.
        </p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid-4 mb-xl" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Time Remaining', value: timeLeftStr || '23:59:59', icon: <Clock size={24} />, color: 'blue' },
          { label: 'Active Players', value: '1,482', icon: <Users size={24} />, color: 'cyan' },
          { label: 'Reward Points', value: `+${activePuzzle?.points || 40}`, icon: <Star size={24} />, color: 'amber' },
          { label: 'Security Lock', value: 'ACTIVE', icon: <ShieldCheck size={24} />, color: 'green' },
        ].map((stat, i) => (
          <div key={i} className="glass-card text-center" style={{ background: '#151515', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div className={`stat-card-icon ${stat.color}`} style={{ color: stat.color === 'blue' ? '#00CFFF' : stat.color === 'cyan' ? '#00FFFF' : stat.color === 'amber' ? '#FF9500' : '#00FF99' }}>
              {stat.icon}
            </div>
            <div className="stat-card-value" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{stat.value}</div>
            <div className="stat-card-label" style={{ color: '#606060', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Puzzle Player with Anti-Cheat UI */}
      <PuzzlePlayer />

      {/* Rules Information */}
      <div style={{
        marginTop: '2.5rem', background: '#151515', border: '1px solid #1E1E1E',
        borderRadius: '12px', padding: '1.5rem',
      }}>
        <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={16} style={{ color: '#00CFFF' }} /> Challenge Integrity Rules
        </h4>
        <ul style={{ color: '#A0A0A0', fontSize: '0.85rem', paddingLeft: '1.25rem', lineHeight: 1.7 }}>
          <li>Fullscreen lock will automatically activate to prevent secondary tab lookups.</li>
          <li>Right-click, copy, cut, and paste actions are disabled within the puzzle frame.</li>
          <li>Leaving the puzzle window or switching tabs triggers an anti-cheat warning.</li>
          <li>Accumulating 3 warnings results in instant forfeiture of today's reward.</li>
        </ul>
      </div>

      <Modal isOpen={showWinModal} onClose={() => setShowWinModal(false)} title="🎉 Congratulations!">
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <Trophy size={56} style={{ color: '#FFD700', marginBottom: '1rem', filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.4))' }} />
          <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
            Challenge Solved!
          </h3>
          <p style={{ color: '#A0A0A0', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            You successfully solved today's Daily IQ Challenge and won <strong style={{ color: '#00FF99' }}>$2.00 Cash</strong>! 
            The prize has been credited to your balance.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ color: '#606060', fontSize: '12px', marginBottom: '0.5rem' }}>Winner Account Email:</p>
            <p style={{ color: '#00CFFF', fontWeight: 700, fontSize: '14px' }}>{userProfile?.email || 'N/A'}</p>
          </div>
          <a 
            href="https://wa.me/252614581004" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '0.75rem 2rem', fontWeight: 700, textDecoration: 'none',
              background: 'linear-gradient(135deg, #00FF99, #00CFFF)', color: '#0A0A0A',
              border: 'none', borderRadius: '8px', cursor: 'pointer',
            }}
          >
            Claim payout via WhatsApp
          </a>
        </div>
      </Modal>
    </PageCard>
  );
};

export default DailyChallenge;
