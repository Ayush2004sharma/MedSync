'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChatWindow from '@/app/components/ChatWindow';
import api from '@/app/utils/api';
import { useAuthContext } from '@/app/context/AuthContext';

export default function DoctorChatWithPatientPage() {
  const params = useParams();
  const router = useRouter();
  const { patientId } = params;
  
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { user, role, isLoggedIn } = useAuthContext();

  // Redirect if not doctor
  useEffect(() => {
    if (isLoggedIn && role !== 'doctor') {
      router.push('/');
    }
  }, [isLoggedIn, role, router]);

  // Fetch patient details
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await api.get(`/users/${patientId}`);
        console.log('👤 Patient data:', res.data);
        setPatient(res.data);
      } catch (err) {
        console.error('Failed to fetch patient:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (patientId && role === 'doctor') {
      fetchPatient();
    }
  }, [patientId, role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isLoggedIn || !user || !patient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">Unable to load chat. Please try again.</p>
      </div>
    );
  }

  // ✅ FIX: Use the correct doctor ID
  const currentDoctorId = user.doctorId || user.id || user._id;
  
  console.log('🔍 Doctor chat setup:', {
    currentDoctorId,
    patientId: patient._id,
    userObject: user
  });

  return (
    <ChatWindow 
      currentUserId={currentDoctorId} 
      otherUser={patient} 
    />
  );
}
