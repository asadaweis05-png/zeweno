import { NavLink, Link } from 'react-router-dom';
import {
  BookOpen, StickyNote, Brain, ArrowLeft, Sparkles, Zap,
  GraduationCap
} from 'lucide-react';

const examsUrl = import.meta.env.VITE_EXAMS_URL || 'https://exams.zeweno.com';

const navItems = [
  { section: 'Study Tools' },
  { to: '/studyflow', icon: BookOpen, label: 'Learning Hub', end: true },
  { to: '/studyflow/notes', icon: StickyNote, label: 'Smart Notes' },
  { to: '/studyflow/flashcards', icon: Brain, label: 'Flash Cards' },
  { to: examsUrl, icon: GraduationCap, label: 'Exams', isExternal: true },
];

export default function StudySidebar() {
  return (
    <aside className="sidebar study-sidebar">
      <Link to="/" className="sidebar-link" style={{ margin: '1rem', marginBottom: '0', background: 'var(--bg-deep)' }}>
        <ArrowLeft size={18} />
        <span>Marketplace</span>
      </Link>
      <div className="sidebar-logo">
        <span className="logo-text study-logo">studyflow</span>
        <span className="logo-badge"><Zap size={10} />OS</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if (item.section) {
            return (
              <div key={i} className="sidebar-section-label">
                {item.section}
              </div>
            );
          }
          const Icon = item.icon;
          if (item.isExternal) {
            return (
              <a
                key={item.label}
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-link"
              >
                <Icon size={20} strokeWidth={2} />
                <span>{item.label}</span>
              </a>
            );
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer-badge">
        <Sparkles size={14} />
        <span>AI-Powered Learning</span>
      </div>
    </aside>
  );
}
