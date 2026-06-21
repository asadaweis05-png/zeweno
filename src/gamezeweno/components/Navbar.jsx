// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Gamepad2, User, LogOut, ChevronDown, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { href: '/gamezeweno', label: 'Home' },
  { href: '/gamezeweno/news', label: 'News' },
  { href: '/gamezeweno/accounts', label: 'Accounts' },
  { href: '/gamezeweno/giveaways', label: 'Giveaways' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signOut, openAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(10,10,10,0.95)'
            : 'rgba(10,10,10,0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid rgba(0,207,255,0.15)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        <div className="container-gaming">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/gamezeweno" className="flex items-center gap-2.5 group">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,207,255,0.2), rgba(122,92,255,0.2))',
                  border: '1px solid rgba(0,207,255,0.4)',
                  boxShadow: '0 0 12px rgba(0,207,255,0.2)',
                }}
              >
                <Gamepad2 size={20} className="text-neon-blue" />
              </div>
              <span className="font-gaming font-bold text-lg tracking-wider">
                <span className="gradient-text">GAME</span>
                <span className="text-white">ZEWENO</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label }) => {
                const active = location.pathname === href;
                return (
                  <Link
                    key={href}
                    to={href}
                    className="relative px-4 py-2 text-sm font-semibold font-body transition-all duration-200 rounded-lg"
                    style={{ color: active ? '#00CFFF' : '#A0A0A0' }}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.2)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 hover:text-white">{label}</span>
                    {label === 'Giveaways' && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-white/5"
                  >
                    <img src={user.avatar} alt="" className="w-7 h-7 rounded-full border border-neon-blue/40" />
                    <span className="text-sm font-semibold font-body text-white">{user.username}</span>
                    <ChevronDown size={14} className="text-text-muted" />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-full mt-2 w-48 glass-card py-1 rounded-xl overflow-hidden"
                        style={{ border: '1px solid rgba(0,207,255,0.15)' }}
                      >
                        <Link to="/gamezeweno/profile" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors font-body">
                          <User size={15} /> Profile
                        </Link>
                        <button onClick={() => { signOut(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-body">
                          <LogOut size={15} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => openAuth('login')}
                  className="hidden md:flex btn-secondary text-sm px-4 py-2"
                >
                  Sign In
                </button>
              )}

              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-text-secondary hover:text-white transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
              style={{ borderTop: '1px solid rgba(0,207,255,0.1)', background: 'rgba(10,10,10,0.98)' }}
            >
              <div className="container-gaming py-4 space-y-1">
                {navLinks.map(({ href, label }) => {
                  const active = location.pathname === href;
                  return (
                    <Link
                      key={href}
                      to={href}
                      className="flex items-center px-4 py-3 rounded-lg text-sm font-semibold font-body transition-all"
                      style={{
                        background: active ? 'rgba(0,207,255,0.1)' : 'transparent',
                        color: active ? '#00CFFF' : '#A0A0A0',
                        border: active ? '1px solid rgba(0,207,255,0.2)' : '1px solid transparent',
                      }}
                    >
                      {label}
                    </Link>
                  );
                })}
                <div className="pt-2 border-t border-white/5">
                  {user ? (
                    <div className="flex items-center justify-between px-4 py-2">
                      <div className="flex items-center gap-2">
                        <img src={user.avatar} alt="" className="w-8 h-8 rounded-full border border-neon-blue/40" />
                        <span className="text-sm font-semibold">{user.username}</span>
                      </div>
                      <button onClick={signOut} className="text-red-400 text-sm font-body">Sign Out</button>
                    </div>
                  ) : (
                    <div className="flex gap-2 px-2">
                      <button onClick={() => openAuth('login')} className="flex-1 btn-secondary text-sm py-2">Sign In</button>
                      <button onClick={() => openAuth('register')} className="flex-1 btn-primary text-sm py-2"><span>Register</span></button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
