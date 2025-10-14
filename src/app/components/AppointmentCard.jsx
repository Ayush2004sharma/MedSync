"use client";
import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function AppointmentCard({ appointment, role, onCancel, onDelete }) {
  const [status, setStatus] = useState(appointment?.status || '');
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    if (appointment?.status) setStatus(appointment.status);
  }, [appointment]);

  if (!appointment || isDeleted) {
    return <div className="text-center py-6 text-gray-500">No Appointments</div>;
  }

  const { _id, scheduledFor, doctor, notes } = appointment;
  const d = new Date(scheduledFor);
  const token = localStorage.getItem('token');

  const handleCancel = async () => {
    try {
      if (!token) return;
      await api.patch(`/appointments/${_id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setStatus('cancelled');
      if (onCancel) onCancel(_id);
    } catch (err) {}
  };

  const handleDelete = async () => {
    try {
      if (!token) return;
      await api.delete(`/appointments/${_id}/delete`, { headers: { Authorization: `Bearer ${token}` } });
      setIsDeleted(true);
      if (onDelete) onDelete(_id);
    } catch (err) {}
  };

  const handleApprove = async () => {
    try {
      if (!token) return;
      await api.patch(`/appointments/${_id}/approve`, { approve: true }, { headers: { Authorization: `Bearer ${token}` } });
      setStatus('booked');
    } catch (err) {}
  };

  const handleReject = async () => {
    try {
      if (!token) return;
      await api.patch(`/appointments/${_id}/approve`, { approve: false }, { headers: { Authorization: `Bearer ${token}` } });
      setStatus('rejected');
    } catch (err) {}
  };

  const isCancellable = status !== 'cancelled' && status !== 'rejected';

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
            {d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
          </div>
       <div className="text-sm text-gray-500 mt-2">
  {role === 'doctor' ? 'Patient' : 'Doctor'}</div>
          <div className="font-medium">{doctor?.name ?? 'Unknown Doctor'}</div>
          <div className="text-sm text-gray-500 mt-2">Notes</div>
          <div className="font-normal text-gray-700 text-sm">{notes || 'No notes'}</div>
          <div className="text-sm text-gray-500 mt-2">Status</div>
          <div className={`font-semibold ${
              status === 'cancelled' || status === 'rejected'
                ? 'text-red-600'
                : status === 'pending'
                ? 'text-yellow-500'
                : 'text-green-600'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
        {/* Actions */}
        <div className="ml-4 space-y-2 flex flex-col">
          {role === 'doctor' && status === 'pending' && (
            <>
              <button onClick={handleApprove} className="px-4 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition">Approve</button>
              <button onClick={handleReject} className="px-4 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500 transition">Reject</button>
            </>
          )}
          {role === 'user' && isCancellable && (
            <button onClick={handleCancel} className="px-4 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">Cancel</button>
          )}
          <button onClick={handleDelete} className="px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition">Delete</button>
        </div>
      </div>
    </div>
  );
}
