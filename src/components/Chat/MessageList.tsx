"use client"
import React, { useEffect, useRef } from 'react';
import { useAppSelector } from '@/lib/hooks';
import MessageItem from './MessageItem';
import { ChatMessage } from '@/lib/chat/chatSlice';

interface MessageListProps {
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ currentUserId }) => {
  const messages = useAppSelector((state) => state.chat?.messages ?? []);
  const typingUsers = useAppSelector((state) => state.chat?.typingUsers ?? []);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="text-slate-600 text-sm">
              No messages yet
            </div>
            <div className="text-slate-700 text-xs">
              Start the conversation!
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          {messages.map((message: ChatMessage) => (
            <MessageItem
              key={message.id}
              message={message}
              isOwnMessage={message.userId === currentUserId}
            />
          ))}
          
          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="p-3 text-sm text-slate-500 italic font-mono flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span>
                {typingUsers.length === 1
                  ? `${typingUsers[0]} is typing...`
                  : `${typingUsers.length} users are typing...`}
              </span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;
