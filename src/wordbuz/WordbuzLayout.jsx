import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import { PuzzleProvider } from './context/PuzzleContext';
import { AuthProvider } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import DailyChallenge from './pages/DailyChallenge.jsx';
import FreePlay from './pages/FreePlay.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Profile from './pages/Profile.jsx';

const WordbuzLayout = () => {
  return (
    <AuthProvider>
      <PuzzleProvider>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route index element={<Home />} />
              <Route path="daily" element={<DailyChallenge />} />
              <Route path="free-play" element={<FreePlay />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </PuzzleProvider>
    </AuthProvider>
  );
};

export default WordbuzLayout;
