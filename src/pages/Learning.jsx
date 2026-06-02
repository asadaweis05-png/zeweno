import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen, Plus, Link2, Trash2, ExternalLink, Sparkles,
  Tag, Clock, Search, Video, Loader2,
} from 'lucide-react';
import Modal from '../components/common/Modal';
import AdUnit from '../components/common/AdUnit';
import { getGeminiUrl } from '../lib/gemini';

export default function Learning() {
  const { savedContent, addContent, removeContent, updateContent } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [summarizing, setSummarizing] = useState(null);
  const [search, setSearch] = useState('');

  function detectPlatform(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('tiktok.com')) return 'TikTok';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter/X';
    return 'Web';
  }

  function handleSave() {
    if (!url && !title) return;
    addContent({
      url: url.trim(),
      title: title.trim() || url.trim(),
      notes: notes.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      platform: detectPlatform(url),
      summary: '',
    });
    setUrl(''); setTitle(''); setNotes(''); setTags('');
    setShowAdd(false);
  }

  async function handleSummarize(item) {
    setSummarizing(item.id);
    try {
      const prompt = `Summarize the content from this link in a clear, concise way with key takeaways. Title: "${item.title}". URL: ${item.url}. ${item.notes ? `Additional notes: ${item.notes}` : ''} Give me a structured summary with: 1) Main Topic 2) Key Points (bullet points) 3) Takeaways`;

      const res = await fetch(
        getGeminiUrl(),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
      const data = await res.json();
      const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate summary.';

      updateContent(item.id, { summary });
      setSummarizing(null);
    } catch (err) {
      console.error(err);
      setSummarizing(null);
    }
  }

  const filtered = savedContent.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const platformColors = {
    YouTube: 'red',
    TikTok: 'pink',
    'Twitter/X': 'blue',
    Web: 'cyan',
  };

  return (
    <div className="animate-slide-up">
      <div className="page-header-actions">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="text-gradient">Learning Hub</h1>
          <p className="text-secondary">Save, organize & summarize content from anywhere</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={18} /> Save Content
        </button>
      </div>

      {/* Ad 1 — After header */}
      <AdUnit format="horizontal" className="ad-page-bottom" />

      {/* Search & Overview Stats */}
      <div className="flex-between mb-lg flex-wrap gap-md">
        <div style={{ maxWidth: '400px', flex: 1 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search by title or tag..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <div className="badge badge-cyan">{savedContent.length} items</div>
          <div className="badge badge-purple">{savedContent.filter(c => c.summary).length} summarized</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid-stats mb-lg">
        <div className="glass-card stat-card glow-cyan">
          <div className="stat-card-icon cyan"><BookOpen size={24} /></div>
          <div className="stat-card-value text-gradient">{savedContent.length}</div>
          <div className="stat-card-label">Total Saved</div>
        </div>
        <div className="glass-card stat-card glow-purple">
          <div className="stat-card-icon purple"><Sparkles size={24} /></div>
          <div className="stat-card-value" style={{ color: 'var(--accent-purple)' }}>{savedContent.filter(c => c.summary).length}</div>
          <div className="stat-card-label">AI Summarized</div>
        </div>
        <div className="glass-card stat-card glow-red">
          <div className="stat-card-icon red" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)' }}><Video size={24} /></div>
          <div className="stat-card-value" style={{ color: 'var(--accent-red)' }}>{savedContent.filter(c => c.platform === 'YouTube').length}</div>
          <div className="stat-card-label">YouTube Sources</div>
        </div>
      </div>

      {/* Ad 2 — After stats */}
      <AdUnit format="auto" className="ad-page-bottom" />

      {/* Content List */}
      {filtered.length === 0 ? (
        <div className="glass-card empty-state">
          <BookOpen size={48} className="text-muted" />
          <h3>No content saved yet</h3>
          <p className="text-secondary">Save YouTube, TikTok, or any web content to learn and summarize later</p>
          <button className="btn btn-primary mt-md" onClick={() => setShowAdd(true)}>
            <Plus size={18} /> Save Your First Link
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {filtered.map(item => (
            <div key={item.id} className="glass-card glow-cyan">
              <div className="flex-between mb-sm">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flex: 1, minWidth: 0 }}>
                  <span className={`badge badge-${platformColors[item.platform] || 'cyan'}`}>
                    {item.platform}
                  </span>
                  <h3 style={{ fontSize: '1.125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
                    {item.title}
                  </h3>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-icon btn-ghost">
                      <ExternalLink size={18} />
                    </a>
                  )}
                  <button className="btn btn-icon btn-ghost" onClick={() => removeContent(item.id)}>
                    <Trash2 size={18} style={{ color: 'var(--accent-red)' }} />
                  </button>
                </div>
              </div>

              {item.url && (
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.url}
                </div>
              )}

              {item.notes && (
                <p className="text-secondary mb-md" style={{ fontSize: '0.9375rem', lineHeight: '1.5' }}>
                  {item.notes}
                </p>
              )}

              <div className="flex-between flex-wrap gap-md">
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {item.tags?.length > 0 && item.tags.map(tag => (
                    <span key={tag} className="badge badge-purple" style={{ textTransform: 'none', fontSize: '0.7rem' }}>
                      <Tag size={10} style={{ marginRight: '4px' }} /> {tag}
                    </span>
                  ))}
                </div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                  <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  {new Date(item.savedAt).toLocaleDateString()}
                </div>
              </div>

              {item.summary && (
                <div className="mt-lg" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                  <div className="flex-between mb-md">
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={16} /> AI Summary & Key Takeaways
                    </div>
                  </div>
                  <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                    {item.summary}
                  </div>
                </div>
              )}

              {!item.summary && (
                <button className="btn btn-secondary btn-sm mt-lg"
                  onClick={() => handleSummarize(item)}
                  disabled={summarizing === item.id}>
                  {summarizing === item.id ? (
                    <><Loader2 size={16} className="spin" /> Summarizing...</>
                  ) : (
                    <><Sparkles size={16} /> Summarize with AI</>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Ad 3 — After content list */}
      <AdUnit format="horizontal" className="ad-page-bottom" />

      {/* Ad 4 — Page bottom */}
      <AdUnit format="auto" className="ad-page-bottom" />

      {/* Add Content Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Save Content">
        <div className="form-group">
          <label className="form-label">URL (YouTube, TikTok, or any link)</label>
          <input className="form-input" placeholder="https://..." value={url}
            onChange={e => setUrl(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-input" placeholder="What is this about?" value={title}
            onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Notes (optional)</label>
          <textarea className="form-textarea" placeholder="Your notes about this content..."
            value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
        </div>
        <div className="form-group">
          <label className="form-label">Tags (comma-separated)</label>
          <input className="form-input" placeholder="e.g. fitness, nutrition, recipes"
            value={tags} onChange={e => setTags(e.target.value)} />
        </div>
        <button className="btn btn-primary w-full" onClick={handleSave}>Save Content</button>
      </Modal>
    </div>
  );
}
