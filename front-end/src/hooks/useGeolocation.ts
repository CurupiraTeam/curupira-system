import { useCallback, useState } from 'react';

export type GeolocationStatus = 'idle' | 'loading' | 'success' | 'denied' | 'unavailable' | 'error';

export interface GeolocationState {
  status: GeolocationStatus;
  latitude?: number;
  longitude?: number;
  message?: string;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({ status: 'idle' });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ status: 'unavailable', message: 'Localização automática indisponível neste navegador.' });
      return;
    }

    setState({ status: 'loading' });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          status: 'success',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          message: 'Localização automática detectada.'
        });
      },
      (error) => {
        setState({
          status: error.code === error.PERMISSION_DENIED ? 'denied' : 'error',
          message: error.code === error.PERMISSION_DENIED ? 'Permissão de localização negada.' : 'Não foi possível obter sua localização.'
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { ...state, requestLocation, setManualLocation: setState };
}
