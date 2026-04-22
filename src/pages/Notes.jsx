import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StickyNote, Plus, Trash2, Edit3, Search, Folder, Clock } from 'lucide-react';
import Modal from '../components/common/Modal';
import AdUnit from '../components/common/AdUnit';

export default function Notes() {
  const { notes, addNote, updateNote, deleteNote } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', content: '', folder: 'General' });
  const [activeFolder, setActiveFolder] = useState('All');

  const folders = ['All', ...new Set(notes.map(n => n.folder || 'General'))];

  const filtered = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = activeFolder === 'All' || (n.folder || 'General') === activeFolder;
    return matchesSearch && matchesFolder;
  });

  function handleSave() {
    if (!form.title.trim()) return;
    if (editing) {
      updateNote(editing, { title: form.title, content: form.content, folder: form.folder });
      setEditing(null);
    } else {
      addNote({ title: form.title, content: form.content, folder: form.folder });
    }
    setForm({ title: '', content: '', folder: 'General' });
    setShowAdd(false);
  }

  function handleEdit(note) {
    setForm({ title: note.title, content: note.content, folder: note.folder || 'General' });
    setEditing(note.id);
    setShowAdd(true);
  }

  function handleDelete(id) {
    if (confirm('Delete this note?')) {
      deleteNote(id);
    }
  }

  return (
    <div className="animate-slide-up">
      <div className="page-header-actions">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="text-gradient">Notes Hub</h1>
          <p className="text-secondary">Capture your thoughts and ideas securely</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ title: '', content: '', folder: 'General' }); setShowAdd(true); }}>
          <Plus size={18} /> New Note
        </button>
      </div>

      {/* Ad 1 — After header */}
      <AdUnit format="horizontal" className="ad-page-bottom" />

      {/* Search + Folders */}
      <div className="flex-between mb-lg flex-wrap gap-md">
        <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" placeholder="Search notes..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <div className="tabs">
          {folders.map(f => (
            <button key={f} className={`tab ${activeFolder === f ? 'active' : ''}`}
              onClick={() => setActiveFolder(f)}>
              <Folder size={12} style={{ display: 'inline', marginRight: '6px' }} />{f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid-stats mb-lg">
        <div className="glass-card stat-card glow-green">
          <div className="stat-card-icon green"><StickyNote size={24} /></div>
          <div className="stat-card-value text-gradient">{notes.length}</div>
          <div className="stat-card-label">Total Notes</div>
        </div>
        <div className="glass-card stat-card glow-purple">
          <div className="stat-card-icon purple"><Folder size={24} /></div>
          <div className="stat-card-value" style={{ color: 'var(--accent-purple)' }}>{new Set(notes.map(n => n.folder || 'General')).size}</div>
          <div className="stat-card-label">Folders Created</div>
        </div>
      </div>

      {/* Ad 2 — After stats */}
      <AdUnit format="auto" className="ad-page-bottom" />

      {/* Notes Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card empty-state">
          <StickyNote size={48} className="text-muted" />
          <h3>No notes yet</h3>
          <p className="text-secondary">Start writing your first note to capture your ideas</p>
          <button className="btn btn-primary mt-md" onClick={() => setShowAdd(true)}>
            <Plus size={18} /> Create Note
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(note => (
            <div key={note.id} className="glass-card glow-cyan" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="flex-between mb-md">
                <span className="badge badge-green">
                  <Folder size={10} style={{ marginRight: '4px' }} /> {note.folder || 'General'}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button className="btn btn-icon btn-ghost btn-sm" onClick={() => handleEdit(note)} style={{ borderRadius: 'var(--radius-sm)' }}>
                    <Edit3 size={14} />
                  </button>
                  <button className="btn btn-icon btn-ghost btn-sm" onClick={() => handleDelete(note.id)} style={{ borderRadius: 'var(--radius-sm)' }}>
                    <Trash2 size={14} style={{ color: 'var(--accent-red)' }} />
                  </button>
                </div>
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', fontWeight: 600 }}>{note.title}</h3>
              <p style={{
                fontSize: '0.9375rem', color: 'var(--text-secondary)', flex: 1,
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.6',
              }}>
                {note.content || 'No content'}
              </p>
              <div className="divider" style={{ margin: '1rem 0 0.75rem' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Last updated {new Date(note.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ad 3 — After notes grid */}
      <AdUnit format="horizontal" className="ad-page-bottom" />

      {/* Ad 4 — Page bottom */}
      <AdUnit format="auto" className="ad-page-bottom" />

      {/* Add/Edit Modal */}
      <Modal isOpen={showAdd} onClose={() => { setShowAdd(false); setEditing(null); }}
        title={editing ? 'Edit Note' : 'New Note'}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-input" placeholder="Note title..." value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Folder</label>
          <input className="form-input" placeholder="e.g. Work, Personal, Study" value={form.folder}
            onChange={e => setForm(p => ({ ...p, folder: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Content</label>
          <textarea className="form-textarea" placeholder="Write your note..."
            value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
            rows={8} style={{ minHeight: '200px' }} />
        </div>
        <button className="btn btn-primary w-full" onClick={handleSave}>
          {editing ? 'Update Note' : 'Save Note'}
        </button>
      </Modal>
    </div>
  );
}
