'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DoctorMiniCard({ doctor }) {
  const router = useRouter();

  if (!doctor) return null;

  const { _id, name, image, consultationFee, rating } = doctor;

  const handleClick = () => {
    router.push(`/pages/doctors/${_id}`);
  };

  return (
    <div
  onClick={handleClick}
  className="bg-[#e0f2ff] rounded-xl shadow-sm p-4 flex items-center gap-4 w-full hover:shadow-md transition duration-300 cursor-pointer"
>
  <img
    src={image || '/default-doctor.png'}
    alt={name}
    className="w-20 h-20 object-cover rounded-lg border border-blue-300"
  />
  <div className="flex flex-col justify-center">
    <h3 className="text-lg font-semibold text-[#1e3a8a]">
      {name}
    </h3>
    <p className="text-sm text-blue-700">
      ₹{consultationFee || '500'} fee
    </p>
    <div className="flex items-center gap-1 text-yellow-500">
      <Star className="w-4 h-4 fill-yellow-500" />
      <span className="text-sm text-blue-800">{rating || '4.5'}</span>
    </div>
  </div>
</div>


  );
}
