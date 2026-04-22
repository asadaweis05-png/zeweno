import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart, Droplets, Footprints, Pill, Plus, Activity,
  AlertCircle, CheckCircle2, ArrowUpDown,
} from 'lucide-react';
import Modal from '../components/common/Modal';
import ProgressRing from '../components/common/ProgressRing';
import AdUnit from '../components/common/AdUnit';
import { stepsToCalories, stepsToDistance } from '../utils/calculations';
import {
  BLOOD_TYPES, BLOOD_TYPE_COMPATIBILITY, COMMON_BLOOD_TESTS,
  VITAMINS, GUT_HEALTH_FACTORS,
} from '../utils/constants';

export default function Health() {
  const {
    profile, setProfile, bloodTests, addBloodTest,
    todaySteps, logSteps, toggleVitamin, todayVitamins,
    updateGutScore, todayGutScores,
  } = useApp();

  const [tab, setTab] = useState('overview');
  const [showAddTest, setShowAddTest] = useState(false);
  const [testForm, setTestForm] = useState({ testName: '', value: '' });
  const [stepInput, setStepInput] = useState('');

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'blood', label: '🩸 Blood' },
    { id: 'gut', label: '🦠 Gut Health' },
    { id: 'steps', label: '👣 Steps' },
    { id: 'vitamins', label: '💊 Vitamins' },
  ];

  const gutScore = GUT_HEALTH_FACTORS.length > 0
    ? Math.round(Object.values(todayGutScores).reduce((s, v) => s + v, 0) / GUT_HEALTH_FACTORS.length * 20)
    : 0;

  function handleAddTest() {
    if (!testForm.testName || !testForm.value) return;
    const testInfo = COMMON_BLOOD_TESTS.find(t => t.name === testForm.testName);
    addBloodTest({
      name: testForm.testName,
      value: Number(testForm.value),
      unit: testInfo?.unit || '',
      normalMin: testInfo?.normalMin,
      normalMax: testInfo?.normalMax,
    });
    setTestForm({ testName: '', value: '' });
    setShowAddTest(false);
  }

  function handleLogSteps() {
    if (stepInput) {
      logSteps(Number(stepInput));
      setStepInput('');
    }
  }

  const compat = BLOOD_TYPE_COMPATIBILITY[profile.bloodType];

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <h1 className="text-gradient">Health Dashboard</h1>
        <p className="text-secondary">Monitor your blood tests, gut health, steps & vitamins</p>
      </div>

      {/* Ad 1 — After header */}
      <AdUnit format="horizontal" className="ad-page-bottom" />

      {/* Tabs */}
      <div className="tabs mb-lg">
        {tabs.map(t => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Ad 2 — Below tabs */}
      <AdUnit format="auto" className="ad-page-bottom mb-lg" />

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview */}
        {tab === 'overview' && (
          <div className="grid-stats animate-fade-in">
            <div className="glass-card stat-card glow-pink" onClick={() => setTab('blood')} style={{ cursor: 'pointer' }}>
              <div className="stat-card-icon pink"><Droplets size={24} /></div>
              <div className="stat-card-value text-gradient">{profile.bloodType || '—'}</div>
              <div className="stat-card-label">Blood Type</div>
            </div>
            <div className="glass-card stat-card glow-cyan" onClick={() => setTab('steps')} style={{ cursor: 'pointer' }}>
              <div className="stat-card-icon cyan"><Footprints size={24} /></div>
              <div className="stat-card-value" style={{ color: 'var(--accent-cyan)' }}>{todaySteps.toLocaleString()}</div>
              <div className="stat-card-label">Steps Today</div>
            </div>
            <div className="glass-card stat-card glow-purple" onClick={() => setTab('gut')} style={{ cursor: 'pointer' }}>
              <div className="stat-card-icon green"><Activity size={24} /></div>
              <div className="stat-card-value" style={{ color: 'var(--accent-green)' }}>{gutScore}%</div>
              <div className="stat-card-label">Gut Health Score</div>
            </div>
            <div className="glass-card stat-card glow-amber" onClick={() => setTab('vitamins')} style={{ cursor: 'pointer' }}>
              <div className="stat-card-icon amber"><Pill size={24} /></div>
              <div className="stat-card-value" style={{ color: 'var(--accent-amber)' }}>{todayVitamins.length}/{VITAMINS.length}</div>
              <div className="stat-card-label">Vitamins Taken</div>
            </div>
            <div className="glass-card stat-card glow-blue">
              <div className="stat-card-icon blue"><Heart size={24} /></div>
              <div className="stat-card-value" style={{ color: 'var(--accent-blue)' }}>{bloodTests.length}</div>
              <div className="stat-card-label">Blood Tests Logged</div>
            </div>
            <div className="glass-card stat-card glow-purple">
              <div className="stat-card-icon purple"><ArrowUpDown size={24} /></div>
              <div className="stat-card-value" style={{ color: 'var(--accent-purple)' }}>{stepsToDistance(todaySteps)} km</div>
              <div className="stat-card-label">Distance Walked</div>
            </div>
          </div>
        )}

        {/* Blood Type & Tests */}
        {tab === 'blood' && (
          <div className="animate-fade-in">
            <div className="grid-2" style={{ alignItems: 'start' }}>
              <div className="glass-card glow-pink">
                <h3 className="section-title"><Droplets size={20} className="text-accent-pink" /> Blood Type</h3>
                <div className="form-group mb-lg">
                  <label className="form-label">Your blood type</label>
                  <select className="form-select" value={profile.bloodType}
                    onChange={e => setProfile(p => ({ ...p, bloodType: e.target.value }))}>
                    <option value="">Select...</option>
                    {BLOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                {compat && (
                  <div>
                    <div style={{ marginBottom: 'var(--space-md)' }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Can donate to:</span>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {compat.donatesTo.map(t => <span key={t} className="badge badge-green">{t}</span>)}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Can receive from:</span>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {compat.receivesFrom.map(t => <span key={t} className="badge badge-cyan">{t}</span>)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex-between mb-lg">
                  <h3 className="section-title" style={{ margin: 0 }}><Activity size={20} className="text-accent-purple" /> Blood Tests</h3>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowAddTest(true)}>
                    <Plus size={16} /> Add Test
                  </button>
                </div>
                {bloodTests.length === 0 ? (
                  <div className="glass-card empty-state">
                    <Activity size={32} className="text-muted" />
                    <h3>No blood tests logged</h3>
                    <p className="text-secondary">Add your blood test results to track them over time</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    {bloodTests.slice(-10).reverse().map(test => {
                      const isNormal = test.value >= test.normalMin && test.value <= test.normalMax;
                      return (
                        <div key={test.id} className="list-item">
                          {isNormal ?
                            <CheckCircle2 size={18} style={{ color: 'var(--accent-green)' }} /> :
                            <AlertCircle size={18} style={{ color: 'var(--accent-red)' }} />
                          }
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{test.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Normal: {test.normalMin}–{test.normalMax} {test.unit}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, color: isNormal ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                              {test.value} {test.unit}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{test.date}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <Modal isOpen={showAddTest} onClose={() => setShowAddTest(false)} title="Add Blood Test Result">
              <div className="form-group">
                <label className="form-label">Test</label>
                <select className="form-select" value={testForm.testName}
                  onChange={e => setTestForm(p => ({ ...p, testName: e.target.value }))}>
                  <option value="">Select test...</option>
                  {COMMON_BLOOD_TESTS.map(t => (
                    <option key={t.name} value={t.name}>{t.name} ({t.unit})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Value</label>
                <input className="form-input" type="number" step="0.1" placeholder="Enter result"
                  value={testForm.value} onChange={e => setTestForm(p => ({ ...p, value: e.target.value }))} />
              </div>
              <button className="btn btn-primary w-full" onClick={handleAddTest}>Save Result</button>
            </Modal>
          </div>
        )}

        {/* Gut Health */}
        {tab === 'gut' && (
          <div className="animate-fade-in">
            <div className="glass-card glow-cyan mb-lg" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)', flexWrap: 'wrap', justifyContent: 'center' }}>
              <ProgressRing value={gutScore} max={100} size={140} strokeWidth={12}
                label="Score" valueLabel={`${gutScore}%`}
                color={gutScore > 70 ? 'var(--accent-green)' : gutScore > 40 ? 'var(--accent-amber)' : 'var(--accent-red)'}
              />
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Gut Health Score</h3>
                <p className="text-secondary" style={{ fontSize: '0.875rem', maxWidth: '300px' }}>
                  Rate each factor from 1-5 to calculate your daily gut health score. High fiber and hydration are key!
                </p>
              </div>
            </div>

            <div className="grid-2">
              {GUT_HEALTH_FACTORS.map(factor => (
                <div key={factor.id} className="glass-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                    <span style={{ fontSize: '2rem' }}>{factor.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{factor.name}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        Current Rating: <strong className="text-gradient">{todayGutScores[factor.id] || 0}/5</strong>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map(score => (
                      <button key={score}
                        className={`btn btn-sm ${(todayGutScores[factor.id] || 0) >= score ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1, padding: '0.5rem' }}
                        onClick={() => updateGutScore(factor.id, score)}>
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Steps */}
        {tab === 'steps' && (
          <div className="animate-fade-in">
            <div className="glass-card glow-cyan mb-lg" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)', flexWrap: 'wrap', justifyContent: 'center' }}>
              <ProgressRing value={todaySteps} max={10000} size={160} strokeWidth={14}
                label="steps" valueLabel={todaySteps.toLocaleString()}
                color={todaySteps >= 10000 ? 'var(--accent-green)' : 'var(--accent-cyan)'}
              />
              <div>
                <h3 style={{ marginBottom: 'var(--space-sm)', fontSize: '1.75rem' }}>Daily Steps</h3>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                  Goal: <strong className="text-gradient">10,000 steps</strong>
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)', flexWrap: 'wrap' }}>
                  <span className="badge badge-cyan">{stepsToDistance(todaySteps)} km</span>
                  <span className="badge badge-amber">{stepsToCalories(todaySteps, profile.weight)} kcal burned</span>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
              <h3 className="section-title"><Footprints size={20} className="text-accent" /> Log Progress</h3>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <input className="form-input" type="number" placeholder="Enter steps (e.g. 5000)"
                  value={stepInput} onChange={setStepInput}
                  onKeyDown={e => e.key === 'Enter' && handleLogSteps()}
                />
                <button className="btn btn-primary" onClick={handleLogSteps}>Save Steps</button>
              </div>
              <div className="divider" />
              <div style={{ display: 'flex', gap: 'var(--space-xs)', justifyContent: 'center', flexWrap: 'wrap' }}>
                {[1000, 2500, 5000, 7500, 10000].map(n => (
                  <button key={n} className="btn btn-secondary btn-sm" onClick={() => logSteps(n)}>
                    +{n >= 1000 ? `${n / 1000}k` : n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Vitamins */}
        {tab === 'vitamins' && (
          <div className="animate-fade-in">
            <div className="glass-card mb-lg glow-amber">
              <div className="flex-between mb-md">
                <h3 className="section-title" style={{ margin: 0 }}><Pill size={20} className="text-accent-amber" /> Daily Vitamins & Supplements</h3>
                <span className="badge badge-green">
                  {todayVitamins.length}/{VITAMINS.length} taken
                </span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)', margin: '1.5rem 0' }}>
                <div style={{
                  height: '100%', borderRadius: 'var(--radius-full)',
                  background: 'var(--gradient-success)',
                  width: `${(todayVitamins.length / VITAMINS.length) * 100}%`,
                  transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }} />
              </div>
              <p className="text-muted" style={{ fontSize: '0.8rem', textAlign: 'center' }}>
                Keep your micronutrients in check for optimal performance.
              </p>
            </div>

            <div className="grid-3">
              {VITAMINS.map(v => {
                const taken = todayVitamins.includes(v.name);
                return (
                  <div key={v.name} className={`glass-card ${taken ? 'glow-green' : ''}`}
                    style={{
                      cursor: 'pointer',
                      border: taken ? '1px solid rgba(16,185,129,0.3)' : undefined,
                      background: taken ? 'rgba(16,185,129,0.08)' : undefined,
                      transform: taken ? 'scale(0.98)' : undefined,
                    }}
                    onClick={() => toggleVitamin(v.name)}
                  >
                    <div className="flex-between">
                      <span style={{ fontSize: '2rem' }}>{v.emoji}</span>
                      {taken && <div className="stat-card-icon green" style={{ width: '28px', height: '28px', marginBottom: 0 }}>
                        <CheckCircle2 size={16} />
                      </div>}
                    </div>
                    <div style={{ fontWeight: 700, marginTop: 'var(--space-md)', fontSize: '1rem' }}>{v.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>{v.benefit}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Ad 3 — Middle section ad */}
      <AdUnit format="horizontal" className="ad-page-bottom mt-xl" />

      {/* Ad 4 — Page bottom */}
      <AdUnit format="auto" className="ad-page-bottom" />
    </div>
  );
}
