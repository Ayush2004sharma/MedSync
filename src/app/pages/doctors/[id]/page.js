// app/doctors/[id]/page.js
import React from 'react';
import api from '@/app/utils/api';
import Link from 'next/link'; // ✅ fix here!
import { MapPin, Phone } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function DoctorProfilePage({ params }) {
  const { id } = params;
  let doctor = null;

  try {
    const res = await api.get(`/doctors/${id}`);
    doctor = res.data;
    if (!doctor) notFound();
  } catch (err) {
    console.error('Failed to fetch doctor:', err);
    notFound();
  }

  const {
    name,
    specialty,
    qualifications = [],
    bio,
    experience,
    phone,
    clinicAddress,
    fee,
    status,
    profilePic,
  } = doctor;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-3xl p-8 border border-blue-200">
        <div className="flex items-center gap-6">
          <img
            src={profilePic || '/doctor-placeholder.png'}
            alt={name}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-300 shadow-md"
          />
          <div>
            <h1 className="text-2xl font-bold text-blue-800">{name}</h1>
            <p className="text-blue-600 font-medium">{specialty}</p>
            <p
              className={`text-sm ${
                status === 'available'
                  ? 'text-green-500'
                  : status === 'busy'
                  ? 'text-yellow-600'
                  : 'text-red-500'
              }`}
            >
              {status?.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-blue-900 text-sm">
          {bio && <p className="italic text-blue-700">{bio}</p>}
          <p>
            <strong>Experience:</strong> {experience ?? 'Not specified'} years
          </p>
          <p>
            <strong>Fee:</strong> ₹{fee ?? 'N/A'}
          </p>
          <p>
            <strong>Qualifications:</strong>{' '}
            {qualifications.length ? qualifications.join(', ') : 'N/A'}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            {clinicAddress ?? 'Not specified'}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-500" />
            {phone ?? 'Not provided'}
          </p>
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href={`/pages/book/${id}`}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
