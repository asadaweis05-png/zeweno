import React from 'react';

export default function PostCard({ post, communityName }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-2xl transition-shadow mb-4">
      <div className="flex items-center mb-2">
        <span className="text-indigo-400 font-medium mr-2">{communityName}</span>
        <span className="text-gray-400 text-sm">by {post.author}</span>
      </div>
      <p className="text-white mb-2">{post.content}</p>
      <div className="flex items-center space-x-4 text-gray-400 text-sm">
        <span>👍 {post.likes}</span>
      </div>
    </div>
  );
}
