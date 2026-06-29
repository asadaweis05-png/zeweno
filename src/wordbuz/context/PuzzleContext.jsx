import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';
import { getPuzzles, getDailyPuzzle } from '../data/puzzles';

const PuzzleContext = createContext();
export const usePuzzles = () => useContext(PuzzleContext);

// ─── Anti-Cheat Constants ──────────────────────────────────────────────────
const MAX_WARNINGS = 3;

export const PuzzleProvider = ({ children }) => {
  const { recordPuzzleResult } = useAuth();

  // ── Language state ───────────────────────────────────────────────────────
  const [language, setLanguage] = useState('so'); // default: Somali

  // ── Puzzle state ────────────────────────────────────────────────────────
  const [activePuzzle, setActivePuzzle]   = useState(null);
  const [attempts, setAttempts]           = useState(0);
  const [isSolved, setIsSolved]           = useState(false);
  const [feedback, setFeedback]           = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  // ── Timer state ──────────────────────────────────────────────────────────
  const [timeLeft, setTimeLeft]     = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [initialTimeLimit, setInitialTimeLimit] = useState(90);
  const timerRef = useRef(null);

  // ── Anti-cheat state ────────────────────────────────────────────────────
  const [cheatWarnings, setCheatWarnings] = useState(0);
  const [cheatOverlay, setCheatOverlay]   = useState(false); 
  const [forfeited, setForfeited]         = useState(false);
  const [cheatReason, setCheatReason]     = useState('');
  const puzzleActiveRef = useRef(false);

  // ── Normalize Arabic numerals helper ─────────────────────────────────────
  const normalizeInput = (str) => {
    return String(str)
      .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
      .toLowerCase()
      .trim();
  };

  // ── Shuffle helper ───────────────────────────────────────────────────────
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // ── Start a puzzle ───────────────────────────────────────────────────────
  const startPuzzle = useCallback((puzzle) => {
    setActivePuzzle(puzzle);
    setAttempts(0);
    setIsSolved(false);
    setFeedback(null);
    setForfeited(false);
    setCheatWarnings(0);
    setCheatOverlay(false);
    
    // Dynamic timer to block second-phone typing
    const limit = puzzle.timeLimit || 90;
    setInitialTimeLimit(limit);
    setTimeLeft(limit);
    setTimerActive(true);
    
    puzzleActiveRef.current = true;
    
    // Shuffle MCQ options on every new puzzle
    if (puzzle.type === 'mcq' && puzzle.options && puzzle.options[language]) {
      setShuffledOptions(shuffle(puzzle.options[language]));
    } else {
      setShuffledOptions([]);
    }
  }, [language]);

  // Re-shuffle options if language changes while puzzle is active
  useEffect(() => {
    if (activePuzzle && activePuzzle.type === 'mcq' && activePuzzle.options && activePuzzle.options[language]) {
       // We keep the logic simple: if they switch language, re-shuffle options in new language
       setShuffledOptions(shuffle(activePuzzle.options[language]));
    }
  }, [language, activePuzzle]);


  // ── Timer logic ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!timerActive || isSolved || forfeited) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerActive(false);
          setForfeited(true);
          puzzleActiveRef.current = false;
          setFeedback({ type: 'timeout', message: "⏰ Time's up! The correct answer was: " + getCorrectAnswerText() });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line
  }, [timerActive, isSolved, forfeited, activePuzzle]);

  const getCorrectAnswerText = () => {
    if (!activePuzzle) return '';
    // Answer is localized or array
    const ans = activePuzzle.answer;
    if (typeof ans === 'object' && !Array.isArray(ans)) {
        return ans[language] || ans['so'];
    }
    return Array.isArray(ans) ? ans[0] : ans;
  };

  // ── Anti-cheat: tab visibility ────────────────────────────────────────────
  useEffect(() => {
    const handleVisibility = () => {
      if (!puzzleActiveRef.current || isSolved || forfeited) return;
      if (document.hidden) {
        triggerCheatWarning('tab-switch', 'You switched tabs during the puzzle!');
      } else {
        setCheatOverlay(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isSolved, forfeited]);

  // ── Anti-cheat: window blur (switched apps) ───────────────────────────────
  useEffect(() => {
    const handleBlur = () => {
      if (!puzzleActiveRef.current || isSolved || forfeited) return;
      triggerCheatWarning('window-blur', 'You left the window during the puzzle!');
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [isSolved, forfeited]);

  const triggerCheatWarning = (reason, message) => {
    setCheatReason(message);
    setCheatOverlay(true);
    setCheatWarnings(prev => {
      const next = prev + 1;
      if (next >= MAX_WARNINGS) {
        setForfeited(true);
        setTimerActive(false);
        puzzleActiveRef.current = false;
        clearInterval(timerRef.current);
        setFeedback({
          type: 'cheat',
          message: '🚫 Puzzle forfeited due to multiple cheating attempts. 0 points awarded.'
        });
      }
      return next;
    });
  };

  const dismissOverlay = () => setCheatOverlay(false);

  // ── Submit answer ────────────────────────────────────────────────────────
  const submitAnswer = async (userAnswer) => {
    if (!activePuzzle || isSolved || forfeited) return;

    const normalizedUser = normalizeInput(userAnswer);
    let correct = false;
    
    // Check answer against localized dictionary or array
    const rawAnswer = activePuzzle.answer;
    if (Array.isArray(rawAnswer)) {
       correct = rawAnswer.some(a => normalizeInput(a) === normalizedUser);
    } else if (typeof rawAnswer === 'object') {
       // Check against all languages just in case
       correct = Object.values(rawAnswer).some(a => normalizeInput(a) === normalizedUser);
    } else {
       correct = normalizeInput(rawAnswer) === normalizedUser;
    }

    setAttempts(prev => prev + 1);

    if (correct) {
      setIsSolved(true);
      setTimerActive(false);
      clearInterval(timerRef.current);
      puzzleActiveRef.current = false;

      // Speed bonus: more time left = more bonus
      const speedBonus = Math.floor(timeLeft / 5); 
      const cheatPenalty = cheatWarnings * 5;
      const base = activePuzzle.points || 10;
      const total = Math.max(0, base + speedBonus - cheatPenalty);

      setFeedback({
        type: 'success',
        message: `✅ Correct! +${total} points${speedBonus > 0 ? ` (speed bonus included)` : ''}`,
        explanation: activePuzzle.explanation[language] || activePuzzle.explanation['so'],
        points: total,
      });

      confetti({ particleCount: 140, spread: 70, origin: { y: 0.6 }, colors: ['#00CFFF','#7A5CFF','#00FF99'] });

      await recordPuzzleResult({
        pointsEarned: total,
        isSolved: true,
        isDaily: activePuzzle.isDaily || false,
        attemptsUsed: attempts + 1,
      });
    } else {
      const msgs = [
        'Not quite — try again!',
        'Close, but not right. Think carefully.',
        'Incorrect. Review the question.',
        'Wrong answer. One more attempt left before timeout.',
      ];
      setFeedback({
        type: 'error',
        message: msgs[Math.min(attempts, msgs.length - 1)],
      });
    }
  };

  const [freePlaySettings, setFreePlaySettings] = useState({ category: 'All', difficulty: 'All' });

  // ── Load free play ────────────────────────────────────────────────────────
  const loadFreePlay = useCallback((category = 'All', difficulty = 'All') => {
    setFreePlaySettings({ category, difficulty });
    const pool = getPuzzles(category, difficulty);
    if (!pool.length) return;
    const puzzle = pool[Math.floor(Math.random() * pool.length)];
    startPuzzle({ ...puzzle, isDaily: false });
  }, [startPuzzle]);

  // ── Load daily challenge ──────────────────────────────────────────────────
  const loadDailyChallenge = useCallback(() => {
    const puzzle = getDailyPuzzle();
    startPuzzle(puzzle);
  }, [startPuzzle]);

  // ── Next puzzle ───────────────────────────────────────────────────────────
  const nextPuzzle = useCallback(() => {
    if (activePuzzle && activePuzzle.isDaily) {
      // For daily challenge, typically they shouldn't just hit "next", but if they do, we can reload or redirect
      window.location.href = '/wordbuz';
    } else {
      loadFreePlay(freePlaySettings.category, freePlaySettings.difficulty);
    }
  }, [activePuzzle, freePlaySettings, loadFreePlay]);

  const value = {
    language, setLanguage,
    activePuzzle, attempts, isSolved, feedback, shuffledOptions,
    timeLeft, timerActive, initialTimeLimit,
    cheatWarnings, cheatOverlay, forfeited, cheatReason, MAX_WARNINGS,
    submitAnswer, startPuzzle, loadFreePlay, loadDailyChallenge, nextPuzzle,

    dismissOverlay,
  };

  return (
    <PuzzleContext.Provider value={value}>
      {children}
    </PuzzleContext.Provider>
  );
};
