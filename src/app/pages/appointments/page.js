"use client";
import { useState, useEffect } from "react";
import api from "../../utils/api";
import AppointmentCard from "@/app/components/AppointmentCard";
import { useAuthContext } from "@/app/context/AuthContext";

export default function AppointmentsPage() {
  const { role } = useAuthContext();
  console.log("👤 User role from context:", role);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!role) return; // wait until role is loaded

    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = role === "doctor" ? "/appointments/doctor" : "/appointments/user";
        console.log("🔍 Fetching appointments for:", role, "→", url);

        const res = await api.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📦 API response data:", res.data);

        // Ensure appointments is always an array
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.appointments || [];

        setAppointments(data);
      } catch (err) {
        console.error("❌ Error fetching appointments:", err);
        setError("Failed to load appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [role]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading appointments...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-10">
        No appointments found.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
     {appointments.map((appointment) => (
  <AppointmentCard key={appointment._id} appointment={appointment} role={role} />
))}

    </div>
  );
}
