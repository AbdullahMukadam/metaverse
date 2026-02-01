import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  userImage?: string | null;
}

export interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  unreadCount: number;
  typingUsers: string[]; // Array of userNames who are typing
}

const initialState: ChatState = {
  messages: [],
  isOpen: true,
  unreadCount: 0,
  typingUsers: []
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
      
      // Increment unread count only if chat is closed
      if (!state.isOpen) {
        state.unreadCount += 1;
      }
      
      // Keep only last 100 messages to prevent memory issues
      if (state.messages.length > 100) {
        state.messages = state.messages.slice(-100);
      }
    },
    
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
      // Reset unread count when opening chat
      if (state.isOpen) {
        state.unreadCount = 0;
      }
    },
    
    setTyping: (state, action: PayloadAction<{ userName: string; isTyping: boolean }>) => {
      const { userName, isTyping } = action.payload;
      
      if (isTyping) {
        // Add user to typing list if not already there
        if (!state.typingUsers.includes(userName)) {
          state.typingUsers.push(userName);
        }
      } else {
        // Remove user from typing list
        state.typingUsers = state.typingUsers.filter(user => user !== userName);
      }
    },
    
    clearChat: (state) => {
      state.messages = [];
      state.unreadCount = 0;
      state.typingUsers = [];
    },
    
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    }
  }
});

export const { addMessage, toggleChat, setTyping, clearChat, resetUnreadCount } = chatSlice.actions;
export default chatSlice.reducer;
