import type { MapMarker, Report } from '../types';

export function toMapMarker(report: Report): MapMarker | null {
  if (!Number.isFinite(report.latitude) || !Number.isFinite(report.longitude)) return null;
  return {
    id: `marker-${report.id}`,
    reportId: report.id,
    position: { lat: report.latitude, lng: report.longitude },
    categoryName: report.categoryName,
    status: report.status,
    source: report.source,
    label: report.title || report.categoryName,
    description: report.description,
    createdAt: report.createdAt,
    mediaUrl: report.mediaUrl,
    clusterKey: `${report.latitude.toFixed(3)},${report.longitude.toFixed(3)}`
  };
}
