'use client';

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { assets } from "../assets/assets_frontend/assets";

export default function ContactUsSection() {
  return (
    <section className="w-full px-4 sm:px-6 py-20 bg-white border-t-2 border-blue-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-blue-900 mb-16 tracking-tight">
          Contact <span className="text-blue-600">Us</span>
        </h2>

        <div className="bg-blue-50 shadow-xl rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-12 border border-blue-100">
          
          {/* Left Image */}
          <div className="relative w-full h-[300px] md:h-[450px] md:w-1/2 rounded-3xl overflow-hidden shadow-md">
            <Image
              src={assets.contact_image}
              alt="Doctor with patient"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Right Info */}
          <div className="w-full md:w-1/2 space-y-10 text-gray-800">
            
            {/* Office Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-blue-800 underline underline-offset-4">
                Our Office
              </h3>
              <address className="not-italic space-y-2 text-base leading-relaxed text-gray-700">
                <div className="flex items-start gap-2">
                  <MapPin className="text-blue-600 mt-1" size={20} />
                  <p>
                    B-207, Sector 62<br />
                    Noida, Uttar Pradesh, India - 201301
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="text-blue-600" size={18} />
                  <a href="tel:+919876543210" className="text-blue-700 hover:underline">
                    +91 98765 43210
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="text-blue-600" size={18} />
                  <a href="mailto:contact@prescripto.in" className="text-blue-700 hover:underline">
                    contact@prescripto.in
                  </a>
                </div>
              </address>
            </div>

            {/* Careers */}
            <div>
              <h4 className="text-xl font-semibold text-blue-900 mb-1">
                Careers at Prescripto
              </h4>
              <p className="text-base text-gray-600 mb-4">
                Join our team of innovators, caregivers & tech leaders.
              </p>
              <Link href="/careers">
                <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-medium hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-md">
                  Explore Jobs
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
