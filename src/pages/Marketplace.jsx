import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AdUnit from '../components/common/AdUnit';
import {
  Sparkles, Zap, LayoutDashboard,
  Shield, Globe, Cpu, BookOpen
} from 'lucide-react';

export default function Marketplace() {
  const { profile } = useApp();
  const navigate = useNavigate();

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
      featured: true 
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
      featured: true 
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
      featured: true 
    },
  ];

  const upcomingApps = [
    { id: 'fin', to: '#', icon: Shield, title: 'FinanceVault', dev: 'Zeweno Labs', desc: 'Maareynta kharashyada iyo hantida oo ammaan ah, laguna shaqaysiinayo AI.', color: 'amber', tag: 'Dhowaan Filo' },
    { id: 'soc', to: '#', icon: Globe, title: 'SocialSync', dev: 'Zeweno Labs', desc: 'Hal madal oo lagu maareeyo baraha bulshada iyo falanqaynta xogta.', color: 'purple', tag: 'Dhowaan Filo' },
    { id: 'dev', to: '#', icon: Cpu, title: 'DevFlow', dev: 'Zeweno Systems', desc: 'Saaxiibka IDE ee cusub oo leh kormeerka wax-qabadka iyo xallinta khaladaadka waqtiga dhabta ah.', color: 'green', tag: 'Isku diwaangeli' },
  ];

  const AppCard = ({ app }) => {
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
            onClick={(e) => { e.stopPropagation(); app.to !== '#' && navigate(app.to); }}
          >
            {app.tag === 'Rakiban' ? 'Fur' : 'Hel'}
          </button>
          <div className="app-tag">{app.tag}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in marketplace-root section-full-width">
      <div className="marketplace-container">
        
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
              Hal madal, qalab aan xad lahayn. Si ammaan ah u maaree caafimaadkaaga, hantidaada, 
              iyo wax-soo-saarkaaga adoo adeegsanaya nidaamkayaga app-yada ee modular-ka ah.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/vitalflow')}>Bilow VitalFlow</button>
              <button className="btn btn-secondary btn-lg" onClick={() => window.location.href = 'https://exams-umber-eight.vercel.app/'}>Exams</button>
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
            {primaryApps.map(app => <AppCard key={app.id} app={app} />)}
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
            {upcomingApps.map(app => <AppCard key={app.id} app={app} />)}
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
