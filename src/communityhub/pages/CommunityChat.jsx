import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCommunity } from '../../communityhub/context/CommunityContext';
import ChatMessage from '../components/ChatMessage';

export default function CommunityChat() {
  const { id } = useParams();
  const { posts, setPosts } = useCommunity(); // using posts as mock chat messages
  const [newMsg, setNewMsg] = useState('');

  const handleSend = () => {
    if (!newMsg.trim()) return;
    const msg = {
      id: `msg-${Date.now()}`,
      communityId: id,
      author: 'You',
      content: newMsg,
      likes: 0,
    };
    setPosts((prev) => [...prev, msg]);
    setNewMsg('');
  };

  const chatMessages = posts.filter((p) => p.communityId === id);

  return (
    <div className="ch-main p-4 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-2">Chat - {id}</h2>
      <div className="max-h-80 overflow-y-auto space-y-2 mb-2">
        {chatMessages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
      </div>
      <div className="flex space-x-2 mt-2">
        <input
          className="flex-1 px-3 py-2 rounded bg-gray-800 text-white"
          placeholder="Type a message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
