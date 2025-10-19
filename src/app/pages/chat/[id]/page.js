'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChatWindow from '@/app/components/ChatWindow';
import api from '@/app/utils/api';
import { useAuthContext } from '@/app/context/AuthContext';

export default function PatientChatWithDoctorPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { user, role, isLoggedIn } = useAuthContext();

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctors/${id}`);
        console.log('👨‍⚕️ Doctor data:', res.data);
        setDoctor(res.data);
      } catch (err) {
        console.error('Failed to fetch doctor:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchDoctor();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isLoggedIn || !user || !doctor) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">Unable to load chat. Please try again.</p>
      </div>
    );
  }

  // ✅ FIX: Use the correct user ID
  const currentUserId = user.userId || user.id || user._id;
  
  console.log('🔍 Patient chat setup:', {
    currentUserId,
    id: doctor._id,
    userObject: user
  });

  return (
    <ChatWindow 
      currentUserId={currentUserId} 
      otherUser={doctor} 
    />
  );
}
