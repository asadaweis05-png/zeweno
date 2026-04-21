import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import Calories from './pages/Calories';
import Gym from './pages/Gym';
import Health from './pages/Health';
import Learning from './pages/Learning';
import Notes from './pages/Notes';
import FlashCards from './pages/FlashCards';
import DietAI from './pages/DietAI';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Marketplace />} />
          
          <Route path="/vitalflow" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="calories" element={<Calories />} />
            <Route path="gym" element={<Gym />} />
            <Route path="health" element={<Health />} />
            <Route path="learning" element={<Learning />} />
            <Route path="notes" element={<Notes />} />
            <Route path="flashcards" element={<FlashCards />} />
            <Route path="diet-ai" element={<DietAI />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
