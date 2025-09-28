'use client';

import { useEffect, useState } from 'react';
import DoctorCard from '@/app/components/doctor/DoctorCard';
import api from '@/app/utils/api';

export default function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/doctors/all'); // your backend route
        console.log('Fetched doctors:', res.data);
        setDoctors(res.data|| []);
        console.log(doctors)
      } catch (err) {
        console.error('Failed to fetch doctors', err);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Find Your Doctor</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <DoctorCard key={doc._id} doctor={doc} onClick={setSelectedDoctor} />
        ))}
      </div>

    
    </div>
  );
}
