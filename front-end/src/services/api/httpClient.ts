import type { ApiRequestOptions } from '../../types';
import { getStoredToken } from '../../utils/tokenStorage';
import { normalizeApiError, normalizeUnknownError } from '../../utils/normalizeApiError';
import { getApiBaseUrl } from './endpoints';

function buildUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { skipAuth, headers, body, timeoutMs = 4500, signal, ...requestOptions } = options;
  const token = getStoredToken();
  const finalHeaders = new Headers(headers);
  const controller = !signal && timeoutMs > 0 ? new AbortController() : undefined;
  const timeout = controller ? window.setTimeout(() => controller.abort(), timeoutMs) : undefined;

  if (!skipAuth && token) {
    finalHeaders.set('Authorization', `Bearer ${token}`);
  }

  if (body && !(body instanceof FormData) && !finalHeaders.has('Content-Type')) {
    finalHeaders.set('Content-Type', 'application/json');
  }

  const url = buildUrl(path);
  console.log(`[HTTP] ${requestOptions.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, {
      ...requestOptions,
      body,
      headers: finalHeaders,
      signal: signal || controller?.signal
    });

    console.log(`[HTTP] Response ${response.status} ${response.statusText}`);

    if (!response.ok) {
      console.error(`[HTTP] Request failed with status ${response.status}`);
      throw await normalizeApiError(response);
    }

    if (response.status === 204) return undefined as T;

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html') || contentType.includes('text/plain')) {
      return (await response.text()) as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error('[HTTP] Error:', error);
    throw normalizeUnknownError(error);
  } finally {
    if (timeout) window.clearTimeout(timeout);
  }
}
