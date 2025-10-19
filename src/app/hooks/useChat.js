'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import api from '../utils/api';

export const useChat = (currentUserId, otherUserId) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const { socket, isConnected } = useSocket();

  // Fetch chat history
  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/chat/messages/${currentUserId}/${otherUserId}`);
        if (response.data.success) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [currentUserId, otherUserId]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    socket.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('user-typing', ({ userId, isTyping }) => {
      if (userId === otherUserId) {
        setIsTyping(isTyping);
      }
    });

    socket.on('message-sent', (message) => {
      // Already handled by optimistic update
    });

    return () => {
      socket.off('receive-message');
      socket.off('user-typing');
      socket.off('message-sent');
    };
  }, [socket, otherUserId]);

  // Send message
  const sendMessage = useCallback((messageText, attachments = []) => {
    if (!socket || !messageText.trim()) return;

    // Optimistic update
    const tempMessage = {
      _id: Date.now().toString(),
      message: messageText,
      sender: { _id: currentUserId },
      receiver: { _id: otherUserId },
      createdAt: new Date(),
      isRead: false
    };

    setMessages((prev) => [...prev, tempMessage]);

    socket.emit('send-message', {
      receiverId: otherUserId,
      message: messageText,
      attachments
    });
  }, [socket, otherUserId, currentUserId]);

  // Send typing indicator
  const sendTypingIndicator = useCallback((isTyping) => {
    if (!socket) return;
    socket.emit('typing', { receiverId: otherUserId, isTyping });
  }, [socket, otherUserId]);

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!currentUserId || !otherUserId) return;
    
    const conversationId = [currentUserId, otherUserId].sort().join('_');
    
    try {
      await api.patch('/api/chat/read', {
        conversationId,
        userId: currentUserId
      });

      if (socket) {
        socket.emit('mark-read', { conversationId });
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [currentUserId, otherUserId, socket]);

  return {
    messages,
    isTyping,
    isConnected,
    loading,
    sendMessage,
    sendTypingIndicator,
    markAsRead
  };
};
