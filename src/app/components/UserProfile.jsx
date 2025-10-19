"use client";

import { useEffect, useState } from "react";
import api from "../utils/api";
import ProfileCard from "./ProfileCard";
import AppointmentCard from "./AppointmentCard";
import { useAuthContext } from "../context/AuthContext";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  MessageCircle,
  Search
} from "lucide-react";

export default function UserProfilePage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { role } = useAuthContext();

  useEffect(() => {
    if (!role) return;

    const controller = new AbortController();

    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (role === "user") {
          const res = await api.get("/users/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          });
          setDashboardData(res.data);
        } else {
          const [profileRes, appointmentsRes] = await Promise.all([
            api.get("/doctors/profile", {
              headers: { Authorization: `Bearer ${token}` },
              signal: controller.signal,
            }),
            api.get("/appointments/doctor", {
              headers: { Authorization: `Bearer ${token}` },
              signal: controller.signal,
            }),
          ]);
          
          setDashboardData({
            user: profileRes.data,
            recentAppointments: appointmentsRes.data?.appointments || [],
            statistics: null
          });
        }
      } catch (err) {
        if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
          console.log('Request was cancelled');
          return;
        }
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();

    return () => controller.abort();
  }, [role]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData?.user) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
        <p className="text-red-600">Failed to load dashboard. Please try again.</p>
      </div>
    );
  }

  const { user, statistics, upcomingAppointments, recentAppointments } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {role === "doctor" 
              ? "Manage your patient appointments and schedule" 
              : "Here's your health dashboard overview"}
          </p>
        </div>

        {/* Statistics Cards - Only for Users */}
        {role === "user" && statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Appointments</p>
                  <p className="text-3xl font-bold mt-2">{statistics.totalAppointments}</p>
                </div>
                <Calendar className="w-12 h-12 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Booked</p>
                  <p className="text-3xl font-bold mt-2">{statistics.bookedAppointments}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending Approval</p>
                  <p className="text-3xl font-bold mt-2">{statistics.pendingAppointments}</p>
                </div>
                <Clock className="w-12 h-12 text-yellow-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Upcoming</p>
                  <p className="text-3xl font-bold mt-2">{statistics.upcomingCount}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-200" />
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions - For Users */}
        {role === "user" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/pages/my-messages" className="group">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-200 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-100 text-sm font-medium">My Messages</p>
                    <p className="text-2xl font-bold mt-2">View Chats</p>
                  </div>
                  <MessageCircle className="w-12 h-12 text-teal-200 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-teal-100 text-xs mt-3">Chat with your doctors →</p>
              </div>
            </Link>

            <Link href="/pages/appointments" className="group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-200 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Appointments</p>
                    <p className="text-2xl font-bold mt-2">{statistics?.totalAppointments || 0}</p>
                  </div>
                  <Calendar className="w-12 h-12 text-blue-200 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-blue-100 text-xs mt-3">View all appointments →</p>
              </div>
            </Link>

            <Link href="/pages/doctors" className="group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-200 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Find Doctors</p>
                    <p className="text-2xl font-bold mt-2">Book Now</p>
                  </div>
                  <Search className="w-12 h-12 text-purple-200 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-purple-100 text-xs mt-3">Search specialists →</p>
              </div>
            </Link>
          </div>
        )}

        {/* Doctor Quick Actions */}
        {role === "doctor" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/pages/doctor-chat" className="group">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-200 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-100 text-sm font-medium">Patient Messages</p>
                    <p className="text-2xl font-bold mt-2">View Chats</p>
                  </div>
                  <MessageCircle className="w-12 h-12 text-teal-200 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-teal-100 text-xs mt-3">Click to view all conversations →</p>
              </div>
            </Link>

            <Link href="/pages/appointments" className="group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-200 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Appointments</p>
                    <p className="text-2xl font-bold mt-2">{recentAppointments?.length || 0}</p>
                  </div>
                  <Calendar className="w-12 h-12 text-blue-200 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-blue-100 text-xs mt-3">Manage your schedule →</p>
              </div>
            </Link>

            <Link href="/pages/profile" className="group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-200 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">My Profile</p>
                    <p className="text-2xl font-bold mt-2">Edit Info</p>
                  </div>
                  <svg className="w-12 h-12 text-purple-200 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-purple-100 text-xs mt-3">Update your information →</p>
              </div>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              My Profile
            </h2>
            <ProfileCard profile={user} role={role} />
          </div>

          {/* Appointments Section */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            {/* Upcoming Appointments */}
            {role === "user" && upcomingAppointments && upcomingAppointments.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Upcoming Appointments
                  <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">
                    {upcomingAppointments.length} scheduled
                  </span>
                </h2>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard 
                      key={appointment._id} 
                      appointment={appointment} 
                      role={role} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recent Appointments */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {role === "doctor" ? "Recent Appointments" : "All Appointments"}
                {recentAppointments && recentAppointments.length > 0 && (
                  <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">
                    {recentAppointments.length} total
                  </span>
                )}
              </h2>

              {!recentAppointments || recentAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No appointments
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {role === "doctor"
                      ? "You don't have any appointments yet."
                      : "Get started by booking your first appointment."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {recentAppointments.map((appointment) => (
                    <AppointmentCard 
                      key={appointment._id} 
                      appointment={appointment} 
                      role={role} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
