import type { HistoricalStats } from '../types';
import { historicalData } from '../data/mockData';
import { apiRequest } from './api/httpClient';
import { API_ROUTES } from './api/endpoints';

export const StatisticsService = {
  async getHistory() {
    const response = await apiRequest<unknown>(API_ROUTES.statisticsHistory);
    return normalizeHistoricalStats(response);
  },

  fallbackHistory(): HistoricalStats[] {
    return historicalData.map((point) => ({
      date: point.date,
      aqi: point.iqa,
      userReportsCount: point.reports,
      officialAlertsCount: point.officialAlerts
    }));
  }
};

function normalizeHistoricalStats(response: unknown): HistoricalStats[] {
  const rawItems = Array.isArray(response)
    ? response
    : response && typeof response === 'object' && 'data' in response && Array.isArray((response as { data: unknown }).data)
      ? (response as { data: unknown[] }).data
      : [];

  return rawItems.map((item) => {
    const raw = item as Record<string, unknown>;
    return {
      date: String(raw.date ?? raw.data ?? raw.dia ?? ''),
      aqi: Number(raw.aqi ?? raw.iqa),
      userReportsCount: Number(raw.userReportsCount ?? raw.reports ?? raw.relatos ?? 0),
      officialAlertsCount: Number(raw.officialAlertsCount ?? raw.officialAlerts ?? raw.alertas ?? 0)
    };
  });
}
