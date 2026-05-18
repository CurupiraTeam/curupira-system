import type { CreateUserReportPayload, IncidentReport, Report } from '../types';
import { incidents } from '../data/mockData';
import { buildUploadUrl } from '../utils/buildUploadUrl';
import { getStatusByIqa } from '../utils/status';
import { apiRequest } from './api/httpClient';
import { API_ROUTES } from './api/endpoints';

export interface ReportFilters {
  latMin?: number;
  latMax?: number;
  lngMin?: number;
  lngMax?: number;
}

export const ReportsService = {
  async listReports(filters: ReportFilters = {}) {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === 'number') query.set(key, String(value));
    });
    const suffix = query.toString() ? `?${query.toString()}` : '';
    const response = await apiRequest<unknown>(`${API_ROUTES.reports.list}${suffix}`);
    return normalizeReportList(response);
  },

  async createUserReport(payload: CreateUserReportPayload) {
    const form = new FormData();
    form.set('usuario_id', String(payload.usuario_id));
    form.set('categoria_id', String(payload.categoria_id));
    form.set('latitude', String(payload.latitude));
    form.set('longitude', String(payload.longitude));
    if (payload.descricao) form.set('descricao', payload.descricao);
    if (payload.foto) form.set('foto', payload.foto);

    return apiRequest<unknown>(API_ROUTES.reports.user, {
      method: 'POST',
      body: form
    });
  },

  fallbackReports() {
    return incidents.map(mapIncidentToReport);
  }
};


function normalizeReportList(response: unknown): Report[] {
  const rawItems = Array.isArray(response)
    ? response
    : response && typeof response === 'object' && 'data' in response && Array.isArray((response as { data: unknown }).data)
      ? ((response as { data: unknown[] }).data)
      : response && typeof response === 'object' && 'items' in response && Array.isArray((response as { items: unknown }).items)
        ? ((response as { items: unknown[] }).items)
        : [];

  return rawItems.map(normalizeReport).filter(Boolean) as Report[];
}

function normalizeReport(raw: unknown): Report | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const latitude = Number(item.latitude ?? item.lat);
  const longitude = Number(item.longitude ?? item.lng);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const intensity = typeof item.intensity === 'number' ? item.intensity : Number(item.intensidade ?? item.intensity);
  const category = item.categoria && typeof item.categoria === 'object' ? (item.categoria as Record<string, unknown>) : undefined;
  const categoryName = String(item.categoryName ?? item.categoria_nome ?? category?.nome ?? item.type ?? 'Outro');

  return {
    id: String(item.id ?? `${latitude},${longitude},${item.createdAt ?? item.criadoEm ?? Date.now()}`),
    type: String(item.type ?? item.tipo ?? 'unknown') as Report['type'],
    categoryId: item.categoryId as string | number | undefined ?? item.categoria_id as string | number | undefined,
    categoryName,
    title: item.title as string | undefined ?? item.titulo as string | undefined,
    description: String(item.description ?? item.descricao ?? ''),
    latitude,
    longitude,
    approximateLocation: item.approximateLocation as string | undefined ?? item.local_aproximado as string | undefined,
    region: item.region as string | undefined ?? item.regiao as string | undefined,
    city: item.city as string | undefined ?? item.cidade as string | undefined,
    neighborhood: item.neighborhood as string | undefined ?? item.bairro as string | undefined,
    intensity: Number.isFinite(intensity) ? intensity : undefined,
    status: item.status as Report['status'] ?? (Number.isFinite(intensity) ? getStatusByIqa(intensity) : undefined),
    source: String(item.source ?? item.origem ?? 'Outro') as Report['source'],
    mediaUrl: buildUploadUrl(item.mediaUrl as string | undefined ?? item.foto_url as string | undefined),
    createdAt: String(item.createdAt ?? item.criadoEm ?? item.created_at ?? new Date().toISOString()),
    updatedAt: item.updatedAt as string | undefined ?? item.atualizadoEm as string | undefined,
    canCluster: true
  };
}

function mapIncidentToReport(incident: IncidentReport): Report {
  return {
    id: incident.id,
    type: incident.source === 'Usuário' ? 'user' : 'official',
    categoryName: incident.type,
    description: incident.description,
    latitude: incident.lat,
    longitude: incident.lng,
    approximateLocation: `${incident.neighborhood}, ${incident.city}`,
    region: incident.city,
    city: incident.city,
    neighborhood: incident.neighborhood,
    intensity: incident.intensity,
    status: incident.status,
    source: incident.source,
    createdAt: incident.createdAt,
    canCluster: true
  };
}
