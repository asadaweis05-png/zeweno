import React from 'react';

export default function ChatMessage({ message }) {
  return (
    <div className="bg-gray-700 rounded-md p-2 text-white">
      <div className="flex justify-between text-sm text-gray-300 mb-1">
        <span>{message.author}</span>
        <span>{new Date(message.id.split('-')[1]).toLocaleTimeString()}</span>
      </div>
      <p>{message.content}</p>
    </div>
  );
}
