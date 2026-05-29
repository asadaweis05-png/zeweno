import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AdUnit from '../components/common/AdUnit';
import {
  BookOpen, StickyNote, Brain, Sparkles, Target, TrendingUp, ArrowRight, Zap,
  GraduationCap
} from 'lucide-react';

const examsUrl = import.meta.env.VITE_EXAMS_URL || 'https://exams.zeweno.com';

export default function StudyDashboard() {
  const { savedContent, notes, flashDecks } = useApp();

  const totalDecks = flashDecks.length;
  const totalCards = flashDecks.reduce((sum, d) => sum + (d.cards?.length || 0), 0);
  const totalNotes = notes.length;
  const totalContent = savedContent.length;

  const modules = [
    {
      to: '/studyflow',
      icon: BookOpen,
      title: 'Learning Hub',
      desc: `${totalContent} saved articles`,
      color: 'blue',
      tag: 'AI Summarize'
    },
    {
      to: '/studyflow/notes',
      icon: StickyNote,
      title: 'Smart Notes',
      desc: `${totalNotes} notes saved`,
      color: 'amber',
      tag: 'Rich Editor'
    },
    {
      to: '/studyflow/flashcards',
      icon: Brain,
      title: 'Flash Cards',
      desc: `${totalDecks} decks • ${totalCards} cards`,
      color: 'purple',
      tag: 'Spaced Repetition'
    },
    {
      to: examsUrl,
      icon: GraduationCap,
      title: 'Exams Portal',
      desc: 'Take interactive quizzes and mock exams',
      color: 'cyan',
      tag: 'Exam Simulators',
      isExternal: true
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="study-hero-banner">
        <div className="study-hero-glow"></div>
        <div className="study-hero-content">
          <div className="study-hero-badge">
            <Zap size={14} />
            AI-Powered Study
          </div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            StudyFlow OS
          </h1>
          <p className="text-secondary" style={{ fontSize: '1.05rem' }}>
            Your intelligent learning workspace. Summarize, note, and master any topic.
          </p>
        </div>
        <div className="study-hero-decoration">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <Brain size={80} style={{ opacity: 0.08, position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%) rotate(15deg)' }} />
        </div>
      </div>

      {/* Ad */}
      <AdUnit format="horizontal" className="ad-dashboard" />

      {/* Stats */}
      <div className="grid-stats mt-lg">
        <div className="glass-card stat-card glow-blue">
          <div className="stat-card-icon blue"><BookOpen size={20} /></div>
          <div className="stat-card-value text-gradient">{totalContent}</div>
          <div className="stat-card-label">Saved Articles</div>
        </div>
        <div className="glass-card stat-card glow-amber">
          <div className="stat-card-icon amber"><StickyNote size={20} /></div>
          <div className="stat-card-value" style={{ color: 'var(--accent-amber)' }}>{totalNotes}</div>
          <div className="stat-card-label">Notes Written</div>
        </div>
        <div className="glass-card stat-card glow-purple">
          <div className="stat-card-icon purple"><Brain size={20} /></div>
          <div className="stat-card-value" style={{ color: 'var(--accent-purple)' }}>{totalCards}</div>
          <div className="stat-card-label">Flashcards</div>
        </div>
      </div>

      {/* Ad */}
      <AdUnit format="auto" className="ad-dashboard" />

      {/* Modules */}
      <div className="section-title mt-xl">
        <TrendingUp size={24} className="text-accent" />
        <h3 style={{ margin: 0 }}>Study Modules</h3>
      </div>

      <div className="study-module-grid mt-md">
        {modules.map((item, i) => {
          const Icon = item.icon;
          if (item.isExternal) {
            return (
              <a
                key={i}
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                className={`study-module-card glass-card glow-${item.color}`}
              >
                <div className="flex-between mb-md">
                  <div className={`stat-card-icon ${item.color}`} style={{ width: '48px', height: '48px', marginBottom: 0 }}>
                    <Icon size={22} />
                  </div>
                  <ArrowRight size={16} className="text-muted" />
                </div>
                <h3 style={{ marginBottom: '0.25rem', fontSize: '1.1rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{item.desc}</p>
                <span className={`badge badge-${item.color}`}>{item.tag}</span>
              </a>
            );
          }
          return (
            <Link key={i} to={item.to} className={`study-module-card glass-card glow-${item.color}`}>
              <div className="flex-between mb-md">
                <div className={`stat-card-icon ${item.color}`} style={{ width: '48px', height: '48px', marginBottom: 0 }}>
                  <Icon size={22} />
                </div>
                <ArrowRight size={16} className="text-muted" />
              </div>
              <h3 style={{ marginBottom: '0.25rem', fontSize: '1.1rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{item.desc}</p>
              <span className={`badge badge-${item.color}`}>{item.tag}</span>
            </Link>
          );
        })}
      </div>

      {/* Tips */}
      <div className="glass-card mt-xl study-tip-card">
        <div className="flex-between">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="stat-card-icon cyan" style={{ width: '44px', height: '44px' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h4 style={{ marginBottom: '0.25rem' }}>💡 Study Tip</h4>
              <p className="text-secondary" style={{ fontSize: '0.85rem', maxWidth: '500px' }}>
                Use the Pomodoro technique: study for 25 minutes, then take a 5-minute break. 
                Create flashcards immediately after reading to boost retention by up to 80%.
              </p>
            </div>
          </div>
          <Target size={32} style={{ opacity: 0.2, flexShrink: 0 }} />
        </div>
      </div>

      <AdUnit format="auto" className="ad-page-bottom" />
    </div>
  );
}
