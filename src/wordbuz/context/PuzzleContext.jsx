import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

const PuzzleContext = createContext();

export const usePuzzles = () => useContext(PuzzleContext);

const puzzlesDB = [
  {
    id: 1,
    question: "Waa maxay waxa markaad qabato dilaaca, laakiin haddii aad dayso nool?",
    answer: "Muraayad",
    explanation: "Muraayadda haddii aad dhulka ku dhufato way jabaysaa (dilaacaysaa), haddii kalena way iska jiraysaa.",
    difficulty: "Adag",
    type: "Hal-xiraale"
  },
  {
    id: 2,
    question: "Waa maxay waxa inta aad bixisid in ka badan ku soo noqda?",
    answer: ["Naxariis", "Jacayl", "Sadaqo", "Cilmi"],
    explanation: "Ficilada wanaagsan iyo aqoonta markaad bixisid way kuu labanlaabmaan.",
    difficulty: "Dhexdhexaad",
    type: "Hal-xiraale"
  },
  {
    id: 3,
    question: "Afar lugood ayuu leeyahay, laakiin ma socon karo. Waa maxay?",
    answer: ["Kursi", "Miis", "Sariir"],
    explanation: "Qalabka guriga sida kursiga iyo miisku waxay leeyihiin afar lugood laakiin ma lugeeyaan.",
    difficulty: "Fudud",
    type: "Hal-xiraale"
  },
  {
    id: 4,
    question: "Waa maxay waxa af leh laakiin aan hadlin, sariir leh laakiin aan seexan?",
    answer: ["Wabi", "Wabiga"],
    explanation: "Wabigu wuxuu leeyahay af (meesha uu ka bilowdo/dhamaado) iyo sariir (gunkiisa).",
    difficulty: "Adag",
    type: "Hal-xiraale"
  },
  {
    id: 5,
    question: "Waa maxay waxa qoorta ka xidhan, uurkana ka banaan?",
    answer: ["Dhalo", "Caag"],
    explanation: "Dhaladu ama caagadu waxay leedahay qoor cidhiidhi ah laakiin dhexdeedu way banaan tahay.",
    difficulty: "Fudud",
    type: "Hal-xiraale"
  }
];

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

  const loadFreePlay = (difficulty) => {
    const availablePuzzles = puzzlesDB.filter(p => p.difficulty === difficulty);
    const randomIndex = Math.floor(Math.random() * availablePuzzles.length);
    const selectedPuzzle = availablePuzzles[randomIndex] || puzzlesDB[0];
    startPuzzle({ ...selectedPuzzle, isDaily: false });
  };

  const loadDailyChallenge = () => {
    // For now, randomly pick a puzzle for the daily challenge or base it on date
    const today = new Date().getDate();
    const puzzle = puzzlesDB[today % puzzlesDB.length];
    startPuzzle({ ...puzzle, isDaily: true });
  };

  const value = {
    activePuzzle,
    attempts,
    isSolved,
    feedback,
    dailyCooldown,
    submitAnswer,
    startPuzzle,
    loadFreePlay,
    loadDailyChallenge
  };

  return (
    <PuzzleContext.Provider value={value}>
      {children}
    </PuzzleContext.Provider>
  );
};
