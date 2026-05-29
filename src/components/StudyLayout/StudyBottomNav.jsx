import { NavLink } from 'react-router-dom';
import { BookOpen, StickyNote, Brain } from 'lucide-react';

const primaryItems = [
  { to: '/studyflow', icon: BookOpen, label: 'Learn', end: true },
  { to: '/studyflow/notes', icon: StickyNote, label: 'Notes' },
  { to: '/studyflow/flashcards', icon: Brain, label: 'Cards' },
];

export default function StudyBottomNav() {
  return (
    <nav className="bottom-nav study-bottom-nav">
      {primaryItems.map(item => {
        const Icon = item.icon;
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
