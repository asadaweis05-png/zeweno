import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Brain, Play, Zap, Trophy, User, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/wordbuz');
  };

  const navItems = [
    { to: '/wordbuz', icon: Brain, label: 'Hoyga', end: true },
    { to: '/wordbuz/daily', icon: Zap, label: 'Maalinle' },
    { to: '/wordbuz/free-play', icon: Play, label: 'Xor ah' },
    { to: '/wordbuz/leaderboard', icon: Trophy, label: 'Hogaanka' },
    { to: '/wordbuz/profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-text">WordBuz</span>
        </div>
        
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Xujooyinka</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="sidebar-section-label" style={{ marginTop: '2rem' }}>System</div>
          <button 
            onClick={() => navigate('/marketplace')} 
            className="sidebar-link w-full text-left"
          >
            <ArrowLeft size={20} />
            <span>Suuqa App-yada</span>
          </button>
          
          {user && (
            <button 
              onClick={handleLogout} 
              className="sidebar-link w-full text-left text-red-400 hover:text-red-300 mt-2"
            >
              <LogOut size={20} />
              <span>Ka Bax</span>
            </button>
          )}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="bottom-nav-icon-wrapper">
              <item.icon size={22} />
            </div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
