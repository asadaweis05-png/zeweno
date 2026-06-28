import React from 'react';
import { useParams } from 'react-router-dom';
import { useCommunity } from '../../communityhub/context/CommunityContext';

export default function CommunityDetail() {
  const { id } = useParams();
  const { communities, posts } = useCommunity();

  const community = communities.find((c) => c.id === id);
  const communityPosts = posts.filter((p) => p.communityId === id);

  if (!community) {
    return <div className="p-4 text-gray-400">Community not found.</div>;
  }

  return (
    <div className="ch-main p-4">
      <h2 className="text-3xl font-bold text-white">{community.name}</h2>
      <p className="text-gray-300 mb-4">{community.description}</p>
      <h3 className="text-2xl font-semibold text-indigo-400 mb-2">Posts</h3>
      {communityPosts.length > 0 ? (
        communityPosts.map((post) => (
          <div key={post.id} className="ch-card mb-2">
            <p className="text-white mb-2">{post.content}</p>
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <span>👍 {post.likes}</span>
              <span>by {post.author}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No posts in this community.</p>
      )}
    </div>
  );
}
