export type AQIStatus = 'Bom' | 'Moderado' | 'Ruim' | 'Crítico';

export type ReportStatus = AQIStatus | 'Desconhecido';

export type ReportSource = 'Usuário' | 'INPE' | 'Estação oficial' | 'Sensor' | 'Simulado' | 'Outro';

export type IncidentType = 'Fumaça' | 'Queimada' | 'Cheiro forte' | 'Dificuldade respiratória' | 'Poeira' | 'Odor químico' | 'Outro';

export interface Report {
  id: string | number;
  type: 'user' | 'official' | 'sensor' | 'unknown';
  categoryId?: string | number;
  categoryName: string;
  title?: string;
  description?: string;
  latitude: number;
  longitude: number;
  approximateLocation?: string;
  region?: string;
  city?: string;
  neighborhood?: string;
  intensity?: number;
  status?: AQIStatus | ReportStatus;
  source: ReportSource;
  mediaUrl?: string;
  createdAt: string;
  updatedAt?: string;
  canCluster?: boolean;
}

export interface CreateUserReportPayload {
  usuario_id: string | number;
  categoria_id: string | number;
  descricao?: string;
  latitude: number;
  longitude: number;
  foto?: File;
}

export interface EnvironmentalSummary {
  region: string;
  subRegion?: string;
  updatedAt?: string;
  aqiValue?: number;
  aqiStatus?: AQIStatus;
  nearbySensorsCount?: number;
  officialAlertsCount?: number;
  regionalReportsCount?: number;
  alertMessage?: string;
  isPartial?: boolean;
}

export interface MapMarker {
  id: string | number;
  reportId: string | number;
  position: { lat: number; lng: number };
  categoryName: string;
  status?: AQIStatus | ReportStatus;
  source: ReportSource;
  label: string;
  description?: string;
  createdAt: string;
  mediaUrl?: string;
  clusterKey?: string;
}

export interface IncidentReport {
  id: string;
  city: string;
  neighborhood: string;
  type: IncidentType;
  status: AQIStatus;
  source: 'Usuário' | 'INPE' | 'Estação oficial';
  intensity: number;
  createdAt: string;
  description: string;
  lat: number;
  lng: number;
}
