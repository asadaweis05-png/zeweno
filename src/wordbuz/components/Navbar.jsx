import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Zap, Play, Trophy, User, LogIn, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import AuthModal from './AuthModal';

const BASE = '/wordbuz';

const Navbar = () => {
  const { user, userProfile, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: `${BASE}`, icon: <LayoutGrid size={20} />, label: 'Bilowga' },
    { path: `${BASE}/daily`, icon: <Zap size={20} />, label: 'Maalinle' },
    { path: `${BASE}/free-play`, icon: <Play size={20} />, label: 'Ciyaar' },
    { path: `${BASE}/leaderboard`, icon: <Trophy size={20} />, label: 'Hogaanka' },
    { path: `${BASE}/profile`, icon: <User size={20} />, label: 'Koonte' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Back to VitalFlow & Logo */}
        <div className="flex items-center gap-3">
          <Link to="/vitalflow" className="flex items-center gap-1.5 text-xs text-slate-800 hover:text-brand-600 transition-colors font-semibold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 shadow-sm">
            <ArrowLeft size={14} />
            <span>VitalFlow</span>
          </Link>

          <Link to={BASE} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-600 rounded flex items-center justify-center font-bold text-white shadow-sm">
              P
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">PuzzleWin</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === BASE && location.pathname === `${BASE}/`);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-brand-600' : 'text-slate-800 hover:text-slate-900'
                }`}
              >
                {item.icon}
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="desktop-nav-active"
                    className="absolute -bottom-5 left-0 right-0 h-0.5 bg-brand-600"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Auth / Mobile Profile */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 text-sm font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                <span className="text-brand-600 font-bold">{userProfile?.points || 0} Dhibcood</span>
              </div>
              <button onClick={logout} className="hidden md:flex text-slate-700 hover:text-red-600 transition-colors" title="Ka Bax (Logout)">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsAuthModalOpen(true)} className="btn-primary py-2 px-4 text-sm hidden md:flex">
              Soo Gal <LogIn size={16} />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path === BASE && location.pathname === `${BASE}/`);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
                  isActive ? 'text-brand-600' : 'text-slate-700'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};

export default Navbar;
