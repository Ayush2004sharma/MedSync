import React, { useState } from 'react';

export default function DoctorAuthForm({ onSubmit, isRegister = false }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    specialty: ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {isRegister && (
        <>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Dr. John Doe"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="specialty"
            >
              Medical Specialty
            </label>
            <input
              id="specialty"
              type="text"
              name="specialty"
              placeholder="e.g., Cardiologist, Dermatologist"
              value={form.specialty}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </>
      )}
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-2"
          htmlFor="email"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="doctor@hospital.com"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white rounded-lg py-3 px-4 font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all mt-6"
      >
        {isRegister ? "Register as Doctor" : "Login"}
      </button>
    </form>
  );
}
