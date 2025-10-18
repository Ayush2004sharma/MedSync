'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import api from '@/app/utils/api';

const DoctorMap = dynamic(() => import('@/app/components/doctor/DoctorMap'), {
  ssr: false,
  loading: () => <div className="h-screen bg-gray-100 animate-pulse flex items-center justify-center">Loading map...</div>
});

export default function DoctorMapPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(location);

          // Fetch nearby doctors
          try {
            const params = new URLSearchParams({
              longitude: location.longitude.toString(),
              latitude: location.latitude.toString(),
              maxDistance: '5000',
            });
            const res = await api.get(`/doctors/search/proximity?${params}`);
            setDoctors(res.data.doctors || []);
          } catch (err) {
            console.error('Failed to fetch doctors', err);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLoading(false);
        }
      );
    }
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-900">
          Doctors Near You ({doctors.length})
        </h1>
        <div></div>
      </div>

      {/* Full Screen Map */}
      <div className="flex-1">
        {userLocation ? (
          <DoctorMap
            doctors={doctors}
            userLocation={userLocation}
            onMarkerClick={(doc) => router.push(`/pages/doctors/${doc._id}`)}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-600">Location access required to show map</p>
          </div>
        )}
      </div>
    </div>
  );
}
