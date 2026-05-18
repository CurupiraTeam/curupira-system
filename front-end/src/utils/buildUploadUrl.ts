import { getApiBaseUrl } from '../services/api/endpoints';

export function buildUploadUrl(path?: string | null) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/uploads/${path}`;
  return `${getApiBaseUrl()}${normalized}`;
}
