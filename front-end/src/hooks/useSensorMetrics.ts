import { useCallback } from 'react';
import { SensorsService } from '../services/sensors.service';
import { useAsyncState } from './useAsyncState';

export function useSensorMetrics() {
  const loader = useCallback(() => SensorsService.getMetrics(), []);
  const fallback = useCallback(() => SensorsService.fallbackMetrics(), []);
  return useAsyncState(loader, {
    fallback,
    isEmpty: (data) => !data.pm25 && !data.aqiValue
  });
}
