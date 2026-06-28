import React, { useState, useRef, useEffect } from 'react';
import { usePuzzles } from '../context/PuzzleContext';
import { Send, CheckCircle2, XCircle, AlertTriangle, ShieldAlert, Globe } from 'lucide-react';
import { CATEGORY_META } from '../data/puzzles';

// ─── Timer Ring component ──────────────────────────────────────────────────
function TimerRing({ timeLeft, total }) {
  const pct = timeLeft / total;
  const radius = 26;
  const circ = 2 * Math.PI * radius;
  const color = pct > 0.5 ? '#00FF99' : pct > 0.25 ? '#FF9500' : '#FF4444';
  return (
    <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
      <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <circle cx="32" cy="32" r={radius} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontFamily: 'monospace', fontWeight: 800,
        fontSize: '14px', color,
      }}>{timeLeft}s</div>
    </div>
  );
}

// ─── Anti-cheat overlay ────────────────────────────────────────────────────
function CheatOverlay({ reason, warnings, max, onDismiss }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10,10,10,0.97)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '2rem',
    }}>
      <ShieldAlert size={64} style={{ color: '#FF4444', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 20px #FF444460)' }} />
      <h2 style={{ color: '#FF4444', fontFamily: 'Orbitron, monospace', marginBottom: '0.75rem', fontSize: '1.5rem' }}>
        ⚠️ Integrity Warning
      </h2>
      <p style={{ color: '#A0A0A0', marginBottom: '0.5rem', maxWidth: '420px', lineHeight: 1.7 }}>{reason}</p>
      <p style={{ color: '#FF9500', fontWeight: 700, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Warning {warnings} of {max} — Reaching {max} forfeits this puzzle.
      </p>
      <button onClick={onDismiss} style={{
        background: 'linear-gradient(135deg, #FF4444, #FF9500)',
        color: '#fff', border: 'none', padding: '0.875rem 2rem',
        borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem',
      }}>
        I Understand — Return to Puzzle
      </button>
    </div>
  );
}

// ─── Language Selector ─────────────────────────────────────────────────────
function LanguageSwitcher({ current, setLanguage }) {
  const langs = [
    { code: 'so', label: 'Soomaali' },
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <Globe size={14} style={{ color: '#A0A0A0', marginLeft: '6px' }} />
      {langs.map(l => (
        <button
          key={l.code}
          onClick={() => setLanguage(l.code)}
          style={{
            background: current === l.code ? 'rgba(255,255,255,0.1)' : 'transparent',
            color: current === l.code ? '#fff' : '#606060',
            border: 'none', borderRadius: '4px', padding: '4px 8px',
            fontSize: '11px', fontWeight: current === l.code ? 700 : 500,
            cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main PuzzlePlayer ─────────────────────────────────────────────────────
const PuzzlePlayer = () => {
  const {
    language, setLanguage,
    activePuzzle, shuffledOptions, attempts, isSolved, feedback,
    timeLeft, initialTimeLimit, forfeited,
    cheatWarnings, cheatOverlay, cheatReason, MAX_WARNINGS,
    submitAnswer, dismissOverlay,
  } = usePuzzles();

  const [openAnswer, setOpenAnswer] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    setOpenAnswer('');
    if (inputRef.current) inputRef.current.focus();
  }, [activePuzzle, language]); // Refocus when language switches just in case

  if (!activePuzzle) return null;

  const meta = CATEGORY_META[activePuzzle.category] || { icon: '❓', color: '#A0A0A0' };
  const isOver = isSolved || forfeited;

  const blockCopy = (e) => e.preventDefault();
  const blockContext = (e) => e.preventDefault();

  const handleOpenSubmit = (e) => {
    e.preventDefault();
    if (!openAnswer.trim() || isOver) return;
    submitAnswer(openAnswer.trim());
    setOpenAnswer('');
  };

  const handleMCQ = (option) => {
    if (isOver) return;
    submitAnswer(option);
  };

  // Get translated text
  const questionText = typeof activePuzzle.question === 'object' 
    ? (activePuzzle.question[language] || activePuzzle.question['so'])
    : activePuzzle.question;

  const isRTL = language === 'ar';

  return (
    <>
      {cheatOverlay && (
        <CheatOverlay reason={cheatReason} warnings={cheatWarnings} max={MAX_WARNINGS} onDismiss={dismissOverlay} />
      )}

      <div style={{
        maxWidth: '800px', margin: '0 auto',
        background: 'var(--card-bg, #151515)',
        border: '1px solid var(--card-border, #1E1E1E)',
        borderRadius: '16px', overflow: 'hidden',
        position: 'relative'
      }}>

        {/* ── Header bar ───────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexWrap: 'wrap', gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{
              background: `${meta.color}20`, color: meta.color, border: `1px solid ${meta.color}40`,
              padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
            }}>
              {meta.icon} {activePuzzle.category}
            </span>
            <span style={{ fontSize: '12px', color: '#606060', fontWeight: 600 }}>
              +{activePuzzle.points}pts
            </span>
            
            {/* Language Switcher */}
            <LanguageSwitcher current={language} setLanguage={setLanguage} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {cheatWarnings > 0 && (
              <span style={{ fontSize: '12px', color: '#FF9500', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={14} /> {cheatWarnings}/{MAX_WARNINGS}
              </span>
            )}
            <TimerRing timeLeft={timeLeft} total={initialTimeLimit} />
          </div>
        </div>

        {/* ── Question (with Anti-OCR Protection) ──────────────────────────── */}
        <div
          onCopy={blockCopy}
          onCut={blockCopy}
          onContextMenu={blockContext}
          style={{
            padding: '3.5rem 2rem', textAlign: 'center',
            userSelect: 'none', WebkitUserSelect: 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Anti-OCR grid overlay (fools mobile cameras taking a photo) */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundSize: '4px 4px',
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
            zIndex: 1
          }}></div>

          <h2 style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            lineHeight: 1.5, fontWeight: 700, color: '#fff',
            fontFamily: isRTL ? 'Tahoma, Arial, sans-serif' : 'Inter, sans-serif',
            direction: isRTL ? 'rtl' : 'ltr',
            position: 'relative', zIndex: 2,
            textShadow: '0 0 1px rgba(255,255,255,0.1)', // slight blur for OCR
            letterSpacing: isRTL ? '0' : '-0.02em',
          }}>
            {/* DOM obfuscation to block web extensions */}
            {questionText.split('').map((char, i) => (
              <span key={i} data-ch={i}>{char}</span>
            ))}
          </h2>
        </div>

        {/* ── Answer area ──────────────────────────────────────────────────── */}
        <div style={{ padding: '0 2rem 2rem', direction: isRTL ? 'rtl' : 'ltr' }}>
          {isOver ? (
            <div style={{
              background: feedback?.type === 'success' ? 'rgba(0,255,153,0.08)' : 'rgba(255,68,68,0.08)',
              border: `1px solid ${feedback?.type === 'success' ? 'rgba(0,255,153,0.3)' : 'rgba(255,68,68,0.3)'}`,
              borderRadius: '12px', padding: '1.75rem', textAlign: 'center',
            }}>
              {feedback?.type === 'success'
                ? <CheckCircle2 size={40} style={{ color: '#00FF99', marginBottom: '0.75rem' }} />
                : <XCircle size={40} style={{ color: '#FF4444', marginBottom: '0.75rem' }} />
              }
              <p style={{ fontWeight: 800, fontSize: '1.1rem', color: feedback?.type === 'success' ? '#00FF99' : '#FF4444', marginBottom: '0.5rem' }}>
                {feedback?.message}
              </p>
              {feedback?.explanation && (
                <p style={{ color: '#A0A0A0', fontSize: '0.9rem', lineHeight: 1.6, marginTop: '0.75rem', maxWidth: '520px', margin: '0.75rem auto 0' }}>
                  <strong style={{ color: '#fff' }}>Explanation: </strong>{feedback.explanation}
                </p>
              )}
            </div>
          ) : activePuzzle.type === 'mcq' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {shuffledOptions.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleMCQ(option)}
                  onPaste={blockCopy}
                  style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '10px', padding: '1rem',
                    color: '#F0F0F0', fontSize: '0.95rem', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.2s', textAlign: isRTL ? 'right' : 'left',
                    lineHeight: 1.4, fontFamily: isRTL ? 'Tahoma, Arial, sans-serif' : 'inherit',
                  }}
                >
                  <span style={{ color: '#606060', margin: isRTL ? '0 0 0 8px' : '0 8px 0 0', fontFamily: 'monospace' }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleOpenSubmit} style={{ position: 'relative' }}>
              <input
                ref={inputRef} type="text"
                value={openAnswer} onChange={(e) => setOpenAnswer(e.target.value)}
                onPaste={blockCopy} autoComplete="off" spellCheck="false"
                placeholder={isRTL ? "اكتب إجابتك هنا..." : (language === 'so' ? "Halkan ku qor jawaabtaada..." : "Type your answer here...")}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#111', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', padding: '1rem',
                  paddingRight: isRTL ? '1rem' : '5rem',
                  paddingLeft: isRTL ? '5rem' : '1rem',
                  color: '#F0F0F0', fontSize: '1rem', outline: 'none',
                  fontFamily: isRTL ? 'Tahoma, Arial, sans-serif' : 'Inter, sans-serif',
                }}
              />
              <button type="submit" style={{
                position: 'absolute', right: isRTL ? 'auto' : '8px', left: isRTL ? '8px' : 'auto', top: '50%', transform: 'translateY(-50%)',
                background: 'linear-gradient(135deg, #00CFFF, #7A5CFF)',
                color: '#0A0A0A', border: 'none', borderRadius: '7px',
                padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <Send size={16} style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />
              </button>
            </form>
          )}

          {!isOver && (
            <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '11px', color: '#444', userSelect: 'none', fontFamily: 'monospace' }}>
              🛡 OCR Shield Active • AI Copying Blocked
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default PuzzlePlayer;
