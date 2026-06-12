import React, { useState } from 'react';
import { Brain, Zap, Target, ArrowRight, ArrowLeft } from 'lucide-react';
import PageCard from '../components/PageCard';
import PuzzlePlayer from '../components/PuzzlePlayer';
import { usePuzzles } from '../context/PuzzleContext';

const FreePlay = () => {
  const { loadFreePlay } = usePuzzles();
  const [isPlaying, setIsPlaying] = useState(false);

  const startPlaying = (difficulty) => {
    loadFreePlay(difficulty);
    setIsPlaying(true);
  };

  if (isPlaying) {
    return (
      <PageCard className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button 
          onClick={() => setIsPlaying(false)}
          className="btn btn-ghost mb-lg"
        >
          <ArrowLeft size={20} /> Ka laabo
        </button>
        <PuzzlePlayer />
      </PageCard>
    );
  }

  const difficulties = [
    { 
      id: 'Fudud', 
      icon: <Brain size={32} />, 
      reward: '+5 Dhibcood', 
      desc: 'Hal-xiraalayaal fudud oo kugu tababaraya fikirka degdega ah.',
      time: '10–30 ilbiriqsi',
      color: 'green'
    },
    { 
      id: 'Dhexdhexaad', 
      icon: <Zap size={32} />, 
      reward: '+10 Dhibcood', 
      desc: 'Maskax tuujin dhexdhexaad ah. Xoogaa fikir ah ayay u baahanyihiin.',
      time: '1–2 daqiiqo',
      color: 'blue'
    },
    { 
      id: 'Adag', 
      icon: <Target size={32} />, 
      reward: '+20 Dhibcood', 
      desc: 'Kaliya dadka caqliga badan ayaa xalin kara. Diyaar ma u tahay?',
      time: '3+ daqiiqo',
      color: 'red'
    }
  ];

  return (
    <PageCard className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="page-header text-center mb-xl">
          <h1>Ciyaar Xor ah</h1>
          <p className="text-secondary text-lg max-w-xl" style={{ margin: '0 auto' }}>
            Dooro adkaanshaha, maskaxda tuuji, oo ururso dhibco aan xad lahayn.
          </p>
        </div>

        <div className="grid-3">
          {difficulties.map((diff) => (
            <div 
              key={diff.id}
              onClick={() => startPlaying(diff.id)}
              className={`glass-card glow-${diff.color}`}
              style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', padding: '2rem' }}
            >
              <div className={`stat-card-icon ${diff.color}`} style={{ width: '64px', height: '64px', marginBottom: '1.5rem' }}>
                {diff.icon}
              </div>
              <h3 className="mb-sm">{diff.id}</h3>
              <p className="text-secondary mb-lg flex-1">{diff.desc}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem' }}>
                <div className="flex-between">
                  <span className="text-muted text-xs uppercase font-bold">Abaalmarin</span>
                  <span className={`text-accent-${diff.color} font-bold`}>{diff.reward}</span>
                </div>
                <div className="flex-between">
                  <span className="text-muted text-xs uppercase font-bold">Qiyaas</span>
                  <span className="text-main font-bold">{diff.time}</span>
                </div>
              </div>

              <div className={`text-accent-${diff.color} text-sm font-bold flex align-center mt-auto`} style={{ display: 'flex', alignItems: 'center' }}>
                Gali Hada <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
              </div>
            </div>
          ))}
        </div>
      </PageCard>
  );
};

export default FreePlay;
