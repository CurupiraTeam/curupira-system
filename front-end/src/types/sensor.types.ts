import type { AQIStatus } from './report.types';

export interface AirMetric {
  label: string;
  value: number;
  unit: string;
  safeLimit: number;
}

export interface SensorMetrics {
  pm25?: number;
  aqiValue?: number;
  aqiStatus?: AQIStatus;
  updatedAt?: string;
  additionalMetrics?: Array<{
    label: string;
    value: number | string;
    unit?: string;
    safeLimit?: number;
  }>;
}
