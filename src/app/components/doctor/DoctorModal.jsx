'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function DoctorModal({ doctor, onClose }) {
  if (!doctor) return null;

  const {
    name,
    specialty,
    qualifications,
    clinicAddress,
    phone,
    experience,
    bio,
    fee,
    profilePic,
  } = doctor;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          className="absolute top-2 right-2 text-zinc-500 hover:text-red-500"
          onClick={onClose}
        >
          <X />
        </button>
        <div className="flex items-center gap-4">
          <img
            src={profilePic || '/doctor-placeholder.png'}
            alt={name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-sm text-zinc-500">{specialty}</p>
          </div>
        </div>
        <div className="mt-4 space-y-1 text-sm">
          {bio && <p><strong>Bio:</strong> {bio}</p>}
          <p><strong>Experience:</strong> {experience} yrs</p>
          <p><strong>Fee:</strong> ₹{fee}</p>
          <p><strong>Qualifications:</strong> {qualifications.join(', ')}</p>
          <p><strong>Address:</strong> {clinicAddress}</p>
          <p><strong>Phone:</strong> {phone}</p>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
