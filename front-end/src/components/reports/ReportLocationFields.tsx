import { useEffect } from 'react';
import { LocateFixed } from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { Button, FieldWrapper, TextInput } from '../ui/FormControls';

interface ReportLocationFieldsProps {
  latitude: string;
  longitude: string;
  latitudeError?: string;
  longitudeError?: string;
  onLatitudeChange: (value: string) => void;
  onLongitudeChange: (value: string) => void;
}

export function ReportLocationFields({
  latitude,
  longitude,
  latitudeError,
  longitudeError,
  onLatitudeChange,
  onLongitudeChange
}: ReportLocationFieldsProps) {
  const geolocation = useGeolocation();

  function handleUseLocation() {
    geolocation.requestLocation();
  }

  useEffect(() => {
    if (geolocation.status !== 'success' || typeof geolocation.latitude !== 'number' || typeof geolocation.longitude !== 'number') return;
    const nextLatitude = String(geolocation.latitude);
    const nextLongitude = String(geolocation.longitude);
    if (latitude !== nextLatitude) onLatitudeChange(nextLatitude);
    if (longitude !== nextLongitude) onLongitudeChange(nextLongitude);
  }, [geolocation.latitude, geolocation.longitude, geolocation.status, latitude, longitude, onLatitudeChange, onLongitudeChange]);

  return (
    <div className="grid gap-3">
      <Button type="button" onClick={handleUseLocation} className="bg-white/10 text-white hover:bg-white/20">
        <LocateFixed size={18} aria-hidden="true" /> Usar localização automática
      </Button>
      {geolocation.message && <p className="text-sm font-semibold text-slate-300">{geolocation.message}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <FieldWrapper label="Latitude" error={latitudeError}>
          <TextInput inputMode="decimal" value={latitude} onChange={(event) => onLatitudeChange(event.target.value)} placeholder="-3.1019" />
        </FieldWrapper>
        <FieldWrapper label="Longitude" error={longitudeError}>
          <TextInput inputMode="decimal" value={longitude} onChange={(event) => onLongitudeChange(event.target.value)} placeholder="-60.025" />
        </FieldWrapper>
      </div>
    </div>
  );
}
