'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppointmentForm from '@/app/components/AppointmentForm';
import api from '@/app/utils/api';

export default function BookAppointmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/doctors/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError('Failed to load doctor details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleBook = async ({ scheduledFor, notes }) => {
    setError(null);
    setSuccess(false);
    try {
      await api.post(`/appointments/${id}`, {
        scheduledFor,
        notes,
      });
      setSuccess(true);
      setTimeout(() => router.push('/pages/appointments'), 2000);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err?.response?.data?.message || 'Failed to book appointment');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">
        Loading doctor info...
      </div>
    );
  }

  if (error && !doctor) {
    return (
      <div className="text-center py-10 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg">
        {doctor && (
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-blue-800">Book with Dr. {doctor.name}</h1>
            <p className="text-blue-600">{doctor.specialty}</p>
          </div>
        )}

        <AppointmentForm onBook={handleBook} />

        {success && (
          <p className="mt-4 text-green-600 text-center font-medium">
            ✅ Appointment booked successfully! Redirecting...
          </p>
        )}

        {error && (
          <p className="mt-4 text-red-600 text-center font-medium">
            ❌ {error}
          </p>
        )}
      </div>
    </div>
  );
}
