import type { SensorMetrics } from '../types';
import { airMetrics } from '../data/mockData';
import { getStatusByIqa } from '../utils/status';
import { apiRequest } from './api/httpClient';
import { API_ROUTES } from './api/endpoints';

export const SensorsService = {
  async getMetrics() {
    const response = await apiRequest<unknown>(API_ROUTES.sensors.metrics);
    return normalizeSensorMetrics(response);
  },

  fallbackMetrics(): SensorMetrics {
    const pm25 = airMetrics[0]?.value ?? 0;
    const aqiValue = 78;
    return {
      pm25,
      aqiValue,
      aqiStatus: getStatusByIqa(aqiValue),
      updatedAt: new Date().toISOString(),
      additionalMetrics: airMetrics
    };
  }
};

function normalizeSensorMetrics(response: unknown): SensorMetrics {
  const raw = response && typeof response === 'object' && 'data' in response ? (response as { data: unknown }).data : response;
  const item = (raw || {}) as Record<string, unknown>;
  const pm25 = Number(item.pm25 ?? item['pm2.5'] ?? item.PM25);
  const aqiValue = Number(item.aqiValue ?? item.aqi ?? item.iqa ?? pm25);
  return {
    pm25: Number.isFinite(pm25) ? pm25 : undefined,
    aqiValue: Number.isFinite(aqiValue) ? aqiValue : undefined,
    aqiStatus: typeof item.aqiStatus === 'string' ? item.aqiStatus as SensorMetrics['aqiStatus'] : getStatusByIqa(aqiValue),
    updatedAt: item.updatedAt as string | undefined ?? item.timestamp as string | undefined,
    additionalMetrics: Array.isArray(item.additionalMetrics) ? item.additionalMetrics as SensorMetrics['additionalMetrics'] : undefined
  };
}
