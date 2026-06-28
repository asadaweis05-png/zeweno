import React from 'react';
import { Link } from 'react-router-dom';
import { useCommunity } from '../../communityhub/context/CommunityContext';

export default function Communities() {
  const { communities } = useCommunity();

  return (
    <div className="ch-main p-4">
      <h2 className="text-2xl font-bold text-white mb-4">Communities</h2>
      {communities && communities.length > 0 ? (
        <div className="grid gap-4">
          {communities.map((comm) => (
            <div key={comm.id} className="ch-card">
              <Link to={`/communityhub/community/${comm.id}`} className="block">
                <h3 className="text-xl font-semibold text-indigo-400 mb-2">{comm.name}</h3>
                <p className="text-gray-400">{comm.description}</p>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No communities available.</p>
      )}
    </div>
  );
}
