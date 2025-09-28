'use client';

import React from 'react';
import { useAuthContext } from '@/app/context/AuthContext';
import DoctorProfileCard from './DoctorProfileCard';
import DoctorAvailabilitySection from './DoctorAvailabilty';

export default function DoctorDashboardPage() {
  const { user, role, isLoggedIn } = useAuthContext();

  if (!isLoggedIn || role !== 'doctor') {
    return (
      <div className="text-center mt-20 text-lg text-red-500">
        🚫 Access denied — this page is for doctors only.
      </div>
    );
  }

  return (
  <div className="max-w-6xl mx-auto mt-10 px-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left Column: Profile */}
    <div>
      <DoctorProfileCard />
    </div>

    {/* Right Column: Availability */}
    <div>
      {console.log(user, 'user in doctor dashboard')}
      <DoctorAvailabilitySection doctorId={user} />
    </div>
  </div>
</div>

  );
}
