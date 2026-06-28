import React, { useState } from 'react';
import { useCommunity } from '../../communityhub/context/CommunityContext';
import ChatMessage from '../components/ChatMessage';

export default function DirectMessages() {
  const { communities } = useCommunity();
  const [selectedChat, setSelectedChat] = useState(null);

  const mockConversations = [
    { id: 'c1', name: 'Alice', messages: [{ author: 'me', content: 'Hey Alice!' }, { author: 'Alice', content: 'Hi! How are you?' }] },
    { id: 'c2', name: 'Bob', messages: [{ author: 'Bob', content: 'Did you check the new game?' }, { author: 'me', content: 'Not yet, planning to.' }] },
  ];

  const openChat = (conv) => setSelectedChat(conv);

  return (
    <div className="ch-layout">
  <nav className="ch-sidebar">
    <h2 className="text-xl font-bold mb-4">Messages</h2>
    <ul className="space-y-2">
      {mockConversations.map((conv) => (
        <li key={conv.id} className="cursor-pointer hover:bg-gray-700 p-2 rounded" onClick={() => openChat(conv)}>
          <span className="text-white">{conv.name}</span>
        </li>
      ))}
    </ul>
  </nav>
  <main className="ch-main p-4">
    {selectedChat ? (
      <div>
        <h3 className="text-2xl font-bold text-indigo-400 mb-4">Chat with {selectedChat.name}</h3>
        <div className="space-y-3">
          {selectedChat.messages.map((msg, idx) => (
            <ChatMessage key={idx} message={{ author: msg.author, content: msg.content, id: `msg-${idx}` }} />
          ))}
        </div>
      </div>
    ) : (
      <p className="text-gray-400">Select a conversation to view messages.</p>
    )}
  </main>
</div>
  );
}
