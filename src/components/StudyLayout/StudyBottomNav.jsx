import { NavLink } from 'react-router-dom';
import { BookOpen, StickyNote, Brain, GraduationCap } from 'lucide-react';

const examsUrl = import.meta.env.VITE_EXAMS_URL || 'https://exams.zeweno.com';

const primaryItems = [
  { to: '/studyflow', icon: BookOpen, label: 'Learn', end: true },
  { to: '/studyflow/notes', icon: StickyNote, label: 'Notes' },
  { to: '/studyflow/flashcards', icon: Brain, label: 'Cards' },
  { to: examsUrl, icon: GraduationCap, label: 'Exams', isExternal: true },
];

export default function StudyBottomNav() {
  return (
    <nav className="bottom-nav study-bottom-nav">
      {primaryItems.map(item => {
        const Icon = item.icon;
        if (item.isExternal) {
          return (
            <a
              key={item.label}
              href={item.to}
              target="_blank"
              rel="noopener noreferrer"
              className="bottom-nav-item"
            >
              <div className="bottom-nav-icon-wrapper">
                <Icon size={20} strokeWidth={2} />
              </div>
              <span>{item.label}</span>
            </a>
          );
        }
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <div className="bottom-nav-icon-wrapper">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
