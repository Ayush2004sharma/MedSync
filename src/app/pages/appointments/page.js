"use client"
import { useState, useEffect } from "react";
import api from "../../utils/api";
import AppointmentCard from "@/app/components/AppointmentCard";

export default function AppointmentsPage() {
  const [role, setRole] = useState("user");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const url = role === "doctor" ? "/appointments/doctor" : "/appointments/user";
    api.get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setAppointments(res.data));
  }, [role]);

  return (

  appointments.map((a) => (
    <AppointmentCard key={a._id} appointment={a} />
  ))
);

   
}
