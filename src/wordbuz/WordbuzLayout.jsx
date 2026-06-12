import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PuzzleProvider } from './context/PuzzleContext';
import Navbar from './components/Navbar';
import { AnimatePresence, motion } from 'framer-motion';
import './wordbuz.css';

const Home = lazy(() => import('./pages/Home'));
const DailyChallenge = lazy(() => import('./pages/DailyChallenge'));
const FreePlay = lazy(() => import('./pages/FreePlay'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Profile = lazy(() => import('./pages/Profile'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
  </div>
);

const ReferralHandler = () => {
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('referrer_code', ref);
    }
  }, [location]);
  return null;
};

export default function WordbuzLayout() {
  return (
    <AuthProvider>
      <PuzzleProvider>
        <ReferralHandler />
        <div className="wordbuz-root min-h-screen bg-slate-950 text-slate-50">
          <Navbar />
          <main className="max-w-7xl mx-auto pb-24 sm:pb-8">
            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route index element={
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                      <Home />
                    </motion.div>
                  } />
                  <Route path="daily" element={
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                      <DailyChallenge />
                    </motion.div>
                  } />
                  <Route path="free-play" element={
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                      <FreePlay />
                    </motion.div>
                  } />
                  <Route path="leaderboard" element={
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
                      <Leaderboard />
                    </motion.div>
                  } />
                  <Route path="profile" element={
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                      <Profile />
                    </motion.div>
                  } />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </main>
        </div>
      </PuzzleProvider>
    </AuthProvider>
  );
}
