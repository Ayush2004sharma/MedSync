'use client';

import React from 'react';
import { useAuthContext } from '@/app/context/AuthContext';
import DoctorProfileCard from './DoctorProfileCard';
import Link from 'next/link';
import { MessageCircle, Calendar, Users } from 'lucide-react';

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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Doctor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Messages Card */}
        <Link 
          href="/pages/doctor-chat"
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 flex items-center gap-4 hover:scale-105"
        >
          <div className="bg-white/20 rounded-full p-3">
            <MessageCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Patient Messages</h3>
            <p className="text-blue-100 text-sm">View and reply to messages</p>
          </div>
        </Link>

        {/* Appointments Card */}
        <Link 
          href="/pages/appointments"
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 flex items-center gap-4 hover:scale-105"
        >
          <div className="bg-white/20 rounded-full p-3">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Appointments</h3>
            <p className="text-green-100 text-sm">View your schedule</p>
          </div>
        </Link>

        {/* Patients Card */}
        <Link 
          href="/pages/patients"
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 flex items-center gap-4 hover:scale-105"
        >
          <div className="bg-white/20 rounded-full p-3">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">My Patients</h3>
            <p className="text-purple-100 text-sm">View patient list</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Profile */}
        <div>
          <DoctorProfileCard />
        </div>

        {/* Right Column: Quick Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Today's Appointments</span>
              <span className="text-2xl font-bold text-blue-600">5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Unread Messages</span>
              <span className="text-2xl font-bold text-green-600">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Patients</span>
              <span className="text-2xl font-bold text-purple-600">127</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
