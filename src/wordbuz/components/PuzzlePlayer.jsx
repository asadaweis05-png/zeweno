import React, { useState } from 'react';
import { usePuzzles } from '../context/PuzzleContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Lightbulb, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

const PuzzlePlayer = () => {
  const { activePuzzle, submitAnswer, feedback, attempts, isSolved } = usePuzzles();
  const [answer, setAnswer] = useState('');

  if (!activePuzzle) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim() || isSolved) return;
    submitAnswer(answer);
    setAnswer('');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Meta Header */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${
            activePuzzle.difficulty === 'Fudud' ? 'bg-emerald-100 text-emerald-700' :
            activePuzzle.difficulty === 'Dhexdhexaad' ? 'bg-blue-100 text-blue-700' :
            'bg-rose-100 text-rose-700'
          }`}>
            {activePuzzle.difficulty}
          </span>
          <span className="text-slate-700 text-xs font-semibold uppercase">
            Nooca: {activePuzzle.type}
          </span>
        </div>
        <div className="text-slate-700 text-xs font-bold bg-slate-100 px-3 py-1 rounded-md">
          ISKU DAY: {attempts + 1}
        </div>
      </div>

      {/* Puzzle Card */}
      <div className="clean-card relative overflow-hidden flex flex-col items-center justify-center text-center space-y-6 min-h-[250px] bg-slate-50">
        
        {/* Success Icon */}
        <AnimatePresence>
          {isSolved && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-4 right-4 text-brand-500"
            >
              <CheckCircle2 size={32} />
            </motion.div>
          )}
        </AnimatePresence>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
          {activePuzzle.question}
        </h2>

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedback && feedback.type === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm font-medium flex items-center gap-2 border border-red-100"
            >
              <AlertCircle size={16} />
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input / Post-Solve Actions */}
      <div className="space-y-4">
        {!isSolved ? (
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Geli jawaabtaada..."
              className="input-field text-lg pr-16"
              autoComplete="off"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 aspect-square bg-brand-600 hover:bg-brand-700 text-white rounded-md flex items-center justify-center transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="clean-card bg-brand-50 border-brand-200 p-6"
          >
            <div className="flex items-center gap-2 text-brand-700 font-bold mb-2">
              <CheckCircle2 size={20} />
              Waa Xalisay!
            </div>
            <p className="text-slate-700">
              <span className="font-semibold">Sharaxaad:</span> {activePuzzle.explanation}
            </p>
          </motion.div>
        )}

        {/* Footer Actions */}
        <div className="flex gap-3">
          <button className="flex-1 btn-secondary" onClick={() => alert('Caawinaad ayaa la diyaarinayaa...')}>
            <Lightbulb size={18} />
            Caawinaad Hel
          </button>
          {isSolved && (
            <button className="flex-[2] btn-primary" onClick={() => window.location.reload()}>
              Sii Wado Tartanka <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuzzlePlayer;
