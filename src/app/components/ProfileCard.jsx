'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Mail, X, Phone, MapPin, Calendar, User, Heart, Save } from 'lucide-react';
import api from '../utils/api';

export default function ProfileCard({ profile, role }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  if (!formData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  const { name, email, phone, image, gender, dob, address, medicalHistory } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'line1' || name === 'line2') {
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const url = role === "doctor" ? "/doctors/profile" : "/users/profile";
      const token = localStorage.getItem("token");
      const response = await api.patch(url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData(response.data.user || response.data);
      setIsEditing(false);
      alert('✅ Profile updated!');
    } catch (error) {
      alert('❌ Update failed: ' + (error.response?.data?.message || 'Try again'));
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <img
            src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`}
            alt={name}
            className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{name}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {gender && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  <User className="w-3 h-3" /> {gender}
                </span>
              )}
              {dob && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                  <Calendar className="w-3 h-3" /> {new Date(dob).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Email</p>
              <p className="text-sm text-gray-900 dark:text-white truncate">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Phone</p>
              <p className="text-sm text-gray-900 dark:text-white">{phone || 'Not provided'}</p>
            </div>
          </div>

          {(address?.line1 || address?.line2) && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-pink-50 dark:bg-pink-900/20">
              <MapPin className="w-5 h-5 text-pink-600 dark:text-pink-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-pink-600 dark:text-pink-400 font-semibold">Address</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {address.line1}{address.line2 && `, ${address.line2}`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Medical History */}
        {medicalHistory?.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Medical History</h3>
            </div>
            <div className="space-y-2">
              {medicalHistory.map((entry, idx) => (
                <div key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{entry.condition}</span>
                  {entry.diagnosedAt && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      ({new Date(entry.diagnosedAt).toLocaleDateString()})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            <Pencil size={16} /> Edit
          </button>
          <button className="px-4 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition">
            <Mail size={16} />
          </button>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsEditing(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-blue-600 p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-white/20 rounded-lg text-white">
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob?.split('T')[0] || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Address Line 1</label>
                    <input
                      type="text"
                      name="line1"
                      value={formData.address?.line1 || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Address Line 2</label>
                    <input
                      type="text"
                      name="line2"
                      value={formData.address?.line2 || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  <Save size={18} /> Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
