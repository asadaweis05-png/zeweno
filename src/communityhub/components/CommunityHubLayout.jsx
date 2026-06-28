import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export default function CommunityHubLayout() {
  return (
    <div className="ch-layout">
      {/* Sidebar navigation */}
      <nav className="ch-sidebar">
        <h2 className="text-xl font-bold mb-4">Community Hub</h2>
        <ul className="space-y-2">
          <li>
            <NavLink to="/communityhub" end className={({ isActive }) => isActive ? 'text-indigo-400' : 'text-gray-300'}>Feed</NavLink>
          </li>
          <li>
            <NavLink to="/communityhub/communities" className={({ isActive }) => isActive ? 'text-indigo-400' : 'text-gray-300'}>Communities</NavLink>
          </li>
          <li>
            <NavLink to="/communityhub/news" className={({ isActive }) => isActive ? 'text-indigo-400' : 'text-gray-300'}>News</NavLink>
          </li>
          <li>
            <NavLink to="/communityhub/notifications" className={({ isActive }) => isActive ? 'text-indigo-400' : 'text-gray-300'}>Notifications</NavLink>
          </li>
        </ul>
      </nav>
      {/* Main content area with top bar */}
      <div className="ch-main flex flex-col">
        <header className="ch-header">
          <h1 className="text-2xl font-semibold text-white">Community Hub</h1>
        </header>
        <main className="flex-1 p-6 overflow-y-auto bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

