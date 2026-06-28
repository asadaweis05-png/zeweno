import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';
import { getPuzzles, getDailyPuzzle } from '../data/puzzles';

const PuzzleContext = createContext();
export const usePuzzles = () => useContext(PuzzleContext);

// ─── Anti-Cheat Constants ──────────────────────────────────────────────────
const TIMER_SECONDS = 90; // 90s per question — not enough time to wait for AI
const MAX_WARNINGS = 3;

export const PuzzleProvider = ({ children }) => {
  const { recordPuzzleResult } = useAuth();

  // ── Puzzle state ────────────────────────────────────────────────────────
  const [activePuzzle, setActivePuzzle]   = useState(null);
  const [attempts, setAttempts]           = useState(0);
  const [isSolved, setIsSolved]           = useState(false);
  const [feedback, setFeedback]           = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  // ── Timer state ──────────────────────────────────────────────────────────
  const [timeLeft, setTimeLeft]     = useState(TIMER_SECONDS);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  // ── Anti-cheat state ────────────────────────────────────────────────────
  const [cheatWarnings, setCheatWarnings] = useState(0);
  const [cheatOverlay, setCheatOverlay]   = useState(false); // show overlay when tab left
  const [forfeited, setForfeited]         = useState(false);
  const [cheatReason, setCheatReason]     = useState('');
  const puzzleActiveRef = useRef(false);

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
    setTimeLeft(TIMER_SECONDS);
    setTimerActive(true);
    puzzleActiveRef.current = true;
    // Shuffle MCQ options on every new puzzle
    if (puzzle.type === 'mcq' && puzzle.options) {
      setShuffledOptions(shuffle(puzzle.options));
    } else {
      setShuffledOptions([]);
    }
  }, []);

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
    return Array.isArray(activePuzzle.answer) ? activePuzzle.answer[0] : activePuzzle.answer;
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
        // Forfeit puzzle after 3 violations
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

    const normalized = String(userAnswer).toLowerCase().trim();
    const correctRaw = activePuzzle.answer;
    const correct = Array.isArray(correctRaw)
      ? correctRaw.some(a => a.toLowerCase().trim() === normalized)
      : correctRaw.toLowerCase().trim() === normalized;

    setAttempts(prev => prev + 1);

    if (correct) {
      setIsSolved(true);
      setTimerActive(false);
      clearInterval(timerRef.current);
      puzzleActiveRef.current = false;

      // Speed bonus: more time left = more bonus
      const speedBonus = Math.floor(timeLeft / 10); // up to 9 bonus pts
      // Cheat penalty: lose 5 pts per warning
      const cheatPenalty = cheatWarnings * 5;
      const base = activePuzzle.points || 10;
      const total = Math.max(0, base + speedBonus - cheatPenalty);

      setFeedback({
        type: 'success',
        message: `✅ Correct! +${total} points${speedBonus > 0 ? ` (including +${speedBonus} speed bonus)` : ''}`,
        explanation: activePuzzle.explanation,
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

  // ── Load free play ────────────────────────────────────────────────────────
  const loadFreePlay = (category = 'All', difficulty = 'All') => {
    const pool = getPuzzles(category, difficulty);
    if (!pool.length) return;
    const puzzle = pool[Math.floor(Math.random() * pool.length)];
    startPuzzle({ ...puzzle, isDaily: false });
  };

  // ── Load daily challenge ──────────────────────────────────────────────────
  const loadDailyChallenge = () => {
    const puzzle = getDailyPuzzle();
    startPuzzle(puzzle);
  };

  const value = {
    activePuzzle, attempts, isSolved, feedback, shuffledOptions,
    timeLeft, timerActive, TIMER_SECONDS,
    cheatWarnings, cheatOverlay, forfeited, cheatReason, MAX_WARNINGS,
    submitAnswer, startPuzzle, loadFreePlay, loadDailyChallenge,
    dismissOverlay,
  };

  return (
    <PuzzleContext.Provider value={value}>
      {children}
    </PuzzleContext.Provider>
  );
};
