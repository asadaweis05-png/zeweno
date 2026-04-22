import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Brain, Plus, Trash2, Edit3, RotateCcw, ChevronLeft, ChevronRight, Check, X, Layers } from 'lucide-react';
import Modal from '../components/common/Modal';
import AdUnit from '../components/common/AdUnit';

export default function FlashCards() {
  const { flashDecks, addFlashDeck, updateFlashDeck, deleteFlashDeck } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [studyDeck, setStudyDeck] = useState(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [deckForm, setDeckForm] = useState({ name: '', description: '' });
  const [cardForm, setCardForm] = useState({ front: '', back: '' });
  const [addingCard, setAddingCard] = useState(null);

  function handleCreateDeck() {
    if (!deckForm.name) return;
    addFlashDeck({ name: deckForm.name, description: deckForm.description, cards: [] });
    setDeckForm({ name: '', description: '' });
    setShowAdd(false);
  }

  function handleAddCard(deckId) {
    if (!cardForm.front || !cardForm.back) return;
    const deck = flashDecks.find(d => d.id === deckId);
    if (!deck) return;
    const newCards = [...(deck.cards || []), {
      id: Date.now().toString(36),
      front: cardForm.front,
      back: cardForm.back,
      mastered: false,
    }];
    updateFlashDeck(deckId, { cards: newCards });
    setCardForm({ front: '', back: '' });
  }

  function handleRemoveCard(deckId, cardId) {
    const deck = flashDecks.find(d => d.id === deckId);
    if (!deck) return;
    updateFlashDeck(deckId, { cards: deck.cards.filter(c => c.id !== cardId) });
  }

  function handleToggleMastered(deckId, cardId) {
    const deck = flashDecks.find(d => d.id === deckId);
    if (!deck) return;
    updateFlashDeck(deckId, {
      cards: deck.cards.map(c => c.id === cardId ? { ...c, mastered: !c.mastered } : c)
    });
  }

  function startStudy(deck) {
    setStudyDeck(deck);
    setCurrentCard(0);
    setFlipped(false);
  }

  function nextCard() {
    if (studyDeck && currentCard < studyDeck.cards.length - 1) {
      setCurrentCard(c => c + 1);
      setFlipped(false);
    }
  }

  function prevCard() {
    if (currentCard > 0) {
      setCurrentCard(c => c - 1);
      setFlipped(false);
    }
  }

  // Study Mode
  if (studyDeck) {
    const deck = flashDecks.find(d => d.id === studyDeck.id) || studyDeck;
    const cards = deck.cards || [];

    if (cards.length === 0) {
      return (
        <div className="animate-slide-up">
          <div className="glass-card empty-state">
            <Brain />
            <h3>No cards in this deck</h3>
            <p>Add some flash cards first</p>
            <button className="btn btn-primary" onClick={() => setStudyDeck(null)}>
              Go Back
            </button>
          </div>
        </div>
      );
    }

    const card = cards[currentCard];
    const mastered = cards.filter(c => c.mastered).length;

    return (
      <div className="animate-slide-up">
        <div className="flex-between mb-lg">
          <button className="btn btn-ghost" onClick={() => setStudyDeck(null)}>
            <ChevronLeft size={18} /> Back to Decks
          </button>
          <h2 style={{ fontSize: '1.25rem' }}>{deck.name}</h2>
          <span className="badge badge-green">{mastered}/{cards.length} mastered</span>
        </div>

        {/* Progress */}
        <div style={{ height: '4px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-xl)' }}>
          <div style={{
            height: '100%', borderRadius: 'var(--radius-full)',
            background: 'var(--gradient-primary)',
            width: `${((currentCard + 1) / cards.length) * 100}%`,
            transition: 'width 0.3s ease',
          }} />
        </div>

        {/* Flash Card */}
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className={`flashcard ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(!flipped)}>
            <div className="flashcard-inner">
              <div className="flashcard-front">
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
                    QUESTION · Click to flip
                  </div>
                  {card.front}
                </div>
              </div>
              <div className="flashcard-back">
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: 'var(--space-sm)' }}>
                    ANSWER
                  </div>
                  {card.back}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)', marginTop: 'var(--space-xl)' }}>
            <button className="btn btn-secondary" onClick={prevCard} disabled={currentCard === 0}>
              <ChevronLeft size={18} /> Prev
            </button>
            <button className="btn btn-ghost" onClick={() => setFlipped(!flipped)}>
              <RotateCcw size={18} /> Flip
            </button>
            <button className={`btn ${card.mastered ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleToggleMastered(deck.id, card.id)}>
              <Check size={18} /> {card.mastered ? 'Mastered' : 'Got it'}
            </button>
            <button className="btn btn-secondary" onClick={nextCard}
              disabled={currentCard === cards.length - 1}>
              Next <ChevronRight size={18} />
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-md)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Card {currentCard + 1} of {cards.length}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="page-header-actions">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="text-gradient">Flash Cards</h1>
          <p className="text-secondary">Study smarter with spaced repetition decks</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={18} /> New Deck
        </button>
      </div>

      {/* Ad 1 — After header */}
      <AdUnit format="horizontal" className="ad-page-bottom" />

      {/* Stats Cards */}
      <div className="grid-stats mt-lg mb-lg">
        <div className="glass-card stat-card glow-amber">
          <div className="stat-card-icon amber"><Layers size={24} /></div>
          <div className="stat-card-value text-gradient">{flashDecks.length}</div>
          <div className="stat-card-label">Total Decks</div>
        </div>
        <div className="glass-card stat-card glow-purple">
          <div className="stat-card-icon purple"><Brain size={24} /></div>
          <div className="stat-card-value" style={{ color: 'var(--accent-purple)' }}>{flashDecks.reduce((s, d) => s + (d.cards?.length || 0), 0)}</div>
          <div className="stat-card-label">Total Cards</div>
        </div>
        <div className="glass-card stat-card glow-green">
          <div className="stat-card-icon green"><Check size={24} /></div>
          <div className="stat-card-value" style={{ color: 'var(--accent-green)' }}>
            {flashDecks.reduce((s, d) => s + (d.cards?.filter(c => c.mastered)?.length || 0), 0)}
          </div>
          <div className="stat-card-label">Mastered Cards</div>
        </div>
      </div>

      {/* Ad 2 — After stats */}
      <AdUnit format="auto" className="ad-page-bottom" />

      {/* Decks Grid */}
      {flashDecks.length === 0 ? (
        <div className="glass-card empty-state">
          <Brain size={48} className="text-muted" />
          <h3>No flash card decks yet</h3>
          <p className="text-secondary">Create your first deck and start studying</p>
          <button className="btn btn-primary mt-md" onClick={() => setShowAdd(true)}>
            <Plus size={18} /> Create Deck
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {flashDecks.map(deck => {
            const mastered = deck.cards?.filter(c => c.mastered)?.length || 0;
            const total = deck.cards?.length || 0;
            const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

            return (
              <div key={deck.id} className="glass-card glow-amber" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="flex-between mb-md">
                  <span className="badge badge-amber">{total} cards</span>
                  <button className="btn btn-icon btn-ghost btn-sm" onClick={() => {
                    if (confirm('Delete this deck?')) deleteFlashDeck(deck.id);
                  }}>
                    <Trash2 size={16} style={{ color: 'var(--accent-red)' }} />
                  </button>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', fontWeight: 700 }}>{deck.name}</h3>
                {deck.description && (
                  <p className="text-secondary mb-lg" style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {deck.description}
                  </p>
                )}

                {/* Progress bar */}
                <div style={{ marginTop: 'auto' }}>
                  <div className="flex-between mb-xs" style={{ fontSize: '0.75rem' }}>
                    <span className="text-muted">{mastered} mastered</span>
                    <span className="text-gradient font-bold">{pct}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)' }}>
                    <div style={{
                      height: '100%', background: 'var(--gradient-success)',
                      borderRadius: 'var(--radius-full)', width: `${pct}%`,
                      transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1.5 }}
                    onClick={() => startStudy(deck)} disabled={total === 0}>
                    <Brain size={14} style={{ marginRight: '6px' }} /> Study Deck
                  </button>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}
                    onClick={() => setAddingCard(addingCard === deck.id ? null : deck.id)}>
                    <Plus size={14} style={{ marginRight: '4px' }} /> Add
                  </button>
                </div>

                {/* Add card inline */}
                {addingCard === deck.id && (
                  <div className="animate-fade-in mt-lg pt-lg" style={{ borderTop: '1px solid var(--card-border)' }}>
                    <div className="form-group mb-sm">
                      <input className="form-input" placeholder="Question (front)" value={cardForm.front}
                        onChange={e => setCardForm(p => ({ ...p, front: e.target.value }))} />
                    </div>
                    <div className="form-group mb-sm">
                      <input className="form-input" placeholder="Answer (back)" value={cardForm.back}
                        onChange={e => setCardForm(p => ({ ...p, back: e.target.value }))} />
                    </div>
                    <button className="btn btn-primary btn-sm w-full" onClick={() => handleAddCard(deck.id)}>
                      Save Flash Card
                    </button>

                    {/* Quick cards list */}
                    {deck.cards?.length > 0 && (
                      <div className="mt-md" style={{ maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                        {deck.cards.slice().reverse().map(c => (
                          <div key={c.id} className="list-item" style={{ padding: '8px', fontSize: '0.8125rem' }}>
                            <span style={{ flex: 1, color: c.mastered ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                              {c.front}
                            </span>
                            <button className="btn btn-icon btn-ghost btn-xs" onClick={() => handleRemoveCard(deck.id, c.id)}>
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Ad 3 — After decks */}
      <AdUnit format="horizontal" className="ad-page-bottom" />

      {/* Ad 4 — Page bottom */}
      <AdUnit format="auto" className="ad-page-bottom" />

      {/* Create Deck Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Create Flash Card Deck">
        <div className="form-group">
          <label className="form-label">Deck Name</label>
          <input className="form-input" placeholder="e.g. Biology Chapter 5" value={deckForm.name}
            onChange={e => setDeckForm(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Description (optional)</label>
          <textarea className="form-textarea" placeholder="What's this deck about?"
            value={deckForm.description} onChange={e => setDeckForm(p => ({ ...p, description: e.target.value }))}
            rows={3} />
        </div>
        <button className="btn btn-primary w-full" onClick={handleCreateDeck}>Create Deck</button>
      </Modal>
    </div>
  );
}
