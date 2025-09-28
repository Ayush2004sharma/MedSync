'use client';

import { assets } from "../assets/assets_frontend/assets";
import Image from "next/image";

export default function AboutUsSection() {
  return (
    <section className="w-full bg-gray-50 px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* About Us Block */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 bg-white border border-gray-200 shadow-sm p-6 md:p-10 rounded-md">
        {/* Image */}
        <div className="w-full md:w-1/2">
          <Image
            src={assets.about_image}
            alt="Doctors"
            className="rounded-md shadow-sm object-cover w-full h-auto"
            width={600}
            height={450}
            priority
          />
        </div>

        {/* Text Content */}
        <div className="w-full md:w-1/2 space-y-6 text-gray-800">
          <h2 className="text-3xl font-bold text-gray-900 leading-snug">
            About <span className="text-blue-600">Prescripto</span>
          </h2>
          <p className="text-base leading-relaxed">
            Welcome to <strong>Prescripto</strong>, your trusted partner in simplifying healthcare.
            We help you manage doctor appointments, health records, and access care—effortlessly.
          </p>
          <p className="text-base leading-relaxed">
            We continuously enhance our platform with the latest tech, so your experience is smooth from booking to follow-up.
          </p>
          <div>
            <h3 className="text-lg font-semibold text-blue-700">Our Vision</h3>
            <p className="text-base mt-1">
              To bridge the gap between patients and providers, making healthcare accessible for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Why <span className="text-blue-600">Choose Us</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Efficiency", desc: "Quick, no-hassle appointment scheduling." },
            { title: "Convenience", desc: "Access doctors and care on your time." },
            { title: "Personalization", desc: "Health tips & reminders just for you." },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="p-6 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition"
            >
              <h4 className="font-semibold text-lg text-gray-900 mb-2">{title}</h4>
              <p className="text-sm text-gray-700">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
