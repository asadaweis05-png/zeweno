import React from 'react';
import { useCommunity } from '../../communityhub/context/CommunityContext';

export default function Feed() {
  const { posts, communities } = useCommunity();

  const getCommunityName = (id) => {
    const comm = communities.find((c) => c.id === id);
    return comm ? comm.name : 'Unknown';
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Feed</h2>
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="ch-card">
            <div className="flex items-center mb-2">
              <span className="text-indigo-400 font-medium mr-2">{getCommunityName(post.community_id)}</span>
              <span className="text-gray-400 text-sm">by {post.author}</span>
            </div>
            <p className="text-white mb-2">{post.content}</p>
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <span>👍 {post.likes}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No posts to display.</p>
      )}
    </div>
  );
}


