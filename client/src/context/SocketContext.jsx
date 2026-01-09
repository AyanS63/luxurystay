import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
        // Initialize socket only once when user is present
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            transports: ['websocket'], // Force websocket to avoid polling issues
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('✅ Global Socket Connected:', newSocket.id);
            // Join specific room for the user (handles both chat and personal notifications)
            newSocket.emit('join_room', user._id || user.id);
        });

        newSocket.on('connect_error', (err) => {
            console.error('❌ Socket Connection Error:', err);
        });

        return () => {
            console.log('Disconnecting Global Socket...');
            newSocket.close();
            setSocket(null);
        };
    }
  }, [user?._id]); // Only reconnect if User ID changes, not just any user update

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
