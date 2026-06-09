import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Analytics } from '@vercel/analytics/react';

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

function ProtectedRoute() {
  const { user, authLoading, signOut } = useApp();

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

  // Lock Screen for all authenticated users
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', height: '100vh', 
      backgroundColor: '#0a0a0a', color: 'white', textAlign: 'center', padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '500px', width: '100%', background: '#1a1a1a', 
        padding: '40px 30px', borderRadius: '16px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)', border: '1px solid #333'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
        <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Account Pending</h1>
        <p style={{ marginBottom: '30px', fontSize: '18px', lineHeight: '1.6', color: '#e0e0e0' }}>
          websiteka maalin kadib ayaa lafasixi doona si aad updates ula socoto kusoo biir telegram channelkan
        </p>
        <a 
          href="https://t.me/zeweno" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '14px 28px', backgroundColor: '#0088cc', color: 'white', 
            textDecoration: 'none', borderRadius: '8px', 
            fontWeight: 'bold', fontSize: '16px', marginBottom: '24px',
            width: '100%', boxSizing: 'border-box',
            transition: 'background 0.2s'
          }}
        >
          Join Telegram Channel
        </a>
        <div>
          <button 
            onClick={() => signOut()}
            style={{
              background: 'none', border: 'none', color: '#888', 
              textDecoration: 'underline', cursor: 'pointer', fontSize: '14px'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Marketplace />} />
          
          {/* Secure Workspace Routes */}
          <Route element={<ProtectedRoute />}>
            
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
