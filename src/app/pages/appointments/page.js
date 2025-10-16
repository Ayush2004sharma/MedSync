"use client";
import { useState, useEffect } from "react";
import api from "../../utils/api";
import AppointmentCard from "@/app/components/AppointmentCard";
import { useAuthContext } from "@/app/context/AuthContext";

export default function AppointmentsPage() {
  const { role } = useAuthContext();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!role) return; // wait until role is loaded

    // Cleanup controller for aborting fetch requests
    const controller = new AbortController();

    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // SIMPLIFIED: No need for userId in URL anymore
        const url = role === "doctor" ? "/appointments/doctor" : "/appointments/user";
        
        console.log("🔍 Fetching appointments for:", role, "→", url);

        const res = await api.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal, // Attach abort signal
        });

        console.log("📦 API response data:", res.data);

        // Access nested appointments array
        const data = res.data?.appointments || [];
        setAppointments(data);
        
      } catch (err) {
        // Don't show error if request was aborted
        if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
          console.log('Request was cancelled');
          return;
        }
        console.error("❌ Error fetching appointments:", err);
        setError("Failed to load appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();

    // Cleanup function: abort fetch on unmount
    return () => {
      controller.abort();
    };
  }, [role]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
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
            ? "You don't have any pending or booked appointments yet."
            : "You haven't booked any appointments yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Appointments
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {role === "doctor"
              ? "Manage your patient appointments"
              : `You have ${appointments.length} appointment${appointments.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Appointments Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              role={role}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
