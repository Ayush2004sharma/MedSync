'use client';

import { assets } from '../assets/assets_frontend/assets';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthContext } from '../context/AuthContext';


export default function Banner() {
// or whatever your context exposes (isLoggedIn, token, etc.)
const {isLoggedIn} = useAuthContext(); 
  return (
    <div className="w-full px-4 sm:px-6 ">
      <div className="bg-blue-600 rounded-2xl max-w-6xl mx-auto flex flex-col md:flex-row items-stretch justify-between p-6 md:p-10 text-white overflow-hidden shadow-lg min-h-[320px]">
        
        {/* Text Section (60%) */}
        <div className="w-full md:w-[60%] flex flex-col justify-center">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Book Appointment <br />
            With 100+ Trusted Doctors
          </h2>
          <Link href={isLoggedIn ? "/pages/doctors" : "/pages/register"}>
            <button className="bg-white text-blue-600 font-medium px-6 py-3 mt-4 rounded-full text-base sm:text-lg hover:bg-blue-100 transition">
              {isLoggedIn ? "Explore Now" : "Create Account"}
            </button>
          </Link>
        </div>

        {/* Image Section (40%) */}
        <div className="w-full md:w-[40%] flex justify-center items-end">
          <div className="w-52 h-auto self-end">
            <Image
              src={assets.appointment_img}
              alt="Doctor"
              width={300}
              height={300}
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
