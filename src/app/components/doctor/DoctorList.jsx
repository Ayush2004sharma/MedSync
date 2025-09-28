'use client';

import React, { useEffect, useState } from 'react';
import DoctorMiniCard from './DoctorTemp';
import api from '@/app/utils/api';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/doctors/all');
        console.log('Fetched doctors:', res.data);
        setDoctors(res.data || []);
      } catch (err) {
        console.error('Failed to fetch doctors', err);
        setError('Oops! Failed to fetch doctor data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-4 sm:px-6 lg:px-10">
   

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading doctors...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">{error}</div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-10 text-gray-600">No doctors found.</div>
      ) : (
        <div
          className="flex flex-col gap-4 overflow-y-auto pr-2 hide-scrollbar"
           style={{ maxHeight: '70vh' }}
        >
          {doctors.map((doctor) => (
            <DoctorMiniCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
}
