import { ReactNode } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapShellProps {
  children: ReactNode;
}

export function MapShell({ children }: MapShellProps) {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-slate-200 bg-emerald-950 shadow-xl md:min-h-[520px]">
      <MapContainer center={[-3.1019, -60.025]} zoom={10} scrollWheelZoom className="h-[420px] w-full md:h-[520px]">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    </div>
  );
}
