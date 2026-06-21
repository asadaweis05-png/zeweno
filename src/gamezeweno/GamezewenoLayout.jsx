import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import './index.css';

const Home = lazy(() => import('./pages/Home'));
const News = lazy(() => import('./pages/News'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Accounts = lazy(() => import('./pages/Accounts'));
const AccountDetail = lazy(() => import('./pages/AccountDetail'));
const Giveaways = lazy(() => import('./pages/Giveaways'));
const Profile = lazy(() => import('./pages/Profile'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-bg">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-2 border-transparent animate-spin"
        style={{ borderTopColor: '#00CFFF', borderRightColor: '#7A5CFF' }} />
      <span className="font-gaming text-sm text-text-muted tracking-widest animate-pulse">LOADING...</span>
    </div>
  </div>
);

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <Routes location={location}>
          <Route index element={<Home />} />
          <Route path="news" element={<News />} />
          <Route path="news/:slug" element={<ArticleDetail />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="accounts/:id" element={<AccountDetail />} />
          <Route path="giveaways" element={<Giveaways />} />
          <Route path="profile" element={<Profile />} />
          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center text-center px-4">
              <div>
                <h1 className="text-8xl font-gaming font-black gradient-text mb-4">404</h1>
                <p className="text-xl text-text-secondary font-body mb-6">Page not found</p>
                <a href="/gamezeweno" className="btn-primary inline-flex"><span>Back to Home</span></a>
              </div>
            </div>
          } />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function GamezewenoLayout() {
  return (
    <AuthProvider>
      <GameProvider>
        <div className="gamezeweno-root min-h-screen bg-dark-bg text-text-primary flex flex-col font-body">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<PageLoader />}>
              <AnimatedRoutes />
            </Suspense>
          </main>
          <Footer />
          <AuthModal />
        </div>
      </GameProvider>
    </AuthProvider>
  );
}
