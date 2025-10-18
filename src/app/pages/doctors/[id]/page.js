'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Phone, Clock, Award, DollarSign, Navigation, MessageCircle } from 'lucide-react';
import api from '@/app/utils/api';

// Default doctor avatar
const defaultDoctorImage = "data:image/svg+xml,%3Csvg width='96' height='96' viewBox='0 0 96 96' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='48' cy='48' r='48' fill='%233B82F6'/%3E%3Cpath d='M48 30C39.716 30 33 36.716 33 45C33 53.284 39.716 60 48 60C56.284 60 63 53.284 63 45C63 36.716 56.284 30 48 30Z' fill='white'/%3E%3Cpath d='M48 63C34.745 63 24 72.402 24 84H72C72 72.402 61.255 63 48 63Z' fill='white'/%3E%3C/svg%3E";

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctors/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error('Failed to fetch doctor:', err);
        setError('Doctor not found');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchDoctor();
    }
  }, [id]);

  // Function to open Google Maps directions
  const handleGetDirections = () => {
    if (doctor.location && doctor.location.coordinates) {
      const [lng, lat] = doctor.location.coordinates;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    } else if (doctor.clinicAddress) {
      const address = encodeURIComponent(doctor.clinicAddress);
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
    } else {
      alert('Location not available for this doctor');
    }
  };

  // Function to handle chat (placeholder for now)
  const handleChat = () => {
    alert('Chat feature coming soon! This will allow you to message the doctor directly.');
    // TODO: Implement chat functionality
    // router.push(`/pages/chat/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || 'Doctor not found'}</p>
          <Link
            href="/pages/doctors"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Doctors
          </Link>
        </div>
      </div>
    );
  }

  const {
    name = 'Unknown Doctor',
    specialty = 'General Practitioner',
    qualifications = [],
    bio,
    experience = 0,
    phone,
    clinicAddress,
    fee,
    profilePic,
    ratings = 0,
  } = doctor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/pages/doctors"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition"
        >
          ← Back to Doctors
        </Link>

        {/* Profile Card */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-blue-200">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-8 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img
                src={profilePic || defaultDoctorImage}
                alt={name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultDoctorImage;
                }}
              />
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-3xl font-bold">{name}</h1>
                <p className="text-blue-100 text-lg mt-1">{specialty}</p>
                {ratings > 0 && (
                  <div className="mt-3 flex items-center gap-2 justify-center sm:justify-start">
                    <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                      <span className="text-yellow-300">⭐</span>
                      <span className="font-semibold">{ratings.toFixed(1)}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Bio */}
            {bio && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed italic">{bio}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Experience */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <Clock className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {experience > 0 ? `${experience} years` : 'Not specified'}
                  </p>
                </div>
              </div>

              {/* Consultation Fee */}
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                <DollarSign className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Consultation Fee</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {fee ? `₹${fee}` : 'Not specified'}
                  </p>
                </div>
              </div>

              {/* Qualifications */}
              {qualifications.length > 0 && (
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl md:col-span-2">
                  <Award className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Qualifications</p>
                    <p className="text-base font-medium text-gray-900">
                      {qualifications.join(', ')}
                    </p>
                  </div>
                </div>
              )}

              {/* Clinic Address with Get Directions Button */}
              {clinicAddress && (
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl md:col-span-2">
                  <MapPin className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Clinic Address</p>
                    <p className="text-base font-medium text-gray-900 mb-2">
                      {clinicAddress}
                    </p>
                    <button
                      onClick={handleGetDirections}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition"
                    >
                      <Navigation className="w-4 h-4" />
                      Get Directions
                    </button>
                  </div>
                </div>
              )}

              {/* Phone */}
              {phone && (
                <div className="flex items-start gap-3 p-4 bg-cyan-50 rounded-xl md:col-span-2">
                  <Phone className="w-5 h-5 text-cyan-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Contact Number</p>
                    <p className="text-base font-medium text-gray-900">
                      <a href={`tel:${phone}`} className="hover:text-cyan-600 transition">
                        {phone}
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              {/* Book Appointment Button */}
              <button
                onClick={() => router.push(`/pages/book/${id}`)}
                className="text-center py-3 px-6 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Book Appointment
              </button>

              {/* Chat Button */}
              <button
                onClick={handleChat}
                className="flex items-center justify-center gap-2 text-center py-3 px-6 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition"
              >
                <MessageCircle className="w-5 h-5" />
                Chat with Doctor
              </button>

              {/* View Other Doctors */}
              <Link
                href="/pages/doctors"
                className="text-center py-3 px-6 rounded-lg font-semibold bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition flex items-center justify-center"
              >
                View Other Doctors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
