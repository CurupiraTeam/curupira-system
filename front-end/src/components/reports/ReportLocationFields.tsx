import { useEffect } from 'react';
import { LocateFixed } from 'lucide-react';
import clsx from 'clsx';
import { useGeolocation } from '../../hooks/useGeolocation';
import { Button, FieldWrapper, TextInput } from '../ui/FormControls';

interface ReportLocationFieldsProps {
  latitude: string;
  longitude: string;
  latitudeError?: string;
  longitudeError?: string;
  light?: boolean;
  onLatitudeChange: (value: string) => void;
  onLongitudeChange: (value: string) => void;
}

export function ReportLocationFields({
  latitude,
  longitude,
  latitudeError,
  longitudeError,
  light,
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
      <Button
        type="button"
        onClick={handleUseLocation}
        light={light}
        className={light ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200' : 'bg-white/10 text-white hover:bg-white/20'}
      >
        <LocateFixed size={18} aria-hidden="true" /> Usar localização automática
      </Button>
      {geolocation.message && <p className={clsx('text-sm font-semibold', light ? 'text-slate-500' : 'text-slate-300')}>{geolocation.message}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <FieldWrapper label="Latitude" error={latitudeError} light={light}>
          <TextInput inputMode="decimal" value={latitude} onChange={(event) => onLatitudeChange(event.target.value)} placeholder="-3.1019" light={light} />
        </FieldWrapper>
        <FieldWrapper label="Longitude" error={longitudeError} light={light}>
          <TextInput inputMode="decimal" value={longitude} onChange={(event) => onLongitudeChange(event.target.value)} placeholder="-60.025" light={light} />
        </FieldWrapper>
      </div>
    </div>
  );
}
