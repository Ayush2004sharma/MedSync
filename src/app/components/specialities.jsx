'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/utils/api';

const specialtyIcons = {
  'Cardiology': '❤️',
  'Cardiologist': '❤️',
  'Dermatology': '🧴',
  'Dermatologist': '🧴',
  'Orthopedics': '🦴',
  'Orthopedic Surgeon': '🦴',
  'Pediatrics': '👶',
  'Pediatrician': '👶',
  'Neurology': '🧠',
  'Neurologist': '🧠',
  'General Practitioner': '🩺',
  'Gynecology': '👩‍⚕️',
  'Gastroenterology': '🫀',
  'Gastroenterologist': '🫀',
  'Psychiatry': '🧘',
  'Psychiatrist': '🧘',
  'Ophthalmology': '👁️',
  'Ophthalmologist': '👁️',
  'Endocrinologist': '💉',
  'Oncologist': '🎗️',
  'Pulmonologist': '🫁',
  'Radiologist': '📻',
  'Rheumatologist': '🦴',
  'Urologist': '💧'
};

const specialtyColors = {
  'Cardiology': 'bg-red-50',
  'Cardiologist': 'bg-red-50',
  'Dermatology': 'bg-purple-50',
  'Dermatologist': 'bg-purple-50',
  'Orthopedics': 'bg-blue-50',
  'Orthopedic Surgeon': 'bg-blue-50',
  'Pediatrics': 'bg-green-50',
  'Pediatrician': 'bg-green-50',
  'Neurology': 'bg-indigo-50',
  'Neurologist': 'bg-indigo-50',
  'General Practitioner': 'bg-cyan-50',
  'Gynecology': 'bg-pink-50',
  'Gastroenterology': 'bg-orange-50',
  'Gastroenterologist': 'bg-orange-50',
  'Psychiatry': 'bg-teal-50',
  'Psychiatrist': 'bg-teal-50',
  'Ophthalmology': 'bg-amber-50',
  'Ophthalmologist': 'bg-amber-50',
  'Endocrinologist': 'bg-lime-50',
  'Oncologist': 'bg-rose-50',
  'Pulmonologist': 'bg-sky-50',
  'Radiologist': 'bg-violet-50',
  'Rheumatologist': 'bg-emerald-50',
  'Urologist': 'bg-cyan-50'
};

export default function SpecialtySection() {
  const router = useRouter();
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const response = await api.get('/doctors/specialties/ratings');
      setSpecialties(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching specialties:', error);
      setError(error.response?.data?.message || 'Failed to load specialties');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400 text-lg">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400 text-lg">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300 text-lg">★</span>);
      }
    }
    return stars;
  };

  // Handle specialty card click - navigate to doctor profile
  const handleSpecialtyClick = (doctorId) => {
    router.push(`/pages/doctors/${doctorId}`);
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-500">Loading top specialties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchSpecialties}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (specialties.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-center text-gray-500">No specialties available yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
        Find Doctors by Specialty
      </h3>
      <p className="text-center text-gray-600 mb-8">
        Top 5 rated specialties with verified doctors
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {specialties.map((specialty, index) => (
          <div
            key={index}
            onClick={() => handleSpecialtyClick(specialty.doctorId)}
            className="group cursor-pointer"
          >
            <div className={`${specialtyColors[specialty.specialty] || 'bg-gray-50'} rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-2 border border-transparent hover:border-blue-400 h-full`}>
              {/* Icon */}
              <div className="text-5xl mb-3">
                {specialtyIcons[specialty.specialty] || '⚕️'}
              </div>
              
              {/* Specialty Name */}
              <h4 className="font-bold text-gray-800 text-base mb-3 min-h-[48px] flex items-center justify-center">
                {specialty.specialty}
              </h4>
              
              {/* Star Rating */}
              <div className="flex justify-center items-center gap-1 mb-2">
                {renderStars(specialty.rating)}
              </div>
              
              {/* Rating Number and Doctor Count */}
              <div className="space-y-1">
                <div className="text-sm text-gray-700 font-semibold">
                  {specialty.rating.toFixed(1)} Rating
                </div>
                <div className="text-xs text-gray-600">
                  {specialty.totalDoctors} Doctor{specialty.totalDoctors !== 1 ? 's' : ''}
                </div>
                {specialty.totalReviews > 0 && (
                  <div className="text-xs text-gray-500">
                    {specialty.totalReviews} Review{specialty.totalReviews !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
