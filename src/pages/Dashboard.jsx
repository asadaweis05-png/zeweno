import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AdUnit from '../components/common/AdUnit';
import {
  Flame, Dumbbell, Heart, BookOpen, StickyNote, Brain, Salad,
  TrendingUp, ArrowRight, Footprints,
} from 'lucide-react';
import { calculateBMR, calculateTDEE, calculateStreak } from '../utils/calculations';

export default function Dashboard() {
  const {
    profile, todayCalories, workoutDates,
    todaySteps,
  } = useApp();

  const bmr = calculateBMR(profile.gender, profile.weight, profile.height, profile.age);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const streak = calculateStreak(workoutDates);
  const calorieGoal = profile.goal === 'lose' ? tdee - 500 : profile.goal === 'gain' ? tdee + 400 : tdee;

  const modules = [
    { to: '/vitalflow/calories', icon: Flame, title: 'Calories', desc: `${todayCalories} / ${calorieGoal} kcal`, color: 'cyan' },
    { to: '/vitalflow/gym', icon: Dumbbell, title: 'Workout', desc: `${streak} Day Streak`, color: 'purple' },
    { to: '/vitalflow/health', icon: Heart, title: 'Health', desc: 'Monitor Vitals', color: 'pink' },
    { to: '/vitalflow/learning', icon: BookOpen, title: 'Learning', desc: 'Summarize Content', color: 'blue' },
    { to: '/vitalflow/notes', icon: StickyNote, title: 'Notes', desc: 'Secure Thoughts', color: 'amber' },
    { to: '/vitalflow/flashcards', icon: Brain, title: 'Study', desc: 'Master Skills', color: 'purple' },
    { to: '/vitalflow/diet-ai', icon: Salad, title: 'Diet AI', desc: 'Personalized Plans', color: 'cyan' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Welcome back{profile.name ? `, ${profile.name}` : ''}</h1>
        <p className="text-secondary">Track your progress and achieve your goals today.</p>
      </div>

      {/* Ad 1 — After header */}
      <AdUnit format="horizontal" className="ad-dashboard" />

      <div className="grid-stats">
        <div className="glass-card stat-card glow-cyan">
          <div className="stat-card-icon cyan"><Flame size={20} /></div>
          <div className="stat-card-label">Daily Calories</div>
          <div className="stat-card-value text-gradient">{todayCalories}</div>
          <p className="text-muted" style={{ fontSize: '0.8rem' }}>of {calorieGoal} goal</p>
        </div>
        <div className="glass-card stat-card glow-purple">
          <div className="stat-card-icon purple"><Dumbbell size={20} /></div>
          <div className="stat-card-label">Active Streak</div>
          <div className="stat-card-value" style={{ color: 'var(--accent-purple)' }}>{streak} Days</div>
          <p className="text-muted" style={{ fontSize: '0.8rem' }}>🔥 Burning bright</p>
        </div>
        <div className="glass-card stat-card glow-amber">
          <div className="stat-card-icon amber"><Footprints size={20} /></div>
          <div className="stat-card-label">Step Count</div>
          <div className="stat-card-value" style={{ color: 'var(--accent-amber)' }}>{todaySteps.toLocaleString()}</div>
          <p className="text-muted" style={{ fontSize: '0.8rem' }}>of 10,000 goal</p>
        </div>
      </div>

      {/* Ad 2 — After stats */}
      <AdUnit format="auto" className="ad-dashboard" />

      <div className="section-title mt-xl">
        <TrendingUp size={24} className="text-accent" />
        <h3 style={{ margin: 0 }}>Explore Modules</h3>
      </div>

      <div className="grid-4 mt-md">
        {modules.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link key={i} to={item.to} className={`glass-card glow-${item.color}`}>
              <div className="flex-between mb-md">
                <div className={`stat-card-icon ${item.color}`} style={{ width: '40px', height: '40px', marginBottom: 0 }}>
                  <Icon size={20} />
                </div>
                <ArrowRight size={16} className="text-muted" />
              </div>
              <h4 style={{ marginBottom: '0.25rem' }}>{item.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* Ad 3 — Mid content */}
      <AdUnit format="horizontal" className="ad-dashboard mt-xl" />

      {/* Ad 4 — Page bottom */}
      <AdUnit format="auto" className="ad-page-bottom" />
    </div>
  );
}
