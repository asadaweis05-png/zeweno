import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, Flame, Dumbbell, Heart, BookOpen,
  StickyNote, Brain, Salad, ArrowLeft
} from 'lucide-react';

const navItems = [
  { section: 'Overview' },
  { to: '/vitalflow', icon: LayoutDashboard, label: 'Dashboard' },
  { section: 'Fitness' },
  { to: '/vitalflow/calories', icon: Flame, label: 'Calories' },
  { to: '/vitalflow/gym', icon: Dumbbell, label: 'Gym & Streaks' },
  { section: 'Health' },
  { to: '/vitalflow/health', icon: Heart, label: 'Health' },
  { section: 'Productivity' },
  { to: '/vitalflow/learning', icon: BookOpen, label: 'Learning' },
  { to: '/vitalflow/notes', icon: StickyNote, label: 'Notes' },
  { to: '/vitalflow/flashcards', icon: Brain, label: 'Flash Cards' },
  { section: 'AI' },
  { to: '/vitalflow/diet-ai', icon: Salad, label: 'Diet Plan' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-link" style={{ margin: '1rem', marginBottom: '0', background: 'var(--bg-deep)' }}>
        <ArrowLeft size={18} />
        <span>Suuqa Guud</span>
      </Link>
      <div className="sidebar-logo">
        <span className="logo-text">vitalflow</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if (item.section) {
            return (
              <div key={i} className="sidebar-section-label">
                {item.section}
              </div>
            );
          }
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
