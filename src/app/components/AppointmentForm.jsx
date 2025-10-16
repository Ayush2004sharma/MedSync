'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, CheckCircle } from 'lucide-react';

export default function AppointmentForm({ onBook, doctorName }) {
  const [scheduledFor, setScheduledFor] = useState('');
  const [notes, setNotes] = useState('');
  const [minDateTime, setMinDateTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Set minimum datetime to current time
  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinDateTime(now.toISOString().slice(0, 16));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!scheduledFor) {
      alert('Please select a date and time');
      return;
    }

    const selectedDate = new Date(scheduledFor);
    const now = new Date();
    
    if (selectedDate < now) {
      alert('Please select a future date and time');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (onBook) {
        await onBook({ scheduledFor, notes });
        setShowSuccess(true);
        
        // Reset form after success
        setTimeout(() => {
          setScheduledFor('');
          setNotes('');
          setShowSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Book an Appointment
          </h1>
          {doctorName && (
            <p className="text-lg text-gray-600 dark:text-gray-400">
              with {doctorName}
            </p>
          )}
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-green-800 dark:text-green-300 font-medium">
              Appointment booked successfully!
            </p>
          </div>
        )}

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100 dark:border-gray-700"
        >
          {/* Date & Time Input */}
          <div className="space-y-2">
            <label
              htmlFor="datetime"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Choose Date & Time
            </label>
            <input
              id="datetime"
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              min={minDateTime}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Select a date and time in the future
            </p>
          </div>

          {/* Notes Input */}
          <div className="space-y-2">
            <label
              htmlFor="notes"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe your symptoms or reason for visit..."
              rows={5}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {notes.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5" />
                Book Appointment
              </>
            )}
          </button>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
              📋 Important Information
            </h3>
            <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
              <li>• Appointment requires doctor approval</li>
              <li>• You will receive a confirmation email</li>
              <li>• Arrive 10 minutes early for your appointment</li>
              <li>• Cancel at least 24 hours in advance if needed</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}
