export type { AuthResponse, AuthState, LoginPayload, RegisterPayload, User } from './auth.service';
export type { APIState, ApiListResponse, ApiRequestOptions, NormalizedApiError } from './api.types';
export type { Category } from './category.type';
export type {
  AQIStatus,
  CreateUserReportPayload,
  EnvironmentalSummary,
  IncidentReport,
  IncidentType,
  MapMarker,
  Report,
  ReportSource,
  ReportStatus
} from './report.types';
export type { AirMetric, SensorMetrics } from './sensor.types';
export type { HistoricalPoint, HistoricalStats } from './statistics.types';
export type { ArduinoDataEvent, RealtimeConnectionState } from './websocket.types';

export type AirStatus = import('./report.types').AQIStatus;
