'use client'
import { useState } from "react";
import UserAuthForm from "../../components/forms/UserAuthForm";
import DoctorAuthForm from "../../components/forms/DoctorAuthForm";
import api from "../../utils/api";
import { useRouter } from "next/navigation";


export default function RegisterPage() {
  const [role, setRole] = useState("user");
  const router = useRouter();

  const handleSubmit = async (credentials) => {
    const url = role === "doctor" ? "/doctors/register" : "/users/register";
    await api.post(url, credentials);
    router.push("/pages/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-2">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-700">
          Register as {role === "doctor" ? "Doctor" : "Patient"}
        </h1>
        <div className="mb-6">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Choose account type:
          </label>
          <select
            id="role"
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="user">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

        {role === "user"
          ? <UserAuthForm onSubmit={handleSubmit} isRegister />
          : <DoctorAuthForm onSubmit={handleSubmit} isRegister />
        }
      </div>
    </div>
  );
}
