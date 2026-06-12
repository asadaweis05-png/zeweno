import React, { useState } from 'react';
import { Users, Star, Trophy, Bell, Flame, Target, LogOut, CheckCircle2, Copy, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePuzzles } from '../context/PuzzleContext';

const Profile = () => {
  const { user, userProfile, logout } = useAuth();
  const { isSolved } = usePuzzles();
  const [copied, setCopied] = useState(false);

  const copyReferral = () => {
    const url = `${window.location.origin}/wordbuz?ref=${userProfile?.referral_code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!userProfile) {
    return (
      <div className="empty-state animate-fade-in" style={{ minHeight: '60vh', justifyContent: 'center' }}>
        <Users size={64} className="text-muted" />
        <h2>Profile</h2>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const stats = [
    { label: 'Dhibcaha', value: userProfile?.points || 0, icon: <Star size={24} />, color: 'cyan' },
    { label: 'Joogtaynta', value: `${userProfile?.streak || 0} Cisho`, icon: <Flame size={24} />, color: 'amber' },
    { label: 'Saxsanaanta', value: `${userProfile?.accuracy || 0}%`, icon: <Target size={24} />, color: 'blue' },
    { label: 'La Xaliyay', value: userProfile?.total_attempts || 0, icon: <Trophy size={24} />, color: 'purple' },

  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Profile Header */}
      <div className="glass-card mb-xl flex-between" style={{ padding: '2.5rem', flexWrap: 'wrap', gap: '2rem' }}>
        <div className="flex" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-deep)', border: '2px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
            {userProfile?.username?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{userProfile?.username || 'Ciyaartoy'}</h1>
            <p className="text-secondary">{user.email}</p>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="btn btn-secondary"
          style={{ color: 'var(--accent-red)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
        >
          <LogOut size={18} /> Ka Bax
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid-4 mb-xl">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card stat-card" style={{ padding: '1.5rem' }}>
            <div className={`stat-card-icon ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="stat-card-value" style={{ fontSize: '2rem' }}>{stat.value}</div>
            <div className="stat-card-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Achievements */}
        <div className="glass-card">
          <div className="section-title">
            <Trophy className="text-accent-amber" size={24}/>
            Guulaha (Badges)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="list-item" style={{ background: 'var(--bg-deep)' }}>
              <div className="stat-card-icon amber" style={{ marginBottom: '0', width: '40px', height: '40px' }}>
                <Flame size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>Bilowga Kulul</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Xali hal-xiraalaha 3 cisho oo xiriir ah.</div>
              </div>
            </div>
            <div className="list-item" style={{ opacity: '0.5', background: 'var(--bg-deep)' }}>
              <div className="stat-card-icon blue" style={{ marginBottom: '0', width: '40px', height: '40px', filter: 'grayscale(1)' }}>
                <Target size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>Maskax Furan</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Gaar 90% saxsanaan bishan.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Referrals */}
        <div className="glass-card glow-cyan" style={{ border: '1px solid var(--accent-cyan)' }}>
          <div className="section-title">
            <Gift className="text-accent-cyan" size={24}/>
            Casuum Saaxiibadaa
          </div>
          <p className="text-secondary mb-lg">
            Wadaag linkigaaga. Qof kasta oo ku soo biira, waxaad helaysaa <strong style={{ color: 'var(--accent-cyan)' }}>50 dhibcood</strong> oo bilaash ah!
          </p>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <div className="form-input" style={{ flex: '1', fontFamily: 'monospace', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', background: 'var(--bg-deep)' }}>
              {window.location.origin}/wordbuz?ref={userProfile?.referral_code}
            </div>
            <button 
              onClick={copyReferral}
              className="btn btn-primary btn-icon"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
            </button>
          </div>

          <div className="flex-between list-item" style={{ background: 'var(--bg-deep)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
              <Users size={18} className="text-accent-cyan" />
              Dadka aad casuuntay
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{userProfile?.referrals || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
