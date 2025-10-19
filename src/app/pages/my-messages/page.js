'use client';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/app/utils/api';
import { MessageCircle, Search } from 'lucide-react';

export default function PatientMessagesPage() {
  const { user, role, isLoggedIn } = useAuthContext();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isLoggedIn && role === 'doctor') {
      router.push('/pages/doctor-chat');
    }
  }, [isLoggedIn, role, router]);

  const fetchConversations = async () => {
    if (!user?.userId && !user?.id) return;

    const userId = user?.userId || user?.id;

    try {
      const response = await api.get(`/chat/conversations/${userId}`);
      if (response.data.success) {
        console.log('📩 Fetched conversations:', response.data.conversations);
        setConversations(response.data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && role === 'user') {
      fetchConversations();
      
      // Refresh conversations every 5 seconds to show new messages
      const interval = setInterval(fetchConversations, 5000);
      return () => clearInterval(interval);
    }
  }, [user, role, isLoggedIn]);

  const getOtherUser = (participants) => {
    const userId = user?.userId || user?.id;
    return participants.find(p => p._id !== userId);
  };

  const filteredConversations = conversations.filter(conv => {
    const otherUser = getOtherUser(conv.participants);
    return otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">My Messages</h1>
            </div>
            <button
              onClick={fetchConversations}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
              title="Refresh"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600">Chat with your doctors</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Conversations List */}
        {filteredConversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              {searchTerm ? 'No conversations found' : 'No messages yet'}
            </p>
            <p className="text-gray-400 text-sm mb-4">
              Start chatting with your doctors from their profile pages
            </p>
            <button
              onClick={() => router.push('/pages/doctors')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Find Doctors
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredConversations.map((conversation) => {
              const otherUser = getOtherUser(conversation.participants);
              if (!otherUser) return null;

              const unreadCount = conversation.unreadCount?.[user?.userId || user?.id] || 0;

              return (
                <div
                  key={conversation._id}
                  onClick={() => router.push(`/pages/chat/${otherUser._id}`)}
                  className={`bg-white rounded-lg shadow hover:shadow-md transition-all cursor-pointer p-4 flex items-center gap-4 ${
                    unreadCount > 0 ? 'border-l-4 border-blue-500' : ''
                  }`}
                >
                  {/* Doctor Avatar */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {otherUser.image || otherUser.profilePic ? (
                      <img
                        src={otherUser.image || otherUser.profilePic}
                        alt={otherUser.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      otherUser.name?.charAt(0).toUpperCase()
                    )}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold text-gray-900 truncate ${unreadCount > 0 ? 'font-bold' : ''}`}>
                        Dr. {otherUser.name}
                      </h3>
                      {conversation.lastMessageTime && (
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(conversation.lastMessageTime).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                        {conversation.lastMessage || 'Start a conversation'}
                      </p>
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {otherUser.specialty && (
                      <p className="text-xs text-gray-400 mt-1">{otherUser.specialty}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
