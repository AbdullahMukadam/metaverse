"use client"
import React from 'react';
import { ChatMessage } from '@/lib/chat/chatSlice';

interface MessageItemProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isOwnMessage }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`flex gap-3 p-3 hover:bg-black/5 transition-colors group ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
      {/* User Avatar */}
      <div className="flex-shrink-0 relative">
        {message.userImage ? (
          <img 
            src={message.userImage} 
            alt={message.userName}
            className="w-8 h-8 rounded-full border-2 border-black object-cover"
          />
        ) : (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-black ${
            isOwnMessage ? 'bg-black text-white' : 'bg-white text-black'
          }`}>
            <span className="text-xs font-bold font-mono">
              {message.userName.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 min-w-0 flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isOwnMessage ? 'text-black order-2' : 'text-gray-600 order-1'}`}>
            {isOwnMessage ? 'You' : message.userName}
          </span>
          <span className={`text-[9px] text-gray-400 font-mono ${isOwnMessage ? 'order-1' : 'order-2'}`}>
            {formatTime(message.timestamp)}
          </span>
        </div>
        
        <div className={`relative max-w-full text-sm px-4 py-2 font-sans border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] ${
          isOwnMessage 
            ? 'bg-black border-black text-white rounded-2xl rounded-tr-none' 
            : 'bg-white border-black text-black rounded-2xl rounded-tl-none'
        }`}>
          <div className="break-words relative z-10">
             {message.message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
