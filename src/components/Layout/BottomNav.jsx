import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Flame, Dumbbell, Heart, BookOpen,
} from 'lucide-react';

const primaryItems = [
  { to: '/vitalflow', icon: LayoutDashboard, label: 'Home' },
  { to: '/vitalflow/calories', icon: Flame, label: 'Feed' },
  { to: '/vitalflow/gym', icon: Dumbbell, label: 'Gym' },
  { to: '/vitalflow/health', icon: Heart, label: 'Health' },
  { to: '/vitalflow/learning', icon: BookOpen, label: 'Docs' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {primaryItems.map(item => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/vitalflow'}
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
