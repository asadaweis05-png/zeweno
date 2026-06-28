import React, { useState } from 'react';
import { Brain, Zap, Target, ArrowRight, ArrowLeft, BookOpen, Atom, Calculator, Lightbulb } from 'lucide-react';
import PageCard from '../components/PageCard';
import PuzzlePlayer from '../components/PuzzlePlayer';
import { usePuzzles } from '../context/PuzzleContext';
import { CATEGORY_META, CATEGORIES, DIFFICULTIES } from '../data/puzzles';

const FreePlay = () => {
  const { loadFreePlay, activePuzzle } = usePuzzles();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const startPlaying = () => {
    loadFreePlay(selectedCategory, selectedDifficulty);
    setIsPlaying(true);
  };

  const handleBack = () => {
    setIsPlaying(false);
  };

  if (isPlaying && activePuzzle) {
    return (
      <PageCard className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button 
          onClick={handleBack}
          className="btn btn-ghost mb-lg"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '1rem', fontWeight: 600 }}
        >
          <ArrowLeft size={20} /> Back to Setup
        </button>
        <PuzzlePlayer />
      </PageCard>
    );
  }

  const categoryIcons = {
    Math: <Calculator size={24} />,
    Physics: <Zap size={24} />,
    Science: <Atom size={24} />,
    Logic: <Lightbulb size={24} />,
    All: <BookOpen size={24} />,
  };

  const difficultyColors = {
    Easy: '#00FF99',
    Medium: '#00CFFF',
    Hard: '#FF4444',
    All: '#A0A0A0',
  };

  return (
    <PageCard className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <div className="page-header text-center mb-xl" style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem', background: 'linear-gradient(135deg, #00CFFF, #7A5CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          IQ & Knowledge Puzzles
        </h1>
        <p className="text-secondary text-lg max-w-xl" style={{ margin: '0 auto', color: '#A0A0A0', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Choose your field of study and difficulty level to test your intelligence and earn points.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
        {/* Category Selector */}
        <div>
          <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: '#fff', fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} className="text-neon-blue" /> 1. Select Category
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat] || { icon: '📚', color: '#00CFFF', desc: 'All categories combined' };
              const isSelected = selectedCategory === cat;
              return (
                <div
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    background: isSelected ? 'rgba(255,255,255,0.06)' : '#151515',
                    border: isSelected ? `2px solid ${meta.color}` : '2px solid #1E1E1E',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    textAlign: 'center',
                    boxShadow: isSelected ? `0 0 15px ${meta.color}20` : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = '#1E1E1E';
                  }}
                >
                  <div style={{
                    width: '48px', height: '48px',
                    borderRadius: '50%',
                    background: isSelected ? `${meta.color}20` : 'rgba(255,255,255,0.03)',
                    color: meta.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem',
                    transition: 'all 0.2s',
                  }}>
                    {categoryIcons[cat] || <span>{meta.icon}</span>}
                  </div>
                  <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.25rem' }}>{cat === 'All' ? 'All Subjects' : cat}</h4>
                  <p style={{ color: '#606060', fontSize: '11px', lineHeight: 1.4 }}>{meta.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Difficulty Selector */}
        <div>
          <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: '#fff', fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Brain size={20} className="text-neon-purple" /> 2. Select Difficulty
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {DIFFICULTIES.map((diff) => {
              const color = difficultyColors[diff];
              const isSelected = selectedDifficulty === diff;
              return (
                <div
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  style={{
                    background: isSelected ? 'rgba(255,255,255,0.06)' : '#151515',
                    border: isSelected ? `2px solid ${color}` : '2px solid #1E1E1E',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    textAlign: 'center',
                    boxShadow: isSelected ? `0 0 15px ${color}20` : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = '#1E1E1E';
                  }}
                >
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: isSelected ? color : '#606060',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}>
                    {diff === 'All' ? 'Mixed' : diff}
                  </span>
                  <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
                    {diff === 'Easy' && '💡 Easy (+10 pts)'}
                    {diff === 'Medium' && '⚡ Medium (+20 pts)'}
                    {diff === 'Hard' && '🔥 Hard (+40 pts)'}
                    {diff === 'All' && '🎲 All Levels'}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            onClick={startPlaying}
            className="btn btn-primary"
            style={{
              padding: '1rem 3rem',
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 0 30px rgba(0, 207, 255, 0.3)',
              background: 'linear-gradient(135deg, #00CFFF, #7A5CFF)',
              color: '#0A0A0A',
              border: 'none',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 207, 255, 0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 207, 255, 0.3)';
            }}
          >
            Start Playing <ArrowRight size={18} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
          </button>
        </div>
      </div>
    </PageCard>
  );
};

export default FreePlay;
