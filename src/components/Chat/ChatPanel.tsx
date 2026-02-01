"use client"
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addMessage, toggleChat, setTyping, clearChat, resetUnreadCount } from '@/lib/chat/chatSlice';
import { setupChatListeners, removeChatListeners, ChatMessage, TypingData } from '@/utils/Socket';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { MessageSquare, Minus } from 'lucide-react';
import { toast } from 'sonner';

interface ChatPanelProps {
  roomId: string;
  userId: string;
  userName: string;
  userImage?: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ roomId, userId, userName, userImage }) => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.chat?.isOpen ?? true);
  const unreadCount = useAppSelector((state) => state.chat?.unreadCount ?? 0);

  useEffect(() => {
    // Setup chat listeners
    const handleNewMessage = (message: ChatMessage) => {
      dispatch(addMessage(message));
    };

    const handleUserTyping = (data: TypingData) => {
      dispatch(setTyping({ userName: data.userName, isTyping: data.isTyping }));
    };

    const handleChatError = (error: { message: string }) => {
      toast.error(error.message);
    };

    setupChatListeners(handleNewMessage, handleUserTyping, handleChatError);

    // Cleanup on unmount
    return () => {
      removeChatListeners();
      dispatch(clearChat());
    };
  }, [dispatch]);

  // Reset unread count when opening chat
  useEffect(() => {
    if (isOpen) {
      dispatch(resetUnreadCount());
    }
  }, [isOpen, dispatch]);

  const handleToggle = () => {
    dispatch(toggleChat());
  };

  return (
    <>
      {/* Toggle Button - Shows when chat is closed */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          className="fixed right-6 bottom-6 z-40 bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2] border-2 border-black text-black p-4 transition-all group cursor-pointer"
          title="Open Chat"
        >
          <MessageSquare className="w-6 h-6" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold font-mono border border-black px-1.5 py-0.5 rounded-full animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed right-6 bottom-6 z-40 w-96 h-[600px] flex flex-col font-michroma animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Main Container */}
          <div className="flex-1 flex flex-col bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2] border-2 border-black overflow-hidden">
            
            {/* Header */}
            <div className="bg-white border-b-2 border-black p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-black rounded-full">
                   <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-black font-bold text-xs uppercase tracking-wider">
                    Live Chat
                  </h3>
                  <span className="text-[8px] text-gray-600 font-mono tracking-wider">Connected</span>
                </div>
              </div>
              
              <button
                onClick={handleToggle}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors border-2 border-transparent hover:border-black"
                title="Minimize"
              >
                <Minus className="w-4 h-4 text-black" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 relative overflow-hidden bg-white/50">
               <div className="relative z-10 h-full flex flex-col">
                  <MessageList currentUserId={userId} />
               </div>
            </div>

            {/* Input Area */}
            <ChatInput 
              roomId={roomId}
              userId={userId}
              userName={userName}
              userImage={userImage}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPanel;
