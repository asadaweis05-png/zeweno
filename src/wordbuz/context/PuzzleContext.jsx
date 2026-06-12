import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

const PuzzleContext = createContext();

export const usePuzzles = () => useContext(PuzzleContext);

export const PuzzleProvider = ({ children }) => {
  const { userProfile, recordPuzzleResult } = useAuth();
  const [activePuzzle, setActivePuzzle] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [dailyCooldown, setDailyCooldown] = useState(0);

  // Psychologically engaging feedback messages (Somali)
  const nearMissMessages = [
    "Aad baad ugu dhawdahay!",
    "Dadka intooda badan way ku khaldamaan faahfaahintan",
    "Isku day mar kale, waad awoodaa",
    "Ugu dhawaan waa sax, si fiican u eeg"
  ];

  const retryMessages = [
    "Hadda ha is dhiibin!",
    "Waqti ayaad gelisay, sii wad",
    "Xoogaa yar ayaa dhiman si aad u xalliso"
  ];

  const submitAnswer = async (answer) => {
    if (isSolved) return;

    setAttempts(prev => prev + 1);
    
    const normalizedUserAnswer = answer.toLowerCase().trim();
    
    // Check if answer is an array or string
    let isCorrect = false;
    if (Array.isArray(activePuzzle.answer)) {
      isCorrect = activePuzzle.answer.some(ans => ans.toLowerCase().trim() === normalizedUserAnswer);
    } else {
      isCorrect = normalizedUserAnswer === activePuzzle.answer.toLowerCase().trim();
    }

    if (isCorrect) {
      setIsSolved(true);
      setFeedback({ type: 'success', message: 'Cajiib! Waad xallisay!' });
      
      // Micro-rewards: Confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Award points
      const basePoints = activePuzzle.difficulty === 'Fudud' ? 5 : activePuzzle.difficulty === 'Dhexdhexaad' ? 10 : 25;
      
      // Variable Reward System (Dopamine loop)
      const bonus = Math.random() > 0.8 ? 10 : 0;
      const totalAward = basePoints + bonus;
      
      await recordPuzzleResult({
        pointsEarned: totalAward,
        isSolved: true,
        isDaily: activePuzzle.isDaily || false,
        attemptsUsed: attempts + 1
      });
      
      if (bonus > 0) {
        setFeedback(prev => ({ 
          ...prev, 
          bonusMessage: `Nasiib wanaagsan! +${bonus} dhibcood dheeraad ah!` 
        }));
      }
    } else {
      // Near-Miss Effect & Engaging Feedback
      let message = attempts < 2 
        ? nearMissMessages[Math.floor(Math.random() * nearMissMessages.length)]
        : retryMessages[Math.floor(Math.random() * retryMessages.length)];
      
      setFeedback({ type: 'error', message });

      // Record failed attempt
      await recordPuzzleResult({
        pointsEarned: 0,
        isSolved: false,
        isDaily: activePuzzle.isDaily || false,
        attemptsUsed: attempts + 1
      });

      // Daily Challenge Cooldown Logic (Simulated)
      if (activePuzzle.isDaily && attempts >= 1) {
        // After 2 free attempts, trigger cooldown or ad requirement
        // For now, just a message
      }
    }
  };

  const startPuzzle = (puzzle) => {
    setActivePuzzle(puzzle);
    setAttempts(0);
    setIsSolved(false);
    setFeedback(null);
  };

  const value = {
    activePuzzle,
    attempts,
    isSolved,
    feedback,
    dailyCooldown,
    submitAnswer,
    startPuzzle
  };

  return (
    <PuzzleContext.Provider value={value}>
      {children}
    </PuzzleContext.Provider>
  );
};
