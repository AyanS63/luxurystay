import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocket(); // Use shared socket
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null); 
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ureadCount, setUnreadCount] = useState(0);

  // Connection logic is now handled in SocketContext. 
  // We only listen for messages here.

  useEffect(() => {
    if (socket) {
      const handleMessage = (newMessage) => {
        // If chat is open with this user, add to messages
        if (activeChat && (newMessage.sender._id === activeChat._id || newMessage.sender === activeChat._id)) {
          setMessages((prev) => [...prev, newMessage]);
        } else {
          setUnreadCount(previous => previous + 1);
        }
      };

      socket.on('receive_message', handleMessage);
      
      return () => {
        socket.off('receive_message', handleMessage);
      };
    }
  }, [socket, activeChat]);

  const fetchMessages = async (userId) => {
    try {
      const response = await api.get(`/chat/history/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  const sendMessage = async (receiverId, text) => {
    if (socket) {
      const messageData = {
        sender: user._id || user.id, // Handle potential mismatch
        receiver: receiverId,
        message: text,
      };

      socket.emit('send_message', messageData);

      // Optimistically add to our UI
      setMessages((prev) => [
        ...prev,
        {
          sender: { _id: user._id || user.id, username: user.username },
          receiver: receiverId,
          message: text,
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const response = await api.get('/users');
        let filteredUsers = [];
        if (user.role === 'receptionist') {
          filteredUsers = response.data.filter(u => u._id !== user._id);
        } else {
          filteredUsers = response.data.filter(u => u.role === 'receptionist');
        }
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    if (user) {
      fetchChatUsers();
    }
  }, [user]);


  return (
    <ChatContext.Provider value={{ 
      socket, 
      messages, 
      sendMessage, 
      activeChat, 
      setActiveChat, 
      fetchMessages,
      users,
      isOpen,
      setIsOpen,
      ureadCount,
      setUnreadCount
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
