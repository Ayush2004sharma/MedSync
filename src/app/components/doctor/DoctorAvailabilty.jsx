'use client';

import { useEffect, useState } from 'react';
import api from '@/app/utils/api';
import { useAuthContext } from '@/app/context/AuthContext';

const daysOfWeek = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
];

export default function DoctorWeeklySchedule() {
  const [weeklySlots, setWeeklySlots] = useState(() =>
    daysOfWeek.reduce((acc, d) => {
      acc[d.key] = { active: false, slots: [] }; // default: doctor off on all days
      return acc;
    }, {})
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuthContext();
  const doctorId = user?.doctorId || '';

  useEffect(() => {
    if (doctorId) fetchWeeklySchedule();
  }, [doctorId]);

 const fetchWeeklySchedule = async () => {
  try {
    setError('');
    const res = await api.get('/doctors/availability', { params: { doctorId } });
    // Expect: { data: { mon: {...}, tue: {...}, ... } }
    if (res.data?.data) setWeeklySlots(res.data.data);
  } catch (err) {
    setError('Could not load weekly schedule.');
  }
};


  // Toggle day on/off
  const toggleDay = (key) => {
    setWeeklySlots((prev) => ({
      ...prev,
      [key]: { ...prev[key], active: !prev[key].active },
    }));
  };

  // Add slot to day (if not duplicate)
  const addSlot = (key, time) => {
    if (!time || weeklySlots[key].slots.includes(time)) return;
    setWeeklySlots((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        slots: [...prev[key].slots, time].sort(),
      },
    }));
  };

  // Remove slot from day
  const removeSlot = (key, time) => {
    setWeeklySlots((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        slots: prev[key].slots.filter((t) => t !== time),
      },
    }));
  };

  // Save/sync weekly schedule
  const saveSchedule = async () => {
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      // IMPORTANT: Use correct backend key!
      await api.post('/doctors/availability', {
        doctor: doctorId, // Must be 'doctor' not 'doctorId'
        schedule: weeklySlots,
      });
      setSuccess('Schedule updated!');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not save. Please try again.'
      );
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  return (
    <div className="rounded-xl border p-6 shadow bg-white w-full max-w-3xl mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">🗓️ Your Weekly Working Schedule</h2>

      {error && <div className="mb-2 text-red-600">{error}</div>}
      {success && <div className="mb-2 text-green-700">{success}</div>}

      <table className="w-full text-left mb-4">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-1">Day</th>
            <th className="py-2 px-1">Works?</th>
            <th className="py-2 px-1">Slots</th>
            <th className="py-2 px-1"></th>
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map(({ key, label }) => (
            <tr key={key} className={weeklySlots[key].active ? "bg-blue-50" : "bg-gray-50"}>
              <td className="py-2 font-semibold text-blue-900">{label}</td>
              <td className="py-2">
                <input
                  type="checkbox"
                  checked={weeklySlots[key].active}
                  onChange={() => toggleDay(key)}
                />
              </td>
              <td className="py-2">
                {weeklySlots[key].active && (
                  <div className="flex flex-wrap gap-1 items-center">
                    {weeklySlots[key].slots.map((slot) => (
                      <span
                        key={slot}
                        className="bg-blue-200 text-blue-800 px-2 py-1 rounded-lg text-xs flex items-center gap-1"
                      >
                        {slot}
                        <button
                          onClick={() => removeSlot(key, slot)}
                          className="text-pink-500 font-extrabold px-1"
                          type="button"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </td>
              <td>
                {weeklySlots[key].active && (
                  <SlotInput onAdd={(t) => addSlot(key, t)} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={saveSchedule}
        disabled={loading}
        className="w-full rounded-lg bg-gradient-to-r from-green-600 to-blue-400 px-4 py-3 text-white font-bold hover:from-green-700 hover:to-blue-500 transition"
      >
        {loading ? 'Saving...' : 'Save Weekly Schedule'}
      </button>
    </div>
  );
}

// -- Reusable slot input mini-section for each day --
function SlotInput({ onAdd }) {
  const [time, setTime] = useState('');
  return (
    <div className="flex gap-2">
      <input
        type="time"
        className="rounded px-2 py-1 border"
        value={time}
        onChange={e => setTime(e.target.value)}
      />
      <button
        onClick={() => { onAdd(time); setTime(''); }}
        className="bg-blue-600 px-2 py-1 text-white rounded hover:bg-blue-800"
        type="button"
        disabled={!time}
      >
        +
      </button>
    </div>
  );
}
