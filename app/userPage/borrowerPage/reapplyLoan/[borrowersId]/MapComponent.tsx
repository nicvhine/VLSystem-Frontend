"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
// Do NOT import 'leaflet' at module top-level (it accesses window during import and breaks SSR).
// We'll dynamically import it on the client inside useEffect.

const DEFAULT_POSITION: [number, number] = [10.3157, 123.8854];

// We'll create the customIcon on the client after dynamically importing leaflet.

interface MapComponentProps {
  address: string;
  setAddress: (address: string) => void;
  markerPosition: [number, number] | null;
  setMarkerPosition: (pos: [number, number]) => void;
}

function MapEvents({
  setAddress,
  setMarkerPosition,
}: {
  setAddress: (address: string) => void;
  setMarkerPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();
        setAddress(data.display_name || `${lat}, ${lng}`);
      } catch {
        setAddress(`${lat}, ${lng}`);
      }
    },
  });
  return null;
}

export default function MapComponent({
  address,
  setAddress,
  markerPosition,
  setMarkerPosition,
}: MapComponentProps) {
  const [isClient, setIsClient] = useState(false);
  const [customIcon, setCustomIcon] = useState<any | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import leaflet and its CSS on the client only
    (async () => {
      try {
        // @ts-ignore - importing CSS dynamically; type definitions may not exist
        await import('leaflet/dist/leaflet.css');
      } catch (e) {
        // CSS import is optional; ignore failures
      }
      try {
        const Lmod = await import('leaflet');
        const L = (Lmod as any).default || Lmod;
        const icon = new L.Icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
          shadowSize: [41, 41],
        });
        setCustomIcon(icon);
      } catch (err) {
        console.error('Failed to load leaflet dynamically', err);
        setCustomIcon(null);
      }
    })();
  }, []);

  if (!isClient) return null;

  return (
    <div className="h-100 w-full rounded-lg overflow-hidden">
      <MapContainer
        center={markerPosition || DEFAULT_POSITION} 
        zoom={markerPosition ? 15 : 13} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapEvents setAddress={setAddress} setMarkerPosition={setMarkerPosition} />

        {markerPosition && customIcon && (
          <Marker position={markerPosition} icon={customIcon}>
            <Popup>{address}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}