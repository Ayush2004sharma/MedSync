'use client';

import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Default doctor avatar as inline SVG (URL-encoded)
const defaultDoctorImage = "data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='32' cy='32' r='32' fill='%233B82F6'/%3E%3Cpath d='M32 20C26.477 20 22 24.477 22 30C22 35.523 26.477 40 32 40C37.523 40 42 35.523 42 30C42 24.477 37.523 20 32 20Z' fill='white'/%3E%3Cpath d='M32 42C23.1634 42 16 48.268 16 56H48C48 48.268 40.8366 42 32 42Z' fill='white'/%3E%3C/svg%3E";

export default function DoctorCard({ doctor, showDistance = false }) {
  const router = useRouter();

  if (!doctor) return null;

  const {
    _id,
    name = 'Unknown',
    specialty = 'General',
    qualifications = [],
    bio = '',
    clinicAddress = 'Not Provided',
    phone = 'N/A',
    experience = 0,
    fee = 'N/A',
    profilePic,
    distance, // Distance in km from proximity search
  } = doctor;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl p-6 w-full max-w-md bg-gradient-to-br from-[#d0f1ff] via-[#ffffff] to-[#e0f7fa] shadow-xl border border-blue-300 hover:shadow-2xl transition-all duration-300"
    >
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <img
          src={profilePic || defaultDoctorImage}
          alt={name}
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-400 shadow-md"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultDoctorImage;
          }}
        />
        <div className="flex-1">
          <h2 className="text-xl font-bold text-blue-800">{name}</h2>
          <p className="text-sm text-blue-600">{specialty}</p>
        </div>
      </div>

      {/* Distance Badge */}
      {showDistance && distance !== undefined && (
        <div className="mt-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            📍 {distance} km away
          </span>
        </div>
      )}

      {/* Bio */}
      {bio && (
        <p className="mt-4 text-sm italic text-blue-700 line-clamp-2">{bio}</p>
      )}

      {/* Info Section */}
      <div className="text-sm mt-4 space-y-2 text-blue-900">
        <p>
          <strong>Experience:</strong> {experience} years
        </p>
        <p>
          <strong>Consultation Fee:</strong> <span className="text-green-600 font-semibold">₹{fee}</span>
        </p>
        {qualifications && qualifications.length > 0 && (
          <p>
            <strong>Qualifications:</strong> {qualifications.join(', ')}
          </p>
        )}
        <p className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{clinicAddress}</span>
        </p>
        {phone && phone !== 'N/A' && (
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-500" />
            {phone}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
          onClick={() => router.push(`/pages/book/${_id}`)}
        >
          Book Now
        </button>
        <button
          className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-blue-400 text-blue-600 hover:bg-blue-50 transition-all"
          onClick={() => router.push(`/pages/doctors/${_id}`)}
        >
          View Profile
        </button>
      </div>
    </motion.div>
  );
}
