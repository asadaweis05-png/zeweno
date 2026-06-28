import React from 'react';
import { useCommunity } from '../../communityhub/context/CommunityContext';

export default function UserDashboard() {
  const { communities, posts } = useCommunity();

  // Simple stats mock
  const joinedCount = communities.length;
  const postCount = posts.length;

  return (
    <div className="ch-main p-4">
      <h2 className="text-3xl font-bold text-white mb-4">Your Dashboard</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="ch-card" style={{ flex: '1 1 200px' }}>
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">Joined Communities</h3>
          <p className="text-white text-2xl">{joinedCount}</p>
        </div>
        <div className="ch-card" style={{ flex: '1 1 200px' }}>
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">Your Posts</h3>
          <p className="text-white text-2xl">{postCount}</p>
        </div>
      </div>
    </div>
  );
}
