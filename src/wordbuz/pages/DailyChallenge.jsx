import React, { useEffect } from 'react';
import { Trophy, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PuzzlePlayer from '../components/PuzzlePlayer';
import { usePuzzles } from '../context/PuzzleContext';
import PageCard from '../components/PageCard';

const DailyChallenge = () => {
  const { user } = useAuth();
  const { isSolved, loadDailyChallenge } = usePuzzles();

  useEffect(() => {
    loadDailyChallenge();
  }, []);

  if (!user) {
    return (
      <div className="empty-state animate-fade-in" style={{ minHeight: '60vh', justifyContent: 'center' }}>
        <Trophy size={64} style={{ color: 'var(--accent-amber)', marginBottom: '1rem' }} />
        <h2>Fadlan Soo Gal</h2>
        <p className="text-secondary max-w-sm">Si aad uga qayb gasho tartanka maalinlaha ah, fadlan akoonkaaga soo gal.</p>
      </div>
    );
  }

  return (
    <PageCard className="animate-fade-in" >
      <div className="page-header text-center mb-xl">
        <div className="badge badge-amber mb-md">
          <Star size={14} className="mr-2 inline" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Abaalmarin: $10.00
        </div>
        <h1>Tartanka Maanta</h1>
        <p className="text-secondary text-lg">Hal fursad. Hal jawaab. Hal guuleyste.</p>
      </div>

      <div className="grid-4 mb-xl">
        {[
          { label: 'Waqtiga Haray', value: '14:23:05', icon: <Clock size={24} />, color: 'blue' },
          { label: 'Ciyaartoyda', value: '847', icon: <Users size={24} />, color: 'cyan' },
          { label: 'Dhibcaha', value: '+50', icon: <Star size={24} />, color: 'amber' },
          { label: 'Heerka', value: 'Adag', icon: <Trophy size={24} />, color: 'red' },
        ].map((stat, i) => (
          <div key={i} className="glass-card text-center" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div className={`stat-card-icon ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="stat-card-value" style={{ fontSize: '1.75rem' }}>{stat.value}</div>
            <div className="stat-card-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <PuzzlePlayer />
      
      {isSolved && (
        <div className="text-center mt-xl">
          <button className="btn btn-secondary">
            Arag Hogaanka <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </button>
        </div>
      )}
    </PageCard>
  );
};

export default DailyChallenge;
