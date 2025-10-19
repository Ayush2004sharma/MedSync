'use client';
import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { io } from 'socket.io-client';
import { getToken } from '../utils/auth';
import { Check, CheckCheck, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';

export default function ChatWindow({ currentUserId, otherUser }) {
  const router = useRouter();
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const socketRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Initialize socket connection
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const token = getToken();
    if (!token) {
      console.log('No token available');
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['polling', 'websocket'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Chat socket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Chat socket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error.message);
      setIsConnected(false);
    });

    socket.on('receive-message', (message) => {
      console.log('📨 Received message:', message);
      setMessages((prev) => [...prev, message]);
    });

    socket.on('user-typing', ({ userId, isTyping }) => {
      if (userId === otherUser._id) {
        setIsTyping(isTyping);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.close();
        socketRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, []);

  // Fetch chat history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching messages for:', { currentUserId, otherUserId: otherUser._id });
        
        const response = await api.get(`/chat/messages/${currentUserId}/${otherUser._id}`);
        if (response.data.success) {
          console.log('📥 Messages received:', response.data.messages);
          console.log('📍 Current user ID:', currentUserId);
          
          // Debug first message
          if (response.data.messages.length > 0) {
            const firstMsg = response.data.messages[0];
            console.log('First message:', {
              text: firstMsg.message,
              senderId: firstMsg.sender?._id,
              isMine: firstMsg.sender?._id?.toString() === currentUserId?.toString()
            });
          }
          
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId && otherUser._id) {
      fetchMessages();
    }
  }, [currentUserId, otherUser._id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    if (!socketRef.current || !isConnected) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socketRef.current.emit('typing', { receiverId: otherUser._id, isTyping: true });

    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit('typing', { receiverId: otherUser._id, isTyping: false });
      }
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socketRef.current || !isConnected) return;

    const tempMessage = {
      _id: Date.now().toString(),
      message: inputMessage,
      sender: { _id: currentUserId },
      receiver: { _id: otherUser._id },
      createdAt: new Date(),
      isRead: false
    };

    setMessages((prev) => [...prev, tempMessage]);

    socketRef.current.emit('send-message', {
      receiverId: otherUser._id,
      message: inputMessage
    });

    setInputMessage('');
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (socketRef.current) {
      socketRef.current.emit('typing', { receiverId: otherUser._id, isTyping: false });
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getMessageStatus = (msg) => {
    // Convert to strings for comparison
    const senderId = (msg.sender?._id || msg.sender)?.toString();
    const currentId = currentUserId?.toString();
    
    if (senderId !== currentId) return null;
    
    if (msg.isRead) {
      return <CheckCheck className="w-3 h-3" />;
    } else {
      return <Check className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Simple Header - No call buttons */}
        <div className="bg-teal-700 px-4 py-3 flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
            {(otherUser.profilePic || otherUser.image) ? (
              <img
                src={otherUser.profilePic || otherUser.image}
                alt={otherUser.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-bold text-lg">
                {otherUser.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="font-medium text-white text-base truncate">{otherUser.name}</h2>
            <p className="text-xs text-teal-100">
              {isTyping ? 'typing...' : isConnected ? 'online' : 'offline'}
            </p>
          </div>
        </div>

        {/* Messages Container - WhatsApp background */}
        <div 
          className="flex-1 overflow-y-auto px-3 py-2"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d9d9d9' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundColor: '#efeae2'
          }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full flex-col gap-2 text-gray-500">
              <span className="text-4xl">💬</span>
              <p className="text-sm">No messages yet</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              // Convert IDs to strings for reliable comparison
              const senderId = (msg.sender?._id || msg.sender)?.toString();
              const currentId = currentUserId?.toString();
              const isSender = senderId === currentId;
              
              // Debug log for first message
              if (index === 0) {
                console.log('🎨 Rendering first message:', {
                  text: msg.message,
                  senderId,
                  currentId,
                  isSender,
                  side: isSender ? 'RIGHT (green)' : 'LEFT (white)'
                });
              }
              
              return (
                <div
                  key={msg._id || index}
                  className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
                      isSender
                        ? 'bg-[#dcf8c6] text-gray-800'  // Green bubble for YOUR messages
                        : 'bg-white text-gray-800'        // White bubble for THEIR messages
                    }`}
                    style={{
                      borderRadius: isSender ? '7.5px 7.5px 0px 7.5px' : '7.5px 7.5px 7.5px 0px'
                    }}
                  >
                    <p className="text-[14px] leading-[19px] break-words whitespace-pre-wrap">
                      {msg.message}
                    </p>
                    
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <span className="text-[11px] text-gray-500">
                        {formatTime(msg.createdAt)}
                      </span>
                      {isSender && (
                        <span className="text-gray-500">
                          {getMessageStatus(msg)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start mb-2">
              <div 
                className="bg-white rounded-lg px-3 py-2 shadow-sm"
                style={{ borderRadius: '7.5px 7.5px 7.5px 0px' }}
              >
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-gray-100 px-2 py-1.5">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type a message"
              className="flex-1 bg-white rounded-full px-4 py-2.5 text-[15px] focus:outline-none disabled:bg-gray-200 border border-gray-200"
              disabled={!isConnected}
            />
            
            <button
              type="submit"
              disabled={!inputMessage.trim() || !isConnected}
              className="bg-teal-600 text-white rounded-full p-2.5 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
