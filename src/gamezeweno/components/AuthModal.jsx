// src/components/AuthModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Gamepad2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { authModal, closeAuth, signIn, signUp } = useAuth();
  const [mode, setMode] = useState(authModal.mode || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => { setMode(authModal.mode || 'login'); }, [authModal.mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) setError(error.message);
      } else {
        if (!username.trim()) { setError('Username is required'); setLoading(false); return; }
        const { error } = await signUp(email, password, username);
        if (error) setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {authModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeAuth}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-md glass-card p-8"
            style={{ border: '1px solid rgba(0,207,255,0.2)' }}
          >
            {/* Glow */}
            <div className="absolute -inset-px rounded-xl overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-60" />
            </div>

            {/* Close */}
            <button onClick={closeAuth} className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors">
              <X size={20} />
            </button>

            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'linear-gradient(135deg, #00CFFF20, #7A5CFF20)', border: '1px solid rgba(0,207,255,0.3)' }}>
                <Gamepad2 size={24} className="text-neon-blue" />
              </div>
              <h2 className="text-xl font-gaming font-bold gradient-text">GAMEZEWENO</h2>
              <p className="text-text-secondary text-sm font-body mt-1">
                {mode === 'login' ? 'Welcome back, gamer!' : 'Join the gaming community'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex rounded-lg overflow-hidden mb-6" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              {['login', 'register'].map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); }}
                  className="flex-1 py-2.5 text-sm font-semibold font-body transition-all duration-200 capitalize"
                  style={{
                    background: mode === m ? 'rgba(0,207,255,0.15)' : 'transparent',
                    color: mode === m ? '#00CFFF' : '#606060',
                  }}
                >
                  {m === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="input-gaming pl-9"
                    required
                  />
                </div>
              )}
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-gaming pl-9"
                  required
                />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-gaming pl-9 pr-10"
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {error && (
                <div className="px-3 py-2 rounded-lg text-sm font-body text-red-400 bg-red-500/10 border border-red-500/20">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                <span>{loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              </button>
            </form>

            <p className="text-center text-text-muted text-xs font-body mt-4">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-neon-blue hover:underline">
                {mode === 'login' ? 'Register' : 'Sign In'}
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
