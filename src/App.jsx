import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

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

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Marketplace />} />
          
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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
