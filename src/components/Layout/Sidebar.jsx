import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, Flame, Dumbbell, Heart,
  Salad, ArrowLeft, Users, LogOut
} from 'lucide-react';

const navItems = [
  { section: 'Overview' },
  { to: '/vitalflow', icon: LayoutDashboard, label: 'Dashboard' },
  { section: 'Fitness' },
  { to: '/vitalflow/calories', icon: Flame, label: 'Calories' },
  { to: '/vitalflow/gym', icon: Dumbbell, label: 'Gym & Streaks' },
  { to: '/vitalflow/community', icon: Users, label: 'Gym Community' },
  { section: 'Health' },
  { to: '/vitalflow/health', icon: Heart, label: 'Health' },
  { section: 'AI' },
  { to: '/vitalflow/diet-ai', icon: Salad, label: 'Diet Plan' },
];

export default function Sidebar() {
  const { signOut } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (e) {
      console.error('Failed to log out:', e);
    }
  };

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

      <button 
        onClick={handleLogout} 
        className="sidebar-link sidebar-logout-btn"
        style={{ margin: '1rem', border: '1px solid var(--card-border)', background: 'transparent' }}
      >
        <LogOut size={20} strokeWidth={2} />
        <span>Ka Bax</span>
      </button>
    </aside>
  );
}
