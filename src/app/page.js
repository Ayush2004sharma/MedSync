'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Banner from './components/Banner';
import DoctorSearchBar from './components/SearchBar';
import AboutUsSection from './components/About';
import ContactUsSection from './components/Contact';

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState({ specialty: '', city: '' });

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    
    // Build URL with search parameters
    const params = new URLSearchParams();
    if (query.specialty) params.append('specialty', query.specialty);
    if (query.city) params.append('city', query.city);
    
    // Navigate to doctors page with query parameters
    const queryString = params.toString();
    router.push(`/pages/doctors${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-0">
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

        {/* Quick Stats or Featured Doctors Section */}
        <div className="w-full px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
              Find the Best Doctors Near You
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Book appointments with top-rated doctors in your area
            </p>
            
            {/* Call to Action */}
            <div className="flex justify-center">
              <button
                onClick={() => router.push('/pages/doctors')}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg transition shadow-lg"
              >
                View All Doctors
              </button>
            </div>
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
