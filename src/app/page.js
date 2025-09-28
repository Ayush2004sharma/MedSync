'use client';

import { useState, useEffect } from 'react';
import api from './utils/api';
import DoctorList from './components/doctor/DoctorList';
import dynamic from 'next/dynamic';
import Banner from './components/Banner';
import DoctorSearchBar from './components/SearchBar';
import AboutUsSection from './components/About';

import ContactUsSection from './components/Contact';

const DoctorMap = dynamic(() => import('./components/doctor/DoctorMap'), { ssr: false });

export default function HomePage() {
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState({ specialty: '', city: '' });
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.warn("Geolocation failed:", err);
          setUserLocation({ lat: 28.61, lng: 77.20 }); // fallback: Delhi
        }
      );
    } else {
      setUserLocation({ lat: 28.61, lng: 77.20 }); // fallback
    }
  }, []);

  useEffect(() => {
  if (userLocation) {
    // Generate 5 dummy doctors within ~5km of the center
    const dummyDoctors = Array.from({ length: 5 }, (_, i) => ({
      _id: `dummy-${i}`,
      name: `Dr. Test ${i + 1}`,
      specialty: ['Cardiology', 'Neurology', 'Orthopedics'][i % 3],
      location: {
        coordinates: [
          userLocation.lng + (Math.random() - 0.5) * 0.05,
          userLocation.lat + (Math.random() - 0.5) * 0.05,
        ],
      },
    }));
    setDoctors(dummyDoctors);
  }
}, [userLocation]);


  const handleSearch = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams(query).toString();
    const { data } = await api.get(`/doctors?${params}`);
    setDoctors(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-0">
      <Banner />
      <div className="w-full space-y-8">
        {/* Add margin above the search bar */}
        <div className="mt-6">
          <DoctorSearchBar
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
          />
        </div>
        {/* Flex row for map and list */}
        <div className="w-full px-4 py-6">
          {/* 💙 Heading */}
          <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
            Available Doctors
          </h1>

          {/* 📍 Map + List layout */}
          <div className="flex w-full space-x-6">
            {/* 🗺️ Map section */}
            <div className="flex-1 h-[350px] rounded-lg overflow-hidden border shadow mt-10">
               {userLocation && (
              <DoctorMap doctors={doctors} center={userLocation} />
            )}
            </div>

            {/* 🩺 Doctor list */}
            <div className="flex-1 h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar">
             <DoctorList doctors={doctors} />

            </div>

          </div>
        </div>
<section id ="about" className="w-full bg-gray-50 px-4 sm:px-6 lg:px-8 py-16">
          <AboutUsSection />
        </section>
        <section id="contact" className="w-full bg-white px-4 sm:px-6 lg:px-8 py-16">
          <ContactUsSection />
        </section>

      </div>
    </div>

  );
}
