import { useAuth } from '../wordbuz/context/AuthContext';
import { useApp } from '../context/AppContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdUnit from '../components/common/AdUnit';
import {
  Sparkles,
  Zap,
  LayoutDashboard,
  Shield,
  Globe,
  Cpu,
  BookOpen,
  Gamepad2,
} from 'lucide-react';

// App data definitions (static)
const primaryApps = [
  {
    id: 'vf',
    to: '/vitalflow',
    icon: LayoutDashboard,
    title: 'VitalFlow OS',
    dev: 'Zeweno Systems',
    desc: 'Nidaam dhammaystiran oo loogu talagalay caafimaadka iyo wax-soo-saarka. Lasoco kallooriyaasha, jimicsiga, bulshada gym, iyo qorshayaasha cuntada ee AI hal meel oo qura.',
    color: 'blue',
    tag: 'Rakiban',
    featured: true,
  },
  {
    id: 'sf',
    to: '/studyflow',
    icon: BookOpen,
    title: 'StudyFlow OS',
    dev: 'Zeweno Systems',
    desc: 'Goobta waxbarashada ee casriga ah. Ururso qoraallo, ku daabac xogta Flash Cards, oo ku baadh waxyaabaha aad baranayso adoo adeegsanaya AI-ka casriga ah.',
    color: 'purple',
    tag: 'Rakiban',
    featured: true,
  },
  {
    id: 'wb',
    to: '/wordbuz',
    icon: Sparkles,
    title: 'WordBuz OS',
    dev: 'Zeweno Systems',
    desc: 'Ciyaar xujooyin erayo ah oo madadaalo leh. Tijaabi garaadkaaga, baro erayo cusub, oo maskaxdaada ka shaqeysii.',
    color: 'amber',
    tag: 'Rakiban',
    featured: true,
  },
  {
    id: 'gz',
    to: '/gamezeweno',
    icon: Gamepad2,
    title: 'Gamezeweno OS',
    dev: 'Zeweno Systems',
    desc: 'Goobta ciyaaraha iyo suuqa koontooyinka. Iibso ama iibi koontooyinka eFootball & PUBG, akhri warar xiiso leh, oo ka qaybgal hadiyado bilaash ah.',
    color: 'emerald',
    tag: 'Rakiban',
    featured: true,
  },
];

const upcomingApps = [
  { id: 'fin', to: '#', icon: Shield, title: 'FinanceVault', dev: 'Zeweno Labs', desc: 'Maareynta kharashyada iyo hantida oo ammaan ah, laguna shaqaysiinayo AI.', color: 'amber', tag: 'Dhowaan Filo' },
  { id: 'soc', to: '#', icon: Globe, title: 'SocialSync', dev: 'Zeweno Labs', desc: 'Hal madal oo lagu maareeyo baraha bulshada iyo falanqaynta xogta.', color: 'purple', tag: 'Dhowaan Filo' },
  { id: 'dev', to: '#', icon: Cpu, title: 'DevFlow', dev: 'Zeweno Systems', desc: 'Saaxiibka IDE ee cusub oo leh kormeerka wax-qabadka iyo xallinta khaladaadka waqtiga dhabta ah.', color: 'green', tag: 'Isku diwaangeli' },
];

function AppCard({ app }) {
  const navigate = useNavigate();
  const Icon = app.icon;
  return (
    <div
      className={`app-card ${app.featured ? 'featured-card' : ''}`}
      onClick={() => app.to !== '#' && navigate(app.to)}
    >
      <div className={`app-icon ${app.color}`}>
        <Icon />
      </div>
      <div className="app-info">
        <div className="app-title">{app.title}</div>
        <div className="app-developer">{app.dev}</div>
        <div className="app-description">{app.desc}</div>
      </div>
      <div className="app-actions">
        <button
          className={`btn-launch ${app.tag === 'Rakiban' ? 'active' : ''}`}
          disabled={app.to === '#'}
          onClick={(e) => {
            e.stopPropagation();
            app.to !== '#' && navigate(app.to);
          }}
        >
          {app.tag === 'Rakiban' ? 'Fur' : 'Hel'}
        </button>
        <div className="app-tag">{app.tag}</div>
      </div>
    </div>
  );
}

export default function Marketplace() {
  const { user, login, logout, loading: authLoading } = useAuth();
  const { profile } = useApp();
  const navigate = useNavigate();

  // Referral handling: store code from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('referrer_code', ref);
    }
  }, []);

  const handleSignIn = async () => {
    const email = prompt('Enter email');
    const password = prompt('Enter password');
    if (email && password) {
      const result = await login(email, password);
      if (result.error) alert('Login failed: ' + result.error.message);
    }
  };

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <div className="animate-fade-in marketplace-root section-full-width">
      <div className="marketplace-container">
        {/* Auth Bar */}
        {!authLoading && (
          <div className="auth-bar" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {user ? (
              <>
                <span style={{ marginRight: '0.5rem' }}>Welcome, {user.email}</span>
                <button className="btn btn-outline" onClick={handleSignOut}>Sign Out</button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={handleSignIn}>Sign In / Sign Up</button>
            )}
          </div>
        )}
        {/* Global Hero */}
        <div className="marketplace-hero global-hero">
          <div className="marketplace-hero-content">
            <div className="marketplace-hero-badge">
              <Zap size={14} />
              Goobta Shaqada ee Mustaqbalka
            </div>
            <h1 className="hero-title">
              Mustaqbalka <span className="text-gradient">Software-ka Shakhsi ahaaneed</span>
            </h1>
            <p className="hero-desc">
              Hal madal, qalab aan xad lahayn. Si ammaan ah u maaree caafimaadkaaga, hantidaada, iyo wax-soo-saarkaaga adoo adeegsanaya nidaamkayaga app-yada ee modular-ka ah.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/vitalflow')}>
                Bilow VitalFlow
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => (window.location.href = 'https://exams-umber-eight.vercel.app/')}
              >
                Exams
              </button>
              <button className="btn btn-secondary btn-lg">Sahami Nidaamka</button>
            </div>
          </div>
          <div className="hero-stats-overlay">
            <div className="floating-bubble bubble-top"></div>
            <div className="floating-bubble bubble-bottom"></div>
          </div>
        </div>

        {/* Ad 1 — After hero */}
        <AdUnit format="auto" className="ad-marketplace" />

        {/* Installed Section */}
        <div className="marketplace-section">
          <div className="marketplace-section-header">
            <div className="marketplace-section-title">
              <LayoutDashboard size={24} />
              App-yadaada
            </div>
          </div>
          <div className="app-grid">
            {primaryApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>

        {/* Optimized Ad Placement — between sections */}
        <AdUnit format="horizontal" className="ad-marketplace" />

        {/* Explore Innovation Section */}
        <div className="marketplace-section">
          <div className="marketplace-section-header">
            <div className="marketplace-section-title">
              <Sparkles size={24} />
              Sahami Qolka Hal-abuurka
            </div>
            <span className="text-muted section-subtitle">Laguu soo xulay</span>
          </div>
          <div className="app-grid">
            {upcomingApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>

        {/* Ad 3 — After explore section */}
        <AdUnit format="auto" className="ad-marketplace" />

        <footer className="marketplace-footer">
          {/* Ad 4 — Footer ad */}
          <AdUnit format="horizontal" className="ad-marketplace" style={{ marginBottom: '2rem' }} />
          <div className="logo-text footer-logo">zeweno marketplace</div>
          <p className="text-muted">© 2026 Zeweno Systems. Xuquuqda oo dhan waa la dhowray.</p>
        </footer>
      </div>
    </div>
  );
}
