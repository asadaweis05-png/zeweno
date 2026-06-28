import React from 'react';
import { useCommunity } from '../../communityhub/context/CommunityContext';

export default function Notifications() {
  // Mock notifications using posts liked or new community joins
  const { posts } = useCommunity();
  const notifications = posts.slice(0, 5).map(p => ({
    id: p.id,
    text: `New post in ${p.communityId}: \"${p.content}\"`,
  }));

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Notifications</h2>
      {notifications.length > 0 ? (
        <ul className="space-y-2">
          {notifications.map(n => (
            <li key={n.id} className="bg-gray-800 rounded-lg p-3 shadow">
              <p className="text-gray-300">{n.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No notifications.</p>
      )}
    </div>
  );
}
