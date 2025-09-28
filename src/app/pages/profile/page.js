'use client';

import React from 'react';
import { useAuthContext } from '@/app/context/AuthContext';

import UserProfilePage from '@/app/components/UserProfile';
import DoctorDashboardPage from '@/app/components/doctor/DoctorDashoard';


export default function ProfilePage1() {
  const { user, role, loading, isLoggedIn } = useAuthContext();



  if (!isLoggedIn || !user) {
    return (
      <div className="text-center mt-20 text-lg text-red-500">
        ❌ You are not logged in. Please log in to view your profile.
      </div>
    );
  }

  return (
    <div >
      {role === 'doctor' ? (
        <DoctorDashboardPage/>
      ) : (
        <UserProfilePage/>
      )}
    </div>
  );
}
