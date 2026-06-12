import React, { useState, useEffect } from 'react';
import { usePuzzles } from '../context/PuzzleContext';
import { Send, Lightbulb, AlertCircle, CheckCircle2, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

const PuzzlePlayer = () => {
  const { activePuzzle, submitAnswer, feedback, attempts, isSolved } = usePuzzles();
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (isSolved) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#bd00ff', '#39ff14']
      });
    }
  }, [isSolved]);

  if (!activePuzzle) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim() || isSolved) return;
    submitAnswer(answer);
    setAnswer('');
  };

  return (
    <div className="glass-card animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem' }}>
      {/* Meta Header */}
      <div className="flex-between mb-lg">
        <div className="flex" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span className={`badge ${
            activePuzzle.difficulty === 'Fudud' ? 'badge-green' :
            activePuzzle.difficulty === 'Dhexdhexaad' ? 'badge-blue' :
            'badge-red'
          }`}>
            {activePuzzle.difficulty}
          </span>
          <span className="text-secondary text-sm font-bold uppercase">
            Nooca: <span className="text-main">{activePuzzle.type}</span>
          </span>
        </div>
        <div className="badge" style={{ background: 'var(--bg-deep)', border: '1px solid var(--card-border)' }}>
          ISKU DAY: {attempts + 1}
        </div>
      </div>

      {/* Puzzle Question */}
      <div className="mb-xl text-center py-lg">
        <h2 style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>
          {activePuzzle.question}
        </h2>
      </div>

      {/* Input / Post-Solve Actions */}
      <div style={{ position: 'relative' }}>
        {!isSolved ? (
          <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Geli jawaabtaada..."
              className="form-input"
              autoComplete="off"
              autoFocus
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ position: 'absolute', right: '0.5rem', top: '0.5rem', bottom: '0.5rem', padding: '0 1.5rem', borderRadius: 'calc(var(--radius-lg) - 0.25rem)' }}
            >
              <Send size={24} />
            </button>

            {/* Error Feedback */}
            {feedback && feedback.type === 'error' && (
              <div className="mt-md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--accent-red)', fontSize: '0.875rem', fontWeight: '600' }}>
                <AlertCircle size={16} />
                {feedback.message}
              </div>
            )}
          </form>
        ) : (
          <div style={{ background: 'rgba(57, 255, 20, 0.1)', border: '1px solid var(--accent-green)', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--accent-green)', fontWeight: '800', fontSize: '1.5rem', marginBottom: '1rem' }}>
              <CheckCircle2 size={32} />
              Waa Xalisay!
            </div>
            <p className="text-secondary text-lg">
              <span className="text-main font-bold">Sharaxaad:</span> {activePuzzle.explanation}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-lg" style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <button type="button" className="btn btn-secondary w-full" style={{ padding: '1rem' }} onClick={() => alert('Caawinaad ayaa la diyaarinayaa...')}>
            <Lightbulb size={20} className="text-accent-amber" style={{ marginRight: '0.5rem' }} />
            Caawinaad Hel
          </button>
          {isSolved && (
            <button type="button" className="btn btn-primary w-full" style={{ padding: '1rem', background: 'var(--gradient-success)' }} onClick={() => window.location.reload()}>
              Sii Wado Tartanka <Play size={20} style={{ marginLeft: '0.5rem' }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuzzlePlayer;
