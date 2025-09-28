'use client';

import { useEffect, useState } from 'react';
import { MapPin, Phone, Edit, Save } from 'lucide-react';
import { useAuthContext } from '@/app/context/AuthContext';
import api from '@/app/utils/api';

export default function DoctorProfileCard() {
  const { user, role, loading: authLoading } = useAuthContext();
  const [doctor, setDoctor] = useState(null);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  console.log(user.doctorId, 'user in doctor profile card');
  const token = localStorage.getItem('token');
  console.log(token, 'user in doctor profile card');
  // Fetch doctor profile by ID
  useEffect(() => {
    const fetchDoctor = async () => {
      if (!user?.doctorId || role !== 'doctor') return;
      setLoading(true);
      try {
        const res = await api.get(`/doctors/${user.doctorId}`);
        setDoctor(res.data);
        // Extract coordinates from GeoJSON for editing
        setForm({
          ...res.data,
          coordinates: res.data.location?.coordinates || [0, 0]
        });
      } catch (err) {
        console.error('Failed to load doctor by ID:', err);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) fetchDoctor();
  }, [authLoading, user?.doctorId, role]);

  // Auto-fetch geolocation on entering edit mode if missing or empty
  useEffect(() => {
    if (
      editMode &&
      (!form.coordinates ||
        form.coordinates.length !== 2 ||
        (form.coordinates[0] === 0 && form.coordinates[1] === 0))
    ) {
      if ('geolocation' in navigator) {
        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setForm((prev) => ({
              ...prev,
              coordinates: [longitude, latitude], // GeoJSON [lng, lat]
            }));
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
          coordinates: coordinates, // [lng, lat]
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
      console.error('Error updating doctor by ID:', err);
    }
  };

  if (authLoading || loading) return <div>Loading profile...</div>;
  if (!doctor) return <div className="text-red-500">Doctor profile not found.</div>;

  const {
    name,
    specialty,
    qualifications,
    bio,
    clinicAddress,
    phone,
    experience,
    fee,
    status,
    profilePic,
    coordinates,
  } = form;

  return (
    <div className="rounded-2xl p-6 w-full max-w-xl bg-white border border-blue-100 shadow-lg space-y-4">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <img
          src={profilePic || '/doctor-placeholder.png'}
          alt={name}
          className="w-20 h-20 rounded-full object-cover border-2 border-blue-400 shadow-sm"
        />
        <div>
          {editMode ? (
            <input
              value={name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="text-xl font-semibold text-blue-900 bg-transparent border-b border-blue-300 focus:outline-none"
            />
          ) : (
            <h2 className="text-xl font-bold text-blue-900">{name}</h2>
          )}
          <p className="text-sm text-blue-700">{specialty}</p>
          <p
            className={`text-xs font-semibold ${
              status === 'available'
                ? 'text-green-600'
                : status === 'busy'
                  ? 'text-yellow-600'
                  : 'text-red-500'
            }`}
          >
            {status?.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Editable Fields */}
      <div className="space-y-2 text-blue-900 text-sm">
        <p>
          <strong>Bio:</strong>{' '}
          {editMode ? (
            <textarea
              value={bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full p-1 rounded border border-blue-200 bg-blue-50"
            />
          ) : (
            <span className="italic text-blue-800">{bio || 'N/A'}</span>
          )}
        </p>
        <p>
          <strong>Experience:</strong>{' '}
          {editMode ? (
            <input
              type="number"
              value={experience}
              onChange={(e) => handleChange('experience', e.target.value)}
              className="w-16 px-1 border border-blue-200 rounded bg-blue-50"
            />
          ) : (
            `${experience} yrs`
          )}
        </p>
        <p>
          <strong>Fee:</strong>{' '}
          {editMode ? (
            <input
              type="number"
              value={fee}
              onChange={(e) => handleChange('fee', e.target.value)}
              className="w-16 px-1 border border-blue-200 rounded bg-blue-50"
            />
          ) : (
            `₹${fee}`
          )}
        </p>
        <p>
          <strong>Qualifications:</strong>{' '}
          {editMode ? (
            <input
              value={qualifications?.join(', ') || ''}
              onChange={(e) =>
                handleChange(
                  'qualifications',
                  e.target.value.split(',').map((q) => q.trim())
                )
              }
              className="w-full px-1 border border-blue-200 rounded bg-blue-50"
            />
          ) : (
            qualifications?.join(', ')
          )}
        </p>
        <p>
          <strong>Latitude:</strong>{' '}
          {editMode ? (
            geoLoading ? (
              <span className="text-blue-400 ml-2">Detecting...</span>
            ) : (
              <input
                type="number"
                step="any"
                value={coordinates && coordinates.length === 2 ? coordinates[1] : ''}
                onChange={(e) =>
                  handleChange('coordinates', [
                    coordinates && coordinates.length === 2 ? coordinates[0] : '',
                    parseFloat(e.target.value)
                  ])
                }
                className="w-32 px-1 border border-blue-200 rounded bg-blue-50"
              />
            )
          ) : (
            coordinates && coordinates.length === 2 ? coordinates[1] : 'N/A'
          )}
        </p>
        <p>
          <strong>Longitude:</strong>{' '}
          {editMode ? (
            geoLoading ? (
              <span className="text-blue-400 ml-2">Detecting...</span>
            ) : (
              <input
                type="number"
                step="any"
                value={coordinates && coordinates.length === 2 ? coordinates[0] : ''}
                onChange={(e) =>
                  handleChange('coordinates', [
                    parseFloat(e.target.value),
                    coordinates && coordinates.length === 2 ? coordinates[1] : ''
                  ])
                }
                className="w-32 px-1 border border-blue-200 rounded bg-blue-50"
              />
            )
          ) : (
            coordinates && coordinates.length === 2 ? coordinates[0] : 'N/A'
          )}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          {editMode ? (
            <input
              value={clinicAddress}
              onChange={(e) => handleChange('clinicAddress', e.target.value)}
              className="w-full px-1 border border-blue-200 rounded bg-blue-50"
            />
          ) : (
            clinicAddress
          )}
        </p>
        <p className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-blue-500" />
          {editMode ? (
            <input
              value={phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="px-1 border border-blue-200 rounded bg-blue-50"
            />
          ) : (
            phone
          )}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        {editMode ? (
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            disabled={geoLoading}
          >
            <Save className="w-4 h-4" /> Save
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
        )}
      </div>
    </div>
  );
}
