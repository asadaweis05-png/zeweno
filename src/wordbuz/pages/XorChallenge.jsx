import React, { useEffect, useState } from 'react';
import { usePuzzles } from '../context/PuzzleContext';
import { useAuth } from '../context/AuthContext';
import { PageCard } from '../../components/PageCard';
import { Modal } from '../../components/Modal';

// Fullscreen lock helpers (same as DailyPuzzle)
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

export default function XorChallenge() {
  const { activePuzzle, startPuzzle, submitAnswer, feedback, attempts, isSolved } = usePuzzles();
  const { userProfile } = useAuth();
  const [showWinModal, setShowWinModal] = useState(false);

  // Static XOR puzzles – in a real app they would be fetched from Supabase
  const xorPuzzles = [
    {
      id: 'xor-1',
      question: 'Calculate 5 XOR 12',
      answer: '9',
      difficulty: 'Fudud',
      points: 5,
      isDaily: false
    },
    {
      id: 'xor-2',
      question: 'What is 23 XOR 7?',
      answer: '16',
      difficulty: 'Dhexdhexaad',
      points: 10,
      isDaily: false
    },
    {
      id: 'xor-3',
      question: 'Find the result of 1024 XOR 2048',
      answer: '3072',
      difficulty: 'Dheer',
      points: 25,
      isDaily: false
    }
  ];

  // Load first puzzle on mount and request fullscreen lock
  useEffect(() => {
    startPuzzle(xorPuzzles[0]);
    requestLock();
    return () => releaseLock();
  }, [startPuzzle]);

  const handleSubmit = async e => {
    e.preventDefault();
    const answer = e.target.elements.answer.value;
    await submitAnswer(answer);
    if (isSolved) {
      setShowWinModal(true);
    }
    e.target.reset();
  };

  return (
    <PageCard className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="text-center mb-4">XOR Challenge</h2>
      {activePuzzle && (
        <div>
          <p className="mb-2"><strong>Question:</strong> {activePuzzle.question}</p>
          <form onSubmit={handleSubmit} className="flex gap-2 items-center">
            <input name="answer" placeholder="Your answer" className="input" required />
            <button type="submit" className="btn-primary">Submit</button>
          </form>
          {feedback && (
            <div className={`mt-2 ${feedback.type === 'success' ? 'text-green-500' : 'text-red-500'}`}> {feedback.message} </div>
          )}
        </div>
      )}

      {showWinModal && (
        <Modal onClose={() => setShowWinModal(false)}>
          <h3 className="text-center mb-3">🎉 Well done! Points awarded.</h3>
          <p className="text-center mb-4">You earned {activePuzzle.points} points.</p>
        </Modal>
      )}
    </PageCard>
  );
}
