'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix missing default icon issue in SSR
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icon for user location (simple blue circle)
const userIcon = L.divIcon({
  className: 'custom-user-icon',
  html: `<div style="
    width: 24px;
    height: 24px;
    background-color: #4285F4;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Custom icon for doctor location (blue marker)
const doctorIcon = L.divIcon({
  className: 'custom-doctor-icon',
  html: `<div style="
    width: 32px;
    height: 32px;
    background-color: #3B82F6;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 3px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  ">+</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Component to handle map centering
function MapController({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
}

export default function DoctorMap({ 
  doctors = [], 
  userLocation = null, 
  onMarkerClick 
}) {
  // Use user location if available, otherwise default to Delhi
  const mapCenter = userLocation 
    ? [userLocation.latitude, userLocation.longitude]
    : [28.61, 77.20];

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '450px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={mapCenter} />

        {/* User Location Marker */}
        {userLocation && (
          <>
            <Marker 
              position={[userLocation.latitude, userLocation.longitude]}
              icon={userIcon}
            >
              <Popup>
                <div className="text-center p-1">
                  <strong className="text-blue-600">Your Location</strong>
                </div>
              </Popup>
            </Marker>

            {/* 5km Radius Circle */}
            <Circle
              center={[userLocation.latitude, userLocation.longitude]}
              radius={5000}
              pathOptions={{
                color: '#3B82F6',
                fillColor: '#3B82F6',
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          </>
        )}

        {/* Doctor Markers */}
        {doctors.map((doc) => {
          const [lng, lat] = doc?.location?.coordinates || [];
          if (!lat || !lng) return null;

          return (
            <Marker
              key={doc._id}
              position={[lat, lng]}
              icon={doctorIcon}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(doc),
              }}
            >
              <Popup>
                <div className="min-w-[200px] p-2">
                  <h3 className="font-bold text-base text-blue-800">{doc.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{doc.specialty}</p>
                  {doc.distance !== undefined && (
                    <p className="text-xs text-blue-600 mt-2 font-semibold">
                      {doc.distance} km away
                    </p>
                  )}
                  {doc.fee && (
                    <p className="text-sm font-semibold text-green-600 mt-1">
                      Rs. {doc.fee}
                    </p>
                  )}
                  {doc.clinicAddress && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {doc.clinicAddress}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
