'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DoctorCard from '@/app/components/doctor/DoctorCard';
import DoctorSearchBar from '@/app/components/SearchBar';
import api from '@/app/utils/api';

// Component that uses useSearchParams
function DoctorListContent() {
  const searchParams = useSearchParams();
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState({
    specialty: '',
    city: '',
  });

  // Load query parameters from URL on mount
  useEffect(() => {
    const specialty = searchParams.get('specialty') || '';
    const city = searchParams.get('city') || '';
    setQuery({ specialty, city });
  }, [searchParams]);

  // Fetch all doctors on mount
  useEffect(() => {
    fetchAllDoctors();
  }, []);

  // Filter doctors whenever query changes
  useEffect(() => {
    filterDoctors();
  }, [query, allDoctors]);

  // Fetch all doctors from backend
  const fetchAllDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/doctors/all');
      setAllDoctors(res.data || []);
      setFilteredDoctors(res.data || []);
    } catch (err) {
      console.error('❌ Failed to fetch doctors', err);
      setError('Failed to load doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Better filter function with fuzzy matching
  const filterDoctors = () => {
    let filtered = [...allDoctors];

    // Filter by specialty (exact match, case-insensitive)
    if (query.specialty && query.specialty.trim() !== '') {
      const specialtyLower = query.specialty.toLowerCase().trim();
      filtered = filtered.filter(doc => {
        const docSpecialty = (doc.specialty || '').toLowerCase().trim();
        return docSpecialty === specialtyLower;
      });
    }

    // Filter by name or city (fuzzy search)
    if (query.city && query.city.trim() !== '') {
      const searchTerm = query.city.toLowerCase().trim();
      filtered = filtered.filter(doc => {
        const name = (doc.name || '').toLowerCase();
        const address = (doc.clinicAddress || '').toLowerCase();
        
        const nameMatch = name.includes(searchTerm);
        const addressMatch = address.includes(searchTerm);
        
        return nameMatch || addressMatch;
      });
    }

    setFilteredDoctors(filtered);
  };

  // Handle search button click
  const handleSearch = () => {
    filterDoctors();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Search Bar */}
      <DoctorSearchBar 
        query={query} 
        setQuery={setQuery} 
        onSearch={handleSearch}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading doctors...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20 bg-red-50 rounded-xl border border-red-200 p-8">
            <p className="text-red-600 text-lg mb-6">{error}</p>
            <button
              onClick={fetchAllDoctors}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Active Filters Display */}
        {!loading && !error && (query.specialty || query.city) && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {query.specialty && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {query.specialty}
                <button
                  onClick={() => setQuery(q => ({ ...q, specialty: '' }))}
                  className="hover:text-blue-900"
                >
                  ✕
                </button>
              </span>
            )}
            {query.city && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {query.city}
                <button
                  onClick={() => setQuery(q => ({ ...q, city: '' }))}
                  className="hover:text-blue-900"
                >
                  ✕
                </button>
              </span>
            )}
            <button
              onClick={() => setQuery({ specialty: '', city: '' })}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && filteredDoctors.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Available Doctors
              </h2>
              <p className="text-gray-600">
                Found <span className="font-semibold text-blue-600">{filteredDoctors.length}</span> doctor{filteredDoctors.length !== 1 ? 's' : ''}
                {allDoctors.length !== filteredDoctors.length && (
                  <span className="text-gray-500"> (out of {allDoctors.length} total)</span>
                )}
              </p>
            </div>

            {/* Doctor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doc) => (
                <DoctorCard 
                  key={doc._id} 
                  doctor={doc} 
                  showDistance={false}
                />
              ))}
            </div>
          </>
        )}

        {/* No Results */}
        {!loading && !error && filteredDoctors.length === 0 && allDoctors.length > 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200 p-8">
            <p className="text-gray-600 text-xl mb-2">😔 No doctors found</p>
            <p className="text-gray-500 text-sm mb-6">
              Try adjusting your search filters
            </p>
            <button
              onClick={() => {
                setQuery({ specialty: '', city: '' });
              }}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg transition shadow-md"
            >
              Clear Filters & View All
            </button>
          </div>
        )}

        {/* No Doctors at All */}
        {!loading && !error && allDoctors.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200 p-8">
            <p className="text-gray-600 text-xl mb-6">😔 No doctors available</p>
            <button
              onClick={fetchAllDoctors}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg transition shadow-md"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Main export with Suspense wrapper
export default function DoctorListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    }>
      <DoctorListContent />
    </Suspense>
  );
}
