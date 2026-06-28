import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Analytics } from '@vercel/analytics/react';
import CommunityHub from './pages/CommunityHub';

// Auth
import Auth from './pages/Auth';

// VitalFlow
import Layout from './components/Layout/Layout';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import Calories from './pages/Calories';
import Gym from './pages/Gym';
import GymCommunity from './pages/GymCommunity';
import Health from './pages/Health';
import DietAI from './pages/DietAI';

// StudyFlow
import StudyLayout from './components/StudyLayout/StudyLayout';
import StudyDashboard from './pages/StudyDashboard';
import Learning from './pages/Learning';
import Notes from './pages/Notes';
import FlashCards from './pages/FlashCards';

import NotFound from './pages/NotFound';

// WordBuz (lazy loaded)
const WordbuzLayout = lazy(() => import('./wordbuz/WordbuzLayout'));
const GamezewenoLayout = lazy(() => import('./gamezeweno/GamezewenoLayout'));

function ProtectedRoute() {
  const { user, authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="auth-container">
        <span className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Navigate to="/wordbuz" replace />} />
          <Route path="/marketplace" element={<Marketplace />} />

          {/* WordBuz Puzzle Module (Public) */}
          <Route path="/wordbuz/*" element={
            <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',backgroundColor:'#0a0a0a'}}><span className="spinner" style={{width:'40px',height:'40px',borderWidth:'3px'}}></span></div>}>
              <WordbuzLayout />
            </Suspense>
          } />
          {/* Gamezeweno Module (Public) */}
          <Route path="/gamezeweno/*" element={
            <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',backgroundColor:'#0a0a0a'}}><span className="spinner" style={{width:'40px',height:'40px',borderWidth:'3px'}}></span></div>}>
              <GamezewenoLayout />
            </Suspense>
          } />
          
          {/* Secure Workspace Routes */}
          <Route element={<ProtectedRoute />}>
            
            {/* CommunityHub Module */}
            <Route path="/communityhub/*" element={<CommunityHub />} />

            {/* VitalFlow OS */}
            <Route path="/vitalflow" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="calories" element={<Calories />} />
              <Route path="gym" element={<Gym />} />
              <Route path="community" element={<GymCommunity />} />
              <Route path="health" element={<Health />} />
              <Route path="diet-ai" element={<DietAI />} />
            </Route>

            {/* StudyFlow OS */}
            <Route path="/studyflow" element={<StudyLayout />}>
              <Route index element={<StudyDashboard />} />
              <Route path="learning" element={<Learning />} />
              <Route path="notes" element={<Notes />} />
              <Route path="flashcards" element={<FlashCards />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
        <Analytics />
  </AppProvider>
  );
}
