import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Salad, Sparkles, Settings, Loader2, ShoppingCart,
  Clock, ChevronDown, ChevronUp, Utensils, Target,
} from 'lucide-react';
import Modal from '../components/common/Modal';
import { calculateBMR, calculateTDEE, calculateMacros } from '../utils/calculations';
import { DIETARY_PREFERENCES, FITNESS_GOALS } from '../utils/constants';

export default function DietAI() {
  const { profile, setProfile, apiKey, setApiKey, mealPlans, addMealPlan } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [daysCount, setDaysCount] = useState(7);

  const bmr = calculateBMR(profile.gender, profile.weight, profile.height, profile.age);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const calorieGoal = profile.goal === 'lose' ? tdee - 500 : profile.goal === 'gain' ? tdee + 400 : tdee;
  const macros = calculateMacros(calorieGoal, profile.goal);

  async function generatePlan() {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    setGenerating(true);
    try {
      const goalLabel = FITNESS_GOALS.find(g => g.value === profile.goal)?.label || 'Maintain Weight';
      const prompt = `Generate a ${daysCount}-day meal plan for someone with the following profile:
- Goal: ${goalLabel}
- Daily calories: ${calorieGoal} kcal
- Macros: Protein ${macros.protein}g, Carbs ${macros.carbs}g, Fat ${macros.fat}g
- Dietary preference: ${profile.dietaryPreference || 'No Restrictions'}
- Gender: ${profile.gender}, Age: ${profile.age}, Weight: ${profile.weight}kg

Format the response as a JSON object with this exact structure:
{
  "planName": "Plan name",
  "days": [
    {
      "day": "Day 1",
      "meals": [
        {"time": "Breakfast", "name": "Meal name", "description": "Brief description", "calories": 400, "protein": 30, "carbs": 40, "fat": 15},
        {"time": "Lunch", "name": "...", "description": "...", "calories": 500, "protein": 35, "carbs": 50, "fat": 20},
        {"time": "Dinner", "name": "...", "description": "...", "calories": 500, "protein": 35, "carbs": 45, "fat": 20},
        {"time": "Snack", "name": "...", "description": "...", "calories": 200, "protein": 10, "carbs": 20, "fat": 8}
      ]
    }
  ],
  "shoppingList": ["item 1", "item 2", "item 3"],
  "tips": ["tip 1", "tip 2"]
}

Only respond with valid JSON, no markdown or other text.`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7 },
          }),
        }
      );

      const data = await res.json();
      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Clean JSON from markdown code blocks if present
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      const plan = JSON.parse(text);
      addMealPlan({
        ...plan,
        calorieGoal,
        macros,
        goal: profile.goal,
        preference: profile.dietaryPreference,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to generate meal plan. Please check your API key and try again.');
    }
    setGenerating(false);
  }

  return (
    <div className="animate-slide-up">
      <div className="page-header-actions">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="text-gradient">AI Diet Generator</h1>
          <p className="text-secondary">Get personalized meal plans powered by AI</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="btn btn-secondary" onClick={() => setShowSettings(true)}>
            <Settings size={18} /> Settings
          </button>
          <button className="btn btn-primary" onClick={generatePlan} disabled={generating}>
            {generating ? (
              <><Loader2 size={18} className="spin" /> Generating...</>
            ) : (
              <><Sparkles size={18} /> Generate Plan</>
            )}
          </button>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="grid-stats mt-lg mb-lg">
        <div className="glass-card stat-card glow-cyan">
          <div className="stat-card-icon cyan"><Target size={24} /></div>
          <div className="stat-card-label">Daily Calories</div>
          <div className="stat-card-value text-gradient">{calorieGoal}</div>
        </div>
        <div className="glass-card stat-card glow-purple">
          <div className="stat-card-icon purple"><Utensils size={24} /></div>
          <div className="stat-card-value" style={{ color: 'var(--accent-purple)' }}>{macros.protein}g</div>
          <div className="stat-card-label">Protein Goal</div>
        </div>
        <div className="glass-card stat-card glow-amber">
          <div className="stat-card-icon amber"><Utensils size={24} /></div>
          <div className="stat-card-value" style={{ color: 'var(--accent-amber)' }}>{macros.carbs}g</div>
          <div className="stat-card-label">Carbs Goal</div>
        </div>
        <div className="glass-card stat-card glow-pink">
          <div className="stat-card-icon pink"><Utensils size={24} /></div>
          <div className="stat-card-value" style={{ color: 'var(--accent-pink)' }}>{macros.fat}g</div>
          <div className="stat-card-label">Fat Goal</div>
        </div>
      </div>

      {/* Generation Options */}
      <div className="glass-card mb-lg">
        <h3 className="section-title mb-lg"><Sparkles size={20} className="text-accent" /> Generation Settings</h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Goal</label>
            <select className="form-select" value={profile.goal}
              onChange={e => setProfile(p => ({ ...p, goal: e.target.value }))}>
              {FITNESS_GOALS.map(g => (
                <option key={g.value} value={g.value}>{g.emoji} {g.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Dietary Preference</label>
            <select className="form-select" value={profile.dietaryPreference || 'No Restrictions'}
              onChange={e => setProfile(p => ({ ...p, dietaryPreference: e.target.value }))}>
              {DIETARY_PREFERENCES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Days</label>
            <select className="form-select" value={daysCount}
              onChange={e => setDaysCount(Number(e.target.value))}>
              <option value={1}>1 Day</option>
              <option value={3}>3 Days</option>
              <option value={5}>5 Days</option>
              <option value={7}>7 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generated Plans */}
      {mealPlans.length === 0 ? (
        <div className="glass-card empty-state">
          <Salad size={48} className="text-muted" />
          <h3>No meal plans yet</h3>
          <p className="text-secondary">Configure your preferences above and generate your first AI meal plan</p>
          <button className="btn btn-primary mt-md" onClick={generatePlan} disabled={generating}>
            <Sparkles size={18} /> Generate Your First Plan
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {mealPlans.map((plan, pi) => (
            <div key={plan.id} className="glass-card">
              <div className="flex-between mb-md" style={{ cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === pi ? null : pi)}>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>{plan.planName || `Meal Plan ${pi + 1}`}</h3>
                  <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: '6px', flexWrap: 'wrap' }}>
                    <span className="badge badge-cyan">{plan.calorieGoal} kcal/day</span>
                    <span className="badge badge-purple">{plan.preference}</span>
                    <span className="badge badge-amber">{plan.days?.length || 0} days</span>
                  </div>
                </div>
                {expanded === pi ? <ChevronUp size={24} className="text-secondary" /> : <ChevronDown size={24} className="text-secondary" />}
              </div>

              {expanded === pi && (
                <div className="animate-fade-in mt-xl">
                  {/* Days */}
                  {plan.days?.map((day, di) => (
                    <div key={di} style={{ marginBottom: '2.5rem' }}>
                      <h4 className="text-gradient mb-md" style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                        {day.day}
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {day.meals?.map((meal, mi) => (
                          <div key={mi} className="meal-card">
                            <div className="meal-time">{meal.time}</div>
                            <div className="meal-info" style={{ flex: 1 }}>
                              <h4>{meal.name}</h4>
                              <p>{meal.description}</p>
                              <div className="meal-macros">
                                <span className="badge badge-cyan">{meal.calories} kcal</span>
                                <span className="badge badge-purple">P: {meal.protein}g</span>
                                <span className="badge badge-amber">C: {meal.carbs}g</span>
                                <span className="badge badge-pink">F: {meal.fat}g</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Shopping List */}
                  {plan.shoppingList?.length > 0 && (
                    <div className="mt-xl">
                      <h4 className="section-title"><ShoppingCart size={20} className="text-accent-cyan" /> Shopping List</h4>
                      <div className="grid-3 mt-md">
                        {plan.shoppingList.map((item, i) => (
                          <div key={i} className="list-item" style={{ fontSize: '0.875rem' }}>
                            <div className="stat-card-icon green" style={{ width: '20px', height: '20px', marginBottom: 0 }}>
                              <ShoppingCart size={12} />
                            </div>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  {plan.tips?.length > 0 && (
                    <div className="mt-xl">
                      <h4 className="section-title"><Sparkles size={20} className="text-accent-purple" /> AI Tips</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="mt-md">
                        {plan.tips.map((tip, i) => (
                          <div key={i} className="list-item" style={{
                            fontSize: '0.875rem', color: 'var(--text-secondary)',
                            borderLeft: '4px solid var(--accent-purple)',
                          }}>
                            💡 {tip}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="divider" />
              <div className="flex-between">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  Generated {new Date(plan.createdAt).toLocaleDateString()}
                </div>
                {!expanded && <span className="text-accent" style={{ fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => setExpanded(pi)}>View 7 Days Plan &rarr;</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings Modal */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="AI Settings">
        <div className="form-group">
          <label className="form-label">Gemini API Key</label>
          <input className="form-input" type="password" placeholder="Enter your Gemini API key..."
            value={apiKey} onChange={e => setApiKey(e.target.value)} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Get your free API key from{' '}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
              Google AI Studio
            </a>
          </p>
        </div>
        <div className="form-group">
          <label className="form-label">Your Name</label>
          <input className="form-input" placeholder="Enter your name" value={profile.name}
            onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
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
        <button className="btn btn-primary w-full" onClick={() => setShowSettings(false)}>
          Save Settings
        </button>
      </Modal>
    </div>
  );
}
