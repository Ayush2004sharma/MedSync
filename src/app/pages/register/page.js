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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 max-w-lg w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-indigo-700">
          Register as {role === "doctor" ? "Doctor" : "Patient"}
        </h1>
        
        <div className="mb-8">
          <label 
            htmlFor="role" 
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Choose account type:
          </label>
          <select
            id="role"
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full border-2 border-indigo-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
