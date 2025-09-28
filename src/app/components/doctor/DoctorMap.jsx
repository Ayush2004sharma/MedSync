'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// fix missing default icon issue in SSR
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const defaultCenter = [28.61, 77.20]; // Delhi [lat, lng]

export default function DoctorMap({ doctors = [], center = defaultCenter, onSelect }) {
  return (
   <MapContainer
  center={center}
  zoom={12}
  scrollWheelZoom={true}
  style={{ height: '400px', width: '100%' }}
>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

  {/* 👨‍⚕️ Doctor markers */}
  {doctors.map((doc) => {
    const [lng, lat] = doc?.location?.coordinates || [];
    if (!lat || !lng) return null;

    return (
      <Marker
        key={doc._id}
        position={[lat, lng]}
        eventHandlers={{
          click: () => onSelect && onSelect(doc),
        }}
      >
        <Popup>
          <strong>{doc.name}</strong><br />
          {doc.speciality || 'Specialist'}
        </Popup>
      </Marker>
    );
  })}

  {/* 📍 User location marker */}
  {center && (
    <Marker position={center}>
      <Popup>You are here</Popup>
    </Marker>
  )}
</MapContainer>

  );
}
