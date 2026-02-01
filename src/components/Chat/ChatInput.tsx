"use client"
import React, { useState, useRef, useCallback } from 'react';
import { Send, Smile } from 'lucide-react';
import { sendChatMessage, sendTypingStatus } from '@/utils/Socket';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ChatInputProps {
  roomId: string;
  userId: string;
  userName: string;
  userImage?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ roomId, userId, userName, userImage }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_LENGTH = 500;

  const handleTypingStatus = useCallback((typing: boolean) => {
    if (isTyping !== typing) {
      setIsTyping(typing);
      sendTypingStatus(roomId, userId, userName, typing);
    }
  }, [isTyping, roomId, userId, userName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Enforce character limit
    if (value.length <= MAX_LENGTH) {
      setMessage(value);
      
      // Send typing indicator
      if (value.trim() && !isTyping) {
        handleTypingStatus(true);
      }
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        handleTypingStatus(false);
      }, 2000);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const newValue = message + emojiData.emoji;
    if (newValue.length <= MAX_LENGTH) {
      setMessage(newValue);
    }
  };

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    
    if (!trimmedMessage) return;
    
    // Send message
    sendChatMessage(roomId, userId, userName, trimmedMessage, userImage);
    
    // Clear input and typing status
    setMessage('');
    handleTypingStatus(false);
    
    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-t-2 border-black p-3 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        {/* Emoji Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <button 
              className="p-2.5 border-2 border-gray-300 hover:border-black text-gray-500 hover:text-black hover:bg-white transition-all"
              title="Add emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-2 border-black overflow-hidden" align="start" side="top">
            <EmojiPicker 
              theme={Theme.LIGHT}
              onEmojiClick={handleEmojiClick}
              width={320}
              height={400}
              previewConfig={{ showPreview: false }}
            />
          </PopoverContent>
        </Popover>

        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full bg-white border-2 border-gray-300 text-black px-4 py-2.5 pr-16 text-sm focus:outline-none focus:border-black transition-all placeholder:text-gray-400 font-sans"
            maxLength={MAX_LENGTH}
          />
          
          {/* Character Counter */}
          <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono ${
            message.length > MAX_LENGTH * 0.9 ? 'text-red-500' : 'text-gray-400'
          }`}>
            {message.length}/{MAX_LENGTH}
          </div>
        </div>
        
        <button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className={`p-2.5 border-2 transition-all ${
            message.trim()
              ? 'bg-black border-black text-white hover:bg-gray-800'
              : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
          }`}
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
