// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });

  useEffect(() => {
    // Check localStorage for mock session
    const stored = localStorage.getItem('gz_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    // Mock sign in
    const mockUser = {
      id: 'user-' + Date.now(),
      email,
      username: email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      joined: new Date().toISOString(),
      giveaways_entered: 0,
      articles_read: 0,
    };
    localStorage.setItem('gz_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setAuthModal({ open: false, mode: 'login' });
    return { error: null };
  };

  const signUp = async (email, password, username) => {
    const mockUser = {
      id: 'user-' + Date.now(),
      email,
      username: username || email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || email}`,
      joined: new Date().toISOString(),
      giveaways_entered: 0,
      articles_read: 0,
    };
    localStorage.setItem('gz_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setAuthModal({ open: false, mode: 'login' });
    return { error: null };
  };

  const signOut = () => {
    localStorage.removeItem('gz_user');
    setUser(null);
  };

  const openAuth = (mode = 'login') => setAuthModal({ open: true, mode });
  const closeAuth = () => setAuthModal({ open: false, mode: 'login' });

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, authModal, openAuth, closeAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
