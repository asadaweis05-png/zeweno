import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Plus, Trash2, Search, Calculator } from 'lucide-react';
import ProgressRing from '../components/common/ProgressRing';
import Modal from '../components/common/Modal';
import AdUnit from '../components/common/AdUnit';
import { calculateBMR, calculateTDEE, calculateMacros } from '../utils/calculations';
import { COMMON_FOODS, ACTIVITY_LEVELS } from '../utils/constants';

export default function Calories() {
  const { profile, setProfile, addMeal, removeMeal, todayMeals, todayCalories } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [search, setSearch] = useState('');
  const [customMeal, setCustomMeal] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });

  const bmr = calculateBMR(profile.gender, profile.weight, profile.height, profile.age);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const calorieGoal = profile.goal === 'lose' ? tdee - 500 : profile.goal === 'gain' ? tdee + 400 : tdee;
  const macros = calculateMacros(calorieGoal, profile.goal);
  const consumed = {
    protein: todayMeals.reduce((s, m) => s + (m.protein || 0), 0),
    carbs: todayMeals.reduce((s, m) => s + (m.carbs || 0), 0),
    fat: todayMeals.reduce((s, m) => s + (m.fat || 0), 0),
  };

  const filteredFoods = COMMON_FOODS.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleAddFood(food) {
    addMeal(food);
    setShowAdd(false);
    setSearch('');
  }

  function handleAddCustom() {
    if (!customMeal.name || !customMeal.calories) return;
    addMeal({
      name: customMeal.name,
      calories: Number(customMeal.calories),
      protein: Number(customMeal.protein) || 0,
      carbs: Number(customMeal.carbs) || 0,
      fat: Number(customMeal.fat) || 0,
    });
    setCustomMeal({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    setShowAdd(false);
  }

  const macroBars = [
    { label: 'Protein', current: consumed.protein, goal: macros.protein, unit: 'g', color: 'var(--accent-cyan)' },
    { label: 'Carbs', current: consumed.carbs, goal: macros.carbs, unit: 'g', color: 'var(--accent-purple)' },
    { label: 'Fat', current: consumed.fat, goal: macros.fat, unit: 'g', color: 'var(--accent-pink)' },
  ];

  return (
    <div className="animate-slide-up">
      <div className="page-header-actions">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="text-gradient">Nutrition & Calories</h1>
          <p className="text-secondary">Fuel your body with precision and intention.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="btn btn-secondary" onClick={() => setShowCalc(true)}>
            <Calculator size={18} /> TDEE Calculator
          </button>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={18} /> Add Meal
          </button>
        </div>
      </div>

      {/* Ad 1 — After header */}
      <AdUnit format="horizontal" className="ad-page-bottom" />

      {/* Progress Overview */}
      <div className="grid-2 mt-lg" style={{ alignItems: 'stretch' }}>
        <div className="glass-card glow-cyan" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
          <ProgressRing
            value={todayCalories} max={calorieGoal} size={160} strokeWidth={14}
            label="kcal" valueLabel={todayCalories}
            color={todayCalories > calorieGoal ? 'var(--accent-red)' : 'var(--accent-cyan)'}
          />
          <div>
            <h3 style={{ marginBottom: 'var(--space-sm)' }}>Daily Progress</h3>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
              Goal: <strong className="text-gradient">{calorieGoal} kcal</strong>
            </p>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
              Consumed: <strong style={{ color: 'var(--accent-cyan)' }}>{todayCalories} kcal</strong>
            </p>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
              Remaining: <strong>{Math.max(0, calorieGoal - todayCalories)} kcal</strong>
            </p>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="mb-lg">Macros Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {macroBars.map(m => (
              <div key={m.label}>
                <div className="flex-between mb-xs" style={{ marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{m.label}</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {m.current}{m.unit} / {m.goal}{m.unit}
                  </span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 'var(--radius-full)',
                    background: m.color, width: `${Math.min((m.current / m.goal) * 100, 100)}%`,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ad 2 — Between progress and meals */}
      <AdUnit format="auto" className="ad-page-bottom" />

      {/* Today's Meals */}
      <h2 className="section-title mt-xl">
        <Flame size={20} className="text-accent" /> Today's Meals
      </h2>
      {todayMeals.length === 0 ? (
        <div className="glass-card empty-state">
          <Flame />
          <h3>No meals logged yet</h3>
          <p className="text-secondary">Start tracking your nutrition by adding meals</p>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={18} /> Add Your First Meal
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {todayMeals.map(meal => (
            <div key={meal.id} className="list-item">
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{meal.name}</div>
                <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span className="badge badge-cyan">{meal.calories} kcal</span>
                  {meal.protein > 0 && <span className="badge badge-purple">P: {meal.protein}g</span>}
                  {meal.carbs > 0 && <span className="badge badge-amber">C: {meal.carbs}g</span>}
                  {meal.fat > 0 && <span className="badge badge-pink">F: {meal.fat}g</span>}
                </div>
              </div>
              <button className="btn btn-icon btn-ghost" onClick={() => removeMeal(meal.id)}>
                <Trash2 size={16} style={{ color: 'var(--accent-red)' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Ad 3 — After meals list */}
      <AdUnit format="horizontal" className="ad-page-bottom" />

      {/* Ad 4 — Page bottom */}
      <AdUnit format="auto" className="ad-page-bottom" />

      {/* Add Meal Modal */}
      <Modal isOpen={showAdd} onClose={() => { setShowAdd(false); setSearch(''); }} title="Add Meal">
        <div className="form-group">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search foods..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>
        </div>
        <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {filteredFoods.map((food, i) => (
            <button key={i} className="list-item" style={{ cursor: 'pointer', border: 'none', textAlign: 'left' }}
              onClick={() => handleAddFood(food)}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{food.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {food.calories} kcal · P:{food.protein}g · C:{food.carbs}g · F:{food.fat}g
                </div>
              </div>
              <Plus size={16} style={{ color: 'var(--accent-cyan)' }} />
            </button>
          ))}
        </div>
        <div className="divider" />
        <h4 style={{ fontSize: '0.875rem' }}>Custom Entry</h4>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" placeholder="e.g. Grilled Chicken" value={customMeal.name}
              onChange={e => setCustomMeal(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Calories</label>
            <input className="form-input" type="number" placeholder="0" value={customMeal.calories}
              onChange={e => setCustomMeal(p => ({ ...p, calories: e.target.value }))} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Protein (g)</label>
            <input className="form-input" type="number" placeholder="0" value={customMeal.protein}
              onChange={e => setCustomMeal(p => ({ ...p, protein: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Carbs (g)</label>
            <input className="form-input" type="number" placeholder="0" value={customMeal.carbs}
              onChange={e => setCustomMeal(p => ({ ...p, carbs: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Fat (g)</label>
            <input className="form-input" type="number" placeholder="0" value={customMeal.fat}
              onChange={e => setCustomMeal(p => ({ ...p, fat: e.target.value }))} />
          </div>
        </div>
        <button className="btn btn-primary w-full" onClick={handleAddCustom}>Add Custom Meal</button>
      </Modal>

      {/* TDEE Calculator Modal */}
      <Modal isOpen={showCalc} onClose={() => setShowCalc(false)} title="TDEE Calculator">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select className="form-select" value={profile.gender}
              onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Age</label>
            <input className="form-input" type="number" value={profile.age}
              onChange={e => setProfile(p => ({ ...p, age: Number(e.target.value) }))} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Weight (kg)</label>
            <input className="form-input" type="number" value={profile.weight}
              onChange={e => setProfile(p => ({ ...p, weight: Number(e.target.value) }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Height (cm)</label>
            <input className="form-input" type="number" value={profile.height}
              onChange={e => setProfile(p => ({ ...p, height: Number(e.target.value) }))} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Activity Level</label>
          <select className="form-select" value={profile.activityLevel}
            onChange={e => setProfile(p => ({ ...p, activityLevel: e.target.value }))}>
            {ACTIVITY_LEVELS.map(a => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Goal</label>
          <select className="form-select" value={profile.goal}
            onChange={e => setProfile(p => ({ ...p, goal: e.target.value }))}>
            <option value="lose">Lose Weight (-500 kcal)</option>
            <option value="maintain">Maintain Weight</option>
            <option value="gain">Build Muscle (+400 kcal)</option>
          </select>
        </div>
        <div className="glass-card" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>BMR</span>
            <span style={{ fontWeight: 700 }}>{Math.round(bmr)} kcal</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>TDEE</span>
            <span style={{ fontWeight: 700 }}>{tdee} kcal</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Daily Target</span>
            <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{calorieGoal} kcal</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
