'use client';

import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function DoctorCard({ doctor }) {
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
    status = 'offline',
    profilePic,
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
          src={profilePic || '/doctor-placeholder.png'}
          alt={name}
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-400 shadow-md"
        />
        <div>
          <h2 className="text-xl font-bold text-blue-800">{name}</h2>
          <p className="text-sm text-blue-600">{specialty}</p>
          <p
            className={`text-xs font-semibold ${
              status === 'available'
                ? 'text-green-600'
                : status === 'busy'
                ? 'text-yellow-600'
                : 'text-red-500'
            }`}
          >
            {status.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="text-sm mt-4 space-y-1 text-blue-900">
        {bio && <p className="italic text-blue-700">{bio}</p>}
        <p>
          <strong>Experience:</strong> {experience} yrs
        </p>
        <p>
          <strong>Fee:</strong> ₹{fee}
        </p>
        <p>
          <strong>Qualifications:</strong>{' '}
          {qualifications.length ? qualifications.join(', ') : 'N/A'}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          {clinicAddress}
        </p>
        <p className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-blue-500" />
          {phone}
        </p>
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
