import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Zap, Play, Trophy, ChevronRight, CheckCircle2, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdUnit from '../components/AdUnit';
import PageCard from '../components/PageCard';
import AuthModal from '../components/AuthModal';

const BASE = '/wordbuz';

const Home = () => {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow - now;
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <PageCard>
      {/* Global Hero */}
      <div className="marketplace-hero global-hero mb-lg" style={{ minHeight: 'auto', padding: '3rem' }}>
        <div className="marketplace-hero-content" style={{ zIndex: 2 }}>
          <div className="marketplace-hero-badge mb-md" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(0, 240, 255, 0.1)', color: 'var(--accent-cyan)', borderRadius: '99px', fontSize: '0.8rem', fontWeight: '600' }}>
            <CheckCircle2 size={14} /> 
            Tartan Cusub 24 Saac Kasta
          </div>
          <h1 className="hero-title">
            Hano Hal-xiraalaha.<br/>
            <span className="text-gradient">La Wareeg Hogaanka.</span>
          </h1>
          <p className="hero-desc">
            Ku biir ciyaartoyda xalinaya hal-xiraalayaasha caqliga u baahan maalin kasta, 
            si aad ugu guuleysato abaalmarino iyo dhibco.
          </p>
          
          {!user && (
            <div className="hero-actions">
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="btn btn-primary btn-lg"
              >
                Bilow Safarkaaga <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
        
        <div className="hero-stats-overlay">
          <div className="floating-bubble bubble-top" style={{ background: 'var(--accent-amber)' }}></div>
          <div className="floating-bubble bubble-bottom" style={{ background: 'var(--accent-purple)' }}></div>
        </div>
      </div>

      <AdUnit slotId="home-premium-mid" />

      {/* Featured Daily Challenge */}
      <div className="marketplace-section mt-xl mb-xl">
        <div className="marketplace-section-header">
          <div className="marketplace-section-title">
            <Zap size={24} />
            Tartanka Maanta
          </div>
        </div>
        
        <div className="glass-card flex-between" style={{ flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ flex: '1 1 300px' }}>
            <div className="badge badge-amber mb-md">
              <Trophy size={14} className="mr-2 inline" /> Abaalmarinta Maanta: $10.00
            </div>
            <h2 className="mb-sm">Ma xalin kartaa Tartanka Maanta?</h2>
            <p className="text-secondary mb-lg">Hal fursad. Hal jawaab. Hal guuleyste maalin kasta.</p>
            
            <div className="flex-between" style={{ justifyContent: 'flex-start', gap: '1rem' }}>
              <div style={{ display: 'flex', marginLeft: '10px' }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-deep)', border: '2px solid var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-10px', zIndex: 4-i, fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-10px', zIndex: 0, fontSize: '0.6rem', fontWeight: 'bold' }}>
                  +84
                </div>
              </div>
              <div className="text-muted text-sm">Waa ay ka qaybgaleen</div>
            </div>
          </div>
          
          <div style={{ background: 'var(--bg-deep)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', minWidth: '250px', border: '1px solid var(--card-border)' }}>
            <div className="text-muted text-xs uppercase font-bold mb-sm">Waqtiga Haray</div>
            <div style={{ fontSize: '2rem', fontFamily: 'monospace', fontWeight: 'bold', marginBottom: '1rem' }}>
              {timeLeft}
            </div>
            <Link to={`${BASE}/daily`} className="btn btn-primary w-full">
              Hada Ciyaar
            </Link>
          </div>
        </div>
      </div>

      {/* Game Modes Grid */}
      <div className="marketplace-section mb-xl">
        <div className="marketplace-section-header">
          <div className="marketplace-section-title">
            <Brain size={24} />
            Qaababka Ciyaarta
          </div>
        </div>
        
        <div className="grid-3">
          <Link to={`${BASE}/free-play`} className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '1.5rem' }}>
            <div className="app-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', marginBottom: '1rem' }}>
              <Play size={24} />
            </div>
            <div className="app-title mb-sm">Ciyaar Xor ah</div>
            <div className="app-description mb-lg flex-1">Dhowr nooc oo adkaansho leh. Halkan ku tababaro oo dhibco ururso wakhti kasta.</div>
            <div className="text-accent text-sm font-bold flex align-center mt-auto" style={{ color: 'var(--accent-blue)' }}>
              Bilow Ciyaarta <ChevronRight size={16} />
            </div>
          </Link>

          <Link to={`${BASE}/leaderboard`} className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '1.5rem' }}>
            <div className="app-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-purple)', marginBottom: '1rem' }}>
              <Trophy size={24} />
            </div>
            <div className="app-title mb-sm">Hogaanka Ciyaarta</div>
            <div className="app-description mb-lg flex-1">Eeg cida ugu dhibcaha badan ama ugu guulaha badan asbuucan.</div>
            <div className="text-accent text-sm font-bold flex align-center mt-auto" style={{ color: 'var(--accent-purple)' }}>
              Eeg Hogaanka <ChevronRight size={16} />
            </div>
          </Link>

          <div className="glass-card glow-cyan" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '1.5rem' }}>
            <div className="app-icon" style={{ background: 'rgba(0, 240, 255, 0.1)', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
              <Users size={24} />
            </div>
            <div className="app-title mb-sm">Casuum & Hel Dhibco</div>
            <div className="app-description mb-lg flex-1">U dir saaxiibadaa linkigaaga si aad u hesho 50 dhibcood oo bilaash ah markay is-diiwaangeliyaan.</div>
            <Link to={`${BASE}/profile`} className="btn btn-secondary btn-sm w-full mt-auto">
              Hel Linkigaaga
            </Link>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </PageCard>
  );
};

export default Home;
