'use client';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/app/utils/api';

export default function DoctorChatListPage() {
  const { user, role, isLoggedIn } = useAuthContext();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not doctor
  useEffect(() => {
    if (isLoggedIn && role !== 'doctor') {
      router.push('/');
    }
  }, [isLoggedIn, role, router]);

  // Fetch doctor's conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.doctorId) return;

      try {
        const response = await api.get(`/chat/conversations/${user.doctorId}`);
        if (response.data.success) {
          setConversations(response.data.conversations);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn && role === 'doctor') {
      fetchConversations();
    }
  }, [user, role, isLoggedIn]);

  const getOtherUser = (participants) => {
    return participants.find(p => p._id !== user?.doctorId);
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Patient Messages</h1>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <span className="text-6xl mb-4 block">💬</span>
            <p className="text-gray-500 text-lg">No messages yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Patients will appear here when they message you
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => {
              const otherUser = getOtherUser(conversation.participants);
              if (!otherUser) return null;

              return (
                <div
                  key={conversation._id}
                  onClick={() => router.push(`/pages/doctor-chat/${otherUser._id}`)}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer p-4 flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
                    <p className="text-gray-500 text-sm truncate">
                      {conversation.lastMessage || 'No messages yet'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conversation.lastMessageTime).toLocaleString()}
                    </p>
                  </div>
                  {conversation.unreadCount?.[user?.doctorId] > 0 && (
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {conversation.unreadCount[user.doctorId]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
