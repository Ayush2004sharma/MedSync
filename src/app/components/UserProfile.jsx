"use client";

import { useEffect, useState } from "react";
import api from "../utils/api";
import ProfileCard from "./ProfileCard";
import AppointmentCard from "./AppointmentCard";
import { useAuthContext } from "../context/AuthContext";

export default function UserProfilePage() {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const { role } = useAuthContext();

  useEffect(() => {
    if (!role) return;

    const token = localStorage.getItem("token");

    const profileUrl = role === "doctor" ? "/doctors/profile" : "/users/profile";
    const appointmentsUrl = role === "doctor" ? "/appointments/doctor" : "/appointments/user";

    // Fetch Profile
    api.get(profileUrl, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setProfile(res.data);
        setForm(res.data);
      })
      .catch(err => console.error("Profile fetch error:", err));

    // Fetch Appointments
    api.get(appointmentsUrl, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setAppointments(res.data))
      .catch(err => console.error("Appointments fetch error:", err));
  }, [role, edit]);

  if (!profile) return <div className="text-center py-8 text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">My Profile</h2>
          <ProfileCard profile={profile} role={role} />
   
        </div>

        {/* Appointments Section */}
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">My Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No appointments found.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((a) => (
                <AppointmentCard key={a._id} appointment={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
