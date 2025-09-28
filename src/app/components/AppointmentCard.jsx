'use client';

import React, { useState } from 'react';
import api from '../utils/api';

export default function AppointmentCard({ appointment, onCancel, onDelete }) {
  const [isCancelled, setIsCancelled] = useState(appointment.status === 'cancelled');
  const [isDeleted, setIsDeleted] = useState(false);

  if (!appointment || isDeleted) {
    return (
      <div className="text-center py-6 text-gray-500">
        No Appointments
      </div>
    );
  }

  const { _id, scheduledFor, doctor, status, notes } = appointment;
  const d = new Date(scheduledFor);

  const token = localStorage.getItem('token');

  const handleCancel = async () => {
    try {
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      const res = await api.patch(`/appointments/${_id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 200) {
        console.error('Cancellation failed:', res.data);
        return;
      }

      setIsCancelled(true);
      if (onCancel && typeof onCancel === 'function') {
        onCancel(_id);
      }
    } catch (err) {
      console.error('Cancellation failed:', err.response?.data || err.message);
    }
  };

  const handleDelete = async () => {
    try {
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      const res = await api.delete(`/appointments/${_id}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 200) {
        console.error('Delete failed:', res.data);
        return;
      }

      setIsDeleted(true);
      if (onDelete && typeof onDelete === 'function') {
        onDelete(_id);
      }
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err.message);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-3xl mx-auto border mb-4">
      <div className="flex justify-between items-center">
        {/* Date Section */}
        <div className="text-center w-20">
          <div className="text-4xl font-bold text-red-600">{d.getDate()}</div>
          <div className="uppercase text-sm text-gray-500">
            {d.toLocaleString('default', { month: 'short' })}
          </div>
          <div className="uppercase text-xs text-gray-400">
            {d.toLocaleString('en-US', { weekday: 'short' })}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 ml-6 space-y-1">
          <div className="text-sm text-gray-500">Time</div>
          <div className="font-medium text-lg">
            {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>

          <div className="text-sm text-gray-500 mt-2">Doctor</div>
          <div className="font-medium">{doctor?.name || 'Unknown Doctor'}</div>

          <div className="text-sm text-gray-500 mt-2">Notes</div>
          <div className="font-normal text-gray-700 text-sm">{notes || "No notes"}</div>

          <div className="text-sm text-gray-500 mt-2">Status</div>
          <div className={`font-semibold ${isCancelled ? 'text-red-600' : 'text-green-600'}`}>
            {isCancelled ? 'Cancelled' : status || 'Booked'}
          </div>
        </div>

        {/* Actions */}
        <div className="ml-4 space-y-2 flex flex-col">
          {!isCancelled && (
            <button
              onClick={handleCancel}
              className="px-4 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleDelete}
            className="px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
