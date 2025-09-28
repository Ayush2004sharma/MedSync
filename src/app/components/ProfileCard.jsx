'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Mail, X } from 'lucide-react';
import api from '../utils/api';

export default function ProfileCard({ profile, role }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  if (!formData) {
    return (
      <div className="max-w-4xl w-full mx-auto p-8 bg-white rounded-2xl shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="flex gap-4 items-center">
          <div className="w-24 h-24 rounded-full bg-gray-300" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  const { name, email, phone, image, gender, dob, address, medicalHistory } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested address fields
    if (name === 'line1' || name === 'line2') {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const url = role === "doctor" ? "/doctors/profile" : "/users/profile";

      const response = await api.patch(url, formData, {
        withCredentials: true,
      });

      setFormData(response.data);
      alert('✅ Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('❌ Error:', error);
      if (error.response) {
        alert(`❌ Failed to update: ${error.response.data.message || 'Unauthorized or bad input'}`);
      } else {
        alert('❌ Network error. Check backend and CORS settings.');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white rounded-2xl shadow-md p-8 max-w-4xl w-full mx-auto"
    >
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={image || '/default.png'}
          alt={name}
          className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500 shadow"
        />
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-600">Gender: {gender || '—'}</p>
          <p className="text-sm text-gray-600">DOB: {dob || '—'}</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-700">
        <p><span className="font-semibold">📧 Email:</span> {email}</p>
        <p><span className="font-semibold">📱 Phone:</span> {phone || 'Not Provided'}</p>
        <p><span className="font-semibold">🏠 Address Line 1:</span> {address?.line1 || '—'}</p>
        <p><span className="font-semibold">🏙️ Address Line 2:</span> {address?.line2 || '—'}</p>
      </div>

      {/* Medical History */}
      {medicalHistory?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">📝 Medical History</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {medicalHistory.map((entry, index) => (
              <li key={index}>
                <span className="font-medium">{entry.condition}</span>{" "}
                {entry.diagnosedAt && `(Diagnosed: ${new Date(entry.diagnosedAt).toLocaleDateString()})`}
                {entry.notes && ` — ${entry.notes}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium transition"
        >
          <Pencil size={16} /> Edit Profile
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 text-sm font-medium transition">
          <Mail size={16} /> Message
        </button>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full relative">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Profile</h2>
            <div className="space-y-3">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 rounded border bg-gray-100 text-sm" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 rounded border bg-gray-100 text-sm" />
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 rounded border bg-gray-100 text-sm" />
              <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" className="w-full p-2 rounded border bg-gray-100 text-sm" />
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-2 rounded border bg-gray-100 text-sm" />
              <input type="text" name="line1" value={formData?.address?.line1 || ''} onChange={handleChange} placeholder="Address Line 1" className="w-full p-2 rounded border bg-gray-100 text-sm" />
              <input type="text" name="line2" value={formData?.address?.line2 || ''} onChange={handleChange} placeholder="Address Line 2" className="w-full p-2 rounded border bg-gray-100 text-sm" />
              <textarea
                name="medicalNotes"
                placeholder="Add Medical History Notes"
                value={formData.medicalNotes || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, medicalNotes: e.target.value }))
                }
                className="w-full p-2 rounded border bg-gray-100 text-sm h-20"
              />
            </div>
            <button onClick={handleSave} className="mt-5 w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium text-sm">
              Save Changes
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
