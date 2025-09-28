"use client";
import { useState } from "react";
import UserAuthForm from "../../components/forms/UserAuthForm";
import DoctorAuthForm from "../../components/forms/DoctorAuthForm";
import api from "../../utils/api";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/app/context/AuthContext";
export default function LoginPage() {
  const [role, setRole] = useState("user");
  const router = useRouter();
  const { login } = useAuthContext(); // 👈 grab login from context

  const handleSubmit = async (credentials) => {
    try {
      await login(credentials, role); // 👈 call context login
      router.push("/"); // 👈 now navbar will update properly
    } catch (err) {
      console.error("Login failed", err);
      // Optional: show toast or alert
    }}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-2">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-700">
          Login as {role === "doctor" ? "Doctor" : "Patient"}
        </h1>
        {/* RADIO BUTTON STYLE SELECTOR START */}
        <div className="mb-6">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Choose account type:
          </span>
          <div className="flex space-x-4 mt-2">
            <label className="flex items-center cursor-pointer space-x-2">
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === "user"}
                onChange={() => setRole("user")}
                className="accent-indigo-600 w-5 h-5"
              />
              <span className="text-gray-700 font-medium">Patient</span>
            </label>
            <label className="flex items-center cursor-pointer space-x-2">
              <input
                type="radio"
                name="role"
                value="doctor"
                checked={role === "doctor"}
                onChange={() => setRole("doctor")}
                className="accent-indigo-600 w-5 h-5"
              />
              <span className="text-gray-700 font-medium">Doctor</span>
            </label>
          </div>
        </div>
        {/* RADIO BUTTON STYLE SELECTOR END */}
        {role === "user"
          ? <UserAuthForm onSubmit={handleSubmit} />
          : <DoctorAuthForm onSubmit={handleSubmit} />
        }
      </div>
    </div>
  );
}
