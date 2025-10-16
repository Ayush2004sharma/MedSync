'use client';

import { useEffect, useState } from 'react';
import { MapPin, Phone, Edit, Save, Stethoscope, Award, Briefcase, DollarSign, MapPinned, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '@/app/context/AuthContext';
import api from '@/app/utils/api';

export default function DoctorProfileCard() {
  const { user, role, loading: authLoading } = useAuthContext();
  const [doctor, setDoctor] = useState(null);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch doctor profile
  useEffect(() => {
    const fetchDoctor = async () => {
      if (!user?.doctorId || role !== 'doctor') return;
      setLoading(true);
      try {
        const res = await api.get(`/doctors/${user.doctorId}`);
        setDoctor(res.data);
        setForm({
          ...res.data,
          coordinates: res.data.location?.coordinates || [0, 0]
        });
      } catch (err) {
        console.error('Failed to load doctor:', err);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) fetchDoctor();
  }, [authLoading, user?.doctorId, role]);

  // Auto-detect location in edit mode
  useEffect(() => {
    if (editMode && (!form.coordinates || (form.coordinates[0] === 0 && form.coordinates[1] === 0))) {
      if ('geolocation' in navigator) {
        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setForm((prev) => ({ ...prev, coordinates: [longitude, latitude] }));
            setGeoLoading(false);
          },
          (err) => {
            console.error('Geolocation error:', err);
            setGeoLoading(false);
          }
        );
      }
    }
  }, [editMode]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const { coordinates, ...otherFields } = form;
      const payload = {
        ...otherFields,
        location: {
          type: 'Point',
          coordinates: coordinates,
        },
      };

      const res = await api.patch(`/doctors/profile/${user.doctorId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDoctor(res.data.updatedDoctor);
      setForm({
        ...res.data.updatedDoctor,
        coordinates: res.data.updatedDoctor.location?.coordinates || [0, 0],
      });
      setEditMode(false);
    } catch (err) {
      console.error('Error updating doctor:', err);
      alert('Failed to update profile');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) return <div className="text-red-500 p-6">Doctor profile not found.</div>;

  const { name, specialty, qualifications, bio, clinicAddress, phone, experience, fee, status, profilePic, coordinates } = form;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
      >
        {/* Header with Avatar */}
        <div className="flex items-start gap-4 mb-6">
          <div className="relative">
            <img
              src={profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`}
              alt={name}
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900 shadow-md"
            />
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 ${
              status === 'available' ? 'bg-green-500' : status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{name}</h2>
            <p className="text-blue-600 dark:text-blue-400 font-medium">{specialty}</p>
            <span className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${
              status === 'available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              status === 'busy' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {status?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Experience</p>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{experience} yrs</p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
              <p className="text-xs font-semibold text-green-600 dark:text-green-400">Consultation Fee</p>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">₹{fee}</p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Qualifications</p>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{qualifications?.join(', ')}</p>
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">About</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">{bio}</p>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Phone Number</p>
              <p className="text-sm text-gray-900 dark:text-white">{phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Clinic Address</p>
              <p className="text-sm text-gray-900 dark:text-white">{clinicAddress}</p>
            </div>
          </div>

          {coordinates && coordinates[0] !== 0 && coordinates[1] !== 0 && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-pink-50 dark:bg-pink-900/20">
              <MapPinned className="w-5 h-5 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-pink-600 dark:text-pink-400">GPS Coordinates</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {coordinates[1].toFixed(6)}, {coordinates[0].toFixed(6)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Edit Button */}
        <button
          onClick={() => setEditMode(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
        >
          <Edit className="w-4 h-4" /> Edit Profile
        </button>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editMode && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditMode(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-blue-600 p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Edit Doctor Profile</h2>
                <button onClick={() => setEditMode(false)} className="p-1 hover:bg-white/20 rounded-lg text-white">
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name</label>
                    <input
                      value={name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Experience (years)</label>
                      <input
                        type="number"
                        value={experience}
                        onChange={(e) => handleChange('experience', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Fee (₹)</label>
                      <input
                        type="number"
                        value={fee}
                        onChange={(e) => handleChange('fee', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Qualifications (comma-separated)</label>
                    <input
                      value={qualifications?.join(', ') || ''}
                      onChange={(e) => handleChange('qualifications', e.target.value.split(',').map(q => q.trim()))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="MBBS, MD, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Phone</label>
                    <input
                      value={phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Clinic Address</label>
                    <input
                      value={clinicAddress}
                      onChange={(e) => handleChange('clinicAddress', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Latitude {geoLoading && <span className="text-blue-500">(detecting...)</span>}
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={coordinates?.[1] || ''}
                        onChange={(e) => handleChange('coordinates', [coordinates?.[0] || 0, parseFloat(e.target.value)])}
                        disabled={geoLoading}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Longitude {geoLoading && <span className="text-blue-500">(detecting...)</span>}
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={coordinates?.[0] || ''}
                        onChange={(e) => handleChange('coordinates', [parseFloat(e.target.value), coordinates?.[1] || 0])}
                        disabled={geoLoading}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 flex gap-3">
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={geoLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
