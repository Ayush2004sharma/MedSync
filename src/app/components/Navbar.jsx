"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, role, loading } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const appointmentCount = user?.appointmentCount || 0;

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        const menuButton = document.getElementById("mobile-menu-button");
        if (menuButton && !menuButton.contains(event.target)) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  if (loading) {
    return (
      <header className="bg-white shadow-md px-4 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="flex space-x-4">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-white shadow-md px-4 py-3 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="text-2xl font-extrabold flex items-center gap-2 text-blue-800 transition-colors"
            >
              <span className="text-3xl">🩺</span>
              <span>Prescripto</span>
            </Link>
          </div>

          <nav className="hidden md:flex flex-1 justify-center space-x-8 text-gray-900 font-semibold text-base select-none">
            <Link href="/" className="hover:text-blue-600 transition-colors duration-200">
              Home
            </Link>
            <Link href="/pages/doctors" className="hover:text-blue-600 transition-colors duration-200">
              All Doctors
            </Link>
            <Link href="/#about" className="hover:text-blue-600 transition-colors duration-200">
              About
            </Link>
            <Link href="/#contact" className="hover:text-blue-600 transition-colors duration-200">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-200 object-cover hover:border-blue-400 transition-all duration-200"
                  aria-expanded={dropdownOpen}
                  aria-label="User menu"
                >
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-blue-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in-down">
                    <Link
                      href="/pages/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-3 text-gray-900 hover:bg-blue-50 transition-colors duration-150"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/pages/appointments"
                      onClick={() => setDropdownOpen(false)}
                      className="flex justify-between items-center px-4 py-3 text-gray-900 hover:bg-blue-50 transition-colors duration-150"
                    >
                      <span>My Appointments</span>
                      {appointmentCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                          {appointmentCount}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-blue-50 transition-colors duration-150"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/pages/login" className="hidden md:block text-blue-700 font-bold hover:underline transition-all duration-200">
                  Login
                </Link>
                <Link href="/pages/register" className="hidden md:block bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white px-4 py-2 rounded-md font-bold shadow hover:opacity-90 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                  Register
                </Link>
              </>
            )}

            <button
              id="mobile-menu-button"
              className="inline-flex md:hidden items-center justify-center p-2 rounded-lg hover:bg-blue-100 transition-all duration-200"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle main menu"
            >
              {mobileMenuOpen ? (
                <X className="w-7 h-7 text-blue-700" />
              ) : (
                <Menu className="w-7 h-7 text-blue-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300" onClick={closeMobileMenu} />
      )}

      <div
        ref={mobileMenuRef}
        className={`fixed top-[60px] right-0 h-[calc(100vh-60px)] w-64 bg-white shadow-2xl z-40 md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-4 font-semibold text-gray-800 space-y-1">
          <Link href="/" onClick={closeMobileMenu} className="py-3 px-4 hover:bg-blue-50 rounded-lg transition-colors duration-150">
            Home
          </Link>
          <Link href="/pages/doctors" onClick={closeMobileMenu} className="py-3 px-4 hover:bg-blue-50 rounded-lg transition-colors duration-150">
            All Doctors
          </Link>
          <Link href="/#about" onClick={closeMobileMenu} className="py-3 px-4 hover:bg-blue-50 rounded-lg transition-colors duration-150">
            About
          </Link>
          <Link href="/#contact" onClick={closeMobileMenu} className="py-3 px-4 hover:bg-blue-50 rounded-lg transition-colors duration-150">
            Contact
          </Link>

          {!user && (
            <>
              <div className="border-t border-gray-200 my-2" />
              <Link href="/pages/login" onClick={closeMobileMenu} className="py-3 px-4 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-150">
                Login
              </Link>
              <Link href="/pages/register" onClick={closeMobileMenu} className="py-3 px-4 text-white bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 rounded-lg text-center font-bold shadow hover:opacity-90 transition-all duration-150">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
