"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, role, loading } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const appointmentCount = user?.appointmentCount || 0;

  useEffect(() => {
    console.log("🔁 Auth state updated:", user);
  }, [user]);

  if (loading) return null;

  return (
    <header className="bg-white shadow-md px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link
            href="/"
            className="text-2xl font-extrabold flex items-center gap-2 text-blue-800"
          >
            <span className="text-3xl">🩺</span> <span>Prescripto</span>
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 justify-center space-x-8 text-gray-900 font-semibold text-base select-none">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link
            href="/pages/doctors"
            className="hover:text-blue-600 transition"
          >
            All Doctors
          </Link>
          <Link href="/#about" className="hover:text-blue-600 transition">
            About
          </Link>
          <Link href="/#contact" className="hover:text-blue-600 transition">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          {user ? (
            <div className="relative">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt="Avatar"
                onClick={toggleDropdown}
                className="w-10 h-10 rounded-full cursor-pointer border border-blue-200 object-cover"
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-blue-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <Link
                    href="/pages/profile"
                    className="block px-4 py-3 text-gray-900 hover:bg-blue-50"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/pages/appointments"
                    className="flex justify-between items-center px-4 py-3 text-gray-900 hover:bg-blue-50"
                  >
                    <span>My Appointments</span>
                    {appointmentCount > 0 && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                        {appointmentCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-blue-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/pages/login"
                className="text-blue-700 font-bold hover:underline"
              >
                Login
              </Link>
              <Link
                href="/pages/register"
                className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white px-4 py-2 rounded-md font-bold shadow hover:opacity-90 transition"
              >
                Register
              </Link>
            </>
          )}

          <button
            className="inline-flex md:hidden items-center justify-center p-2 rounded-lg hover:bg-blue-100 transition"
            onClick={toggleMobileMenu}
            aria-label="Open main menu"
          >
            <Menu className="w-7 h-7 text-blue-700" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-blue-100 shadow">
          <nav className="flex flex-col space-y-1 p-4 font-semibold text-gray-800">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="py-2 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              href="/pages/doctors"
              onClick={closeMobileMenu}
              className="py-2 hover:text-blue-600"
            >
              All Doctors
            </Link>
            <Link
              href="/#about"
              onClick={closeMobileMenu}
              className="py-2 hover:text-blue-600"
            >
              About
            </Link>
            <Link
              href="/#contact"
              onClick={closeMobileMenu}
              className="py-2 hover:text-blue-600"
            >
              Contact
            </Link>

            {!user && (
              <>
                <Link
                  href="/pages/login"
                  onClick={closeMobileMenu}
                  className="py-2 text-blue-700 hover:underline"
                >
                  Login
                </Link>
                <Link
                  href="/pages/register"
                  onClick={closeMobileMenu}
                  className="py-2 text-white bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 rounded-md text-center font-bold shadow hover:opacity-90 transition"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
