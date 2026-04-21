import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Dumbbell, Plus, Trophy, Calendar, TrendingUp, Trash2 } from 'lucide-react';
import Modal from '../components/common/Modal';
import { calculateStreak, getWeekDays } from '../utils/calculations';
import { MUSCLE_GROUPS, EXERCISES } from '../utils/constants';

export default function Gym() {
  const { logWorkout, todayWorkouts, workoutDates, workouts } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('Chest');
  const [form, setForm] = useState({ exercise: '', sets: '', reps: '', weight: '' });

  const streak = calculateStreak(workoutDates);
  const weekDays = getWeekDays();
  const totalWorkouts = workoutDates.length;

  // Personal records (best weight for each exercise)
  const allWorkoutsList = Object.values(workouts).flat();
  const prs = {};
  allWorkoutsList.forEach(w => {
    if (w.weight && (!prs[w.exercise] || w.weight > prs[w.exercise])) {
      prs[w.exercise] = w.weight;
    }
  });

  // Last 7 days workout count
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    last7.push({
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      count: (workouts[key] || []).length,
    });
  }
  const maxCount = Math.max(...last7.map(d => d.count), 1);

  function handleSubmit() {
    if (!form.exercise) return;
    logWorkout({
      exercise: form.exercise,
      sets: Number(form.sets) || 0,
      reps: Number(form.reps) || 0,
      weight: Number(form.weight) || 0,
      muscleGroup: selectedGroup,
    });
    setForm({ exercise: '', sets: '', reps: '', weight: '' });
    setShowAdd(false);
  }

  return (
    <div className="animate-slide-up">
      <div className="page-header-actions">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="text-gradient">Training & Streaks</h1>
          <p className="text-secondary">Track your physical progress and build consistency.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={18} /> Log Workout
        </button>
      </div>

      {/* Streak + Stats */}
      <div className="grid-stats mt-lg">
        <div className="glass-card glow-purple" style={{ textAlign: 'center' }}>
          <div className="streak-fire" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔥</div>
          <div className="streak-count" style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{streak}</div>
          <div className="streak-label text-muted" style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', marginTop: '0.5rem' }}>Day Streak</div>
        </div>
        <div className="glass-card stat-card glow-purple">
          <div className="stat-card-icon purple"><Dumbbell size={24} /></div>
          <div className="stat-card-value text-gradient">{todayWorkouts.length}</div>
          <div className="stat-card-label">Exercises Today</div>
        </div>
        <div className="glass-card stat-card glow-cyan">
          <div className="stat-card-icon cyan"><Calendar size={24} /></div>
          <div className="stat-card-value" style={{ color: 'var(--accent-cyan)' }}>{totalWorkouts}</div>
          <div className="stat-card-label">Total Workout Days</div>
        </div>
        <div className="glass-card stat-card glow-amber">
          <div className="stat-card-icon amber"><Trophy size={24} /></div>
          <div className="stat-card-value" style={{ color: 'var(--accent-amber)' }}>{Object.keys(prs).length}</div>
          <div className="stat-card-label">Personal Records</div>
        </div>
      </div>

      {/* Week Overview */}
      <div className="glass-card mt-lg">
        <div className="flex-between mb-lg">
          <h3 className="section-title" style={{ margin: 0 }}><Calendar size={20} className="text-accent-purple" /> This Week</h3>
          <span className="badge badge-purple">{streak} Day Streak</span>
        </div>
        <div className="streak-days mb-lg">
          {weekDays.map(d => (
            <div key={d.date} className={`streak-day ${workoutDates.includes(d.date) ? 'completed' : d.isToday ? 'today' : ''}`}>
              {d.label}
            </div>
          ))}
        </div>
        <h4 className="text-secondary mb-md" style={{ fontSize: '0.875rem' }}>
          Last 7 Days Activity
        </h4>
        <div className="bar-chart">
          {last7.map((d, i) => (
            <div key={i} className="bar-chart-col">
              <div className="bar-chart-bar" style={{ height: `${(d.count / maxCount) * 100}%`, background: d.count > 0 ? 'var(--gradient-primary)' : 'var(--bg-glass)' }} />
              <span className="bar-chart-label">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Exercises */}
      <div className="grid-2 mt-lg" style={{ alignItems: 'start' }}>
        <div>
          <h2 className="section-title"><Dumbbell size={20} className="text-accent" /> Today's Exercises</h2>
          {todayWorkouts.length === 0 ? (
            <div className="glass-card empty-state">
              <Dumbbell />
              <h3>No workouts yet</h3>
              <p className="text-secondary">Log your first exercise to start your streak!</p>
              <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                <Plus size={18} /> Log Workout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {todayWorkouts.map(w => (
                <div key={w.id} className="list-item">
                  <div className="stat-card-icon purple" style={{ width: '36px', height: '36px', flexShrink: 0 }}>
                    <Dumbbell size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{w.exercise}</div>
                    <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: '4px', flexWrap: 'wrap' }}>
                      {w.sets > 0 && <span className="badge badge-purple">{w.sets} sets</span>}
                      {w.reps > 0 && <span className="badge badge-cyan">{w.reps} reps</span>}
                      {w.weight > 0 && <span className="badge badge-amber">{w.weight} kg</span>}
                    </div>
                  </div>
                  <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>{w.muscleGroup}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Personal Records */}
        <div>
          <h2 className="section-title"><Trophy size={20} className="text-accent-amber" /> Personal Records</h2>
          {Object.keys(prs).length === 0 ? (
            <div className="glass-card empty-state">
              <Trophy />
              <h3>No PRs yet</h3>
              <p className="text-secondary">Start logging workouts with weights to track your PRs</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {Object.entries(prs).slice(0, 10).map(([exercise, weight]) => (
                <div key={exercise} className="list-item">
                  <Trophy size={16} className="text-accent-amber" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{exercise}</div>
                  </div>
                  <span className="badge badge-amber">{weight} kg</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Workout Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Log Workout">
        <div className="form-group">
          <label className="form-label">Muscle Group</label>
          <div className="tabs">
            {MUSCLE_GROUPS.slice(0, 6).map(g => (
              <button key={g} className={`tab ${selectedGroup === g ? 'active' : ''}`}
                onClick={() => { setSelectedGroup(g); setForm(p => ({ ...p, exercise: '' })); }}>
                {g}
              </button>
            ))}
          </div>
          <div className="tabs mt-sm">
            {MUSCLE_GROUPS.slice(6).map(g => (
              <button key={g} className={`tab ${selectedGroup === g ? 'active' : ''}`}
                onClick={() => { setSelectedGroup(g); setForm(p => ({ ...p, exercise: '' })); }}>
                {g}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Exercise</label>
          <select className="form-select" value={form.exercise}
            onChange={e => setForm(p => ({ ...p, exercise: e.target.value }))}>
            <option value="">Select exercise...</option>
            {(EXERCISES[selectedGroup] || []).map(ex => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Sets</label>
            <input className="form-input" type="number" placeholder="3" value={form.sets}
              onChange={e => setForm(p => ({ ...p, sets: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Reps</label>
            <input className="form-input" type="number" placeholder="10" value={form.reps}
              onChange={e => setForm(p => ({ ...p, reps: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Weight (kg)</label>
            <input className="form-input" type="number" placeholder="50" value={form.weight}
              onChange={e => setForm(p => ({ ...p, weight: e.target.value }))} />
          </div>
        </div>
        <button className="btn btn-primary w-full" onClick={handleSubmit}>Log Exercise</button>
      </Modal>
    </div>
  );
}
