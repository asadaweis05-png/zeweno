import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { PageCard } from '../components/PageCard';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// Admin page to review pending puzzle winners and approve them.
const AdminWinners = () => {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to determine if the logged‑in user is an admin.
  const isAdmin = user && typeof user.email === 'string' && user.email.endsWith('@admin.com');

  const fetchPending = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('puzzle_winners')
        .select('id, email, avatar, puzzle_id, won_at')
        .eq('approved', false)
        .order('won_at', { ascending: true });
      if (error) throw error;
      setPending(data || []);
    } catch (err) {
      console.error('Failed to fetch pending winners:', err);
      setError('Unable to load pending winners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchPending();
  }, [isAdmin]);

  const approveWinner = async (winnerId) => {
    try {
      const { error } = await supabase
        .from('puzzle_winners')
        .update({ approved: true })
        .eq('id', winnerId);
      if (error) throw error;
      // Refresh the list after approval.
      setPending((prev) => prev.filter((w) => w.id !== winnerId));
    } catch (err) {
      console.error('Approve failed:', err);
      alert('Could not approve winner. Check console for details.');
    }
  };

  if (!user) {
    return (
      <PageCard>
        <div className="text-center py-8">
          <AlertTriangle size={48} className="mx-auto mb-4 text-warning" />
          <p>Please sign in to view this page.</p>
        </div>
      </PageCard>
    );
  }

  if (!isAdmin) {
    return (
      <PageCard>
        <div className="text-center py-8">
          <AlertTriangle size={48} className="mx-auto mb-4 text-warning" />
          <p>Access denied – admin only.</p>
        </div>
      </PageCard>
    );
  }

  return (
    <PageCard className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="text-center mb-xl">Admin – Pending Winners</h1>
      {loading ? (
        <div className="text-center py-8">Loading…</div>
      ) : error ? (
        <div className="text-center py-8 text-error">{error}</div>
      ) : pending.length === 0 ? (
        <div className="text-center py-8">No pending winners.</div>
      ) : (
        <ul className="space-y-4">
          {pending.map((w) => (
            <li key={w.id} className="flex items-center justify-between p-3 bg-glass rounded">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                  {w.email ? w.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="font-medium">{w.email}</p>
                  <p className="text-sm text-muted">Puzzle ID: {w.puzzle_id}</p>
                </div>
              </div>
              <button
                onClick={() => approveWinner(w.id)}
                className="btn btn-primary flex items-center gap-1"
              >
                <CheckCircle size={16} /> Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </PageCard>
  );
};

export default AdminWinners;
