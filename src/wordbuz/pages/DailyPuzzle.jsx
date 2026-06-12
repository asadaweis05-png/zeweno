import React, { useEffect, useState } from 'react';
import { usePuzzles } from '../context/PuzzleContext';
import { useAuth } from '../context/AuthContext';
import { PageCard } from '../../components/PageCard';
import { Modal } from '../../components/Modal';

// Helper to request fullscreen lock (anti‑cheat)
const requestLock = async () => {
  if (document.documentElement.requestFullscreen) {
    try {
      await document.documentElement.requestFullscreen();
    } catch (e) {
      console.warn('Fullscreen request denied', e);
    }
  }
};

const releaseLock = async () => {
  if (document.exitFullscreen) {
    try {
      await document.exitFullscreen();
    } catch (e) {
      console.warn('Exit fullscreen failed', e);
    }
  }
};

export default function DailyPuzzle() {
  const { activePuzzle, startPuzzle, submitAnswer, feedback, attempts, isSolved } = usePuzzles();
  const { userProfile, awardDailyPrize } = useAuth();
  const [showWinModal, setShowWinModal] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState(null);

  // Load a hard Somali puzzle on mount
  useEffect(() => {
    // In a real app this would be fetched from Supabase; here we use a static example
    const somaliPuzzle = {
      id: 'daily-2026-06-12',
      question: "Waxaan ahay mid weyn, haddaan dib u jeesado waan ka buuxaa, maxaan ahay? (Somali riddle)",
      answer: "biyo",
      difficulty: 'Dheer',
      isDaily: true
    };
    startPuzzle(somaliPuzzle);
    requestLock();
    // Cleanup on unmount
    return () => {
      releaseLock();
    };
  }, [startPuzzle]);

  const handleSubmit = async e => {
    e.preventDefault();
    const answer = e.target.elements.answer.value;
    await submitAnswer(answer);
    if (isSolved) {
      // Award cash prize only once per puzzle
      const awarded = await awardDailyPrize(activePuzzle.id);
      if (awarded) {
        setShowWinModal(true);
        setWinnerInfo({ email: userProfile?.email, avatar: null });
      }
    }
    e.target.reset();
  };

  // Fetch latest winner for display (simple fetch from Supabase – omitted for brevity)
  // In a real implementation you would query `puzzle_winners` where puzzle_id = activePuzzle.id

  return (
    <PageCard className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="text-center mb-4">Maalinta – Caqabadta (Somali)</h2>
      {activePuzzle && (
        <div>
          <p className="mb-2"><strong>Su'aal:</strong> {activePuzzle.question}</p>
          <form onSubmit={handleSubmit} className="flex gap-2 items-center">
            <input name="answer" placeholder="Jawaabtaada" className="input" required />
            <button type="submit" className="btn-primary">Gudbi</button>
          </form>
          {feedback && (
            <div className={`mt-2 ${feedback.type === 'success' ? 'text-green-500' : 'text-red-500'}`}> {feedback.message} </div>
          )}
        </div>
      )}

      {showWinModal && (
        <Modal onClose={() => setShowWinModal(false)}>
          <h3 className="text-center mb-3">🎉 Hambalyo! Waxaad ku guuleysatay $2!</h3>
          <p className="text-center mb-4">Lacagta waxaa lagu daraa balankaaga. Nala soo xiriir WhatsApp si aad u hesho lacagta:</p>
          <div className="text-center">
            <a href="tel:+252614581004" className="btn-primary">+252 614 581 004</a>
          </div>
        </Modal>
      )}
    </PageCard>
  );
}
