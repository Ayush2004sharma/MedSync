'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Banner from './components/Banner';
import DoctorSearchBar from './components/SearchBar';
import SpecialtySection from './components/specialities';
import AboutUsSection from './components/About';
import ContactUsSection from './components/Contact';

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState({ specialty: '', city: '' });

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    
    const params = new URLSearchParams();
    if (query.specialty) params.append('specialty', query.specialty);
    if (query.city) params.append('city', query.city);
    
    const queryString = params.toString();
    router.push(`/pages/doctors${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-0">
      {/* Hero Banner */}
      <Banner />
      
      <div className="w-full space-y-8">
        {/* Search Bar */}
        <div className="mt-6">
          <DoctorSearchBar
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
          />
        </div>

        {/* Specialty Section - NEW */}
        <SpecialtySection />

        {/* View All Doctors CTA */}
        <div className="w-full px-4 py-6">
          
            <div className="flex justify-center">
              <button
                onClick={() => router.push('/pages/doctors')}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg transition shadow-lg"
              >
                View All Doctors
              </button>
           
          </div>
        </div>

        {/* About Section */}
        <section id="about" className="w-full bg-gray-50 px-4 sm:px-6 lg:px-8 py-16">
          <AboutUsSection />
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full bg-white px-4 sm:px-6 lg:px-8 py-16">
          <ContactUsSection />
        </section>
      </div>
    </div>
  );
}
