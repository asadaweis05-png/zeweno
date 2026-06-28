import React from 'react';
import { useCommunity } from '../../communityhub/context/CommunityContext';

// Simple mock news data; can be replaced with real API later
const mockNews = [
  { id: 'n1', title: 'AI Breakthroughs in 2026', excerpt: 'New models achieve human-level reasoning...', date: '2026-06-20' },
  { id: 'n2', title: 'Gaming Industry Trends', excerpt: 'VR adoption reaches 70% of gamers...', date: '2026-06-15' },
  { id: 'n3', title: 'Tech Conference Highlights', excerpt: 'Keynote speakers discuss the future of web dev...', date: '2026-06-10' },
];

export default function News() {
  // In a real app this would come from context or API
  const news = mockNews;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">News</h2>
      {news.length > 0 ? (
        <ul className="space-y-4">
          {news.map((item) => (
            <li key={item.id} className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-semibold text-indigo-400 mb-1">{item.title}</h3>
              <p className="text-gray-300 mb-2">{item.excerpt}</p>
              <span className="text-gray-500 text-sm">{item.date}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No news available.</p>
      )}
    </div>
  );
}
