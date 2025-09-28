'use client';

import React, { useState } from 'react';

export default function AppointmentForm({ onBook }) {
  const [scheduledFor, setScheduledFor] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onBook && scheduledFor) {
      onBook({ scheduledFor, notes });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md max-w-md mx-auto space-y-5"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        Book an Appointment
      </h2>

      <div className="flex flex-col space-y-1">
        <label
          htmlFor="datetime"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Choose Date & Time
        </label>
        <input
          id="datetime"
          type="datetime-local"
          value={scheduledFor}
          onChange={(e) => setScheduledFor(e.target.value)}
          required
          className="border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label
          htmlFor="notes"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything specific?"
          rows={4}
          className="border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
      >
        Book Appointment
      </button>
    </form>
  );
}
