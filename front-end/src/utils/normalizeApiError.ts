import type { NormalizedApiError } from '../types';

export async function normalizeApiError(response: Response): Promise<NormalizedApiError> {
  let body: unknown;
  try {
    body = await response.clone().json();
  } catch {
    body = undefined;
  }

  const message =
    typeof body === 'object' && body && 'message' in body
      ? Array.isArray((body as { message: unknown }).message)
        ? (body as { message: string[] }).message.join(' ')
        : String((body as { message: unknown }).message)
      : getDefaultMessage(response.status);

  return {
    status: response.status,
    message,
    isUnauthorized: response.status === 401 || response.status === 403,
    isNetworkError: false,
    fieldErrors: extractFieldErrors(body)
  };
}

export function normalizeUnknownError(error: unknown): NormalizedApiError {
  if (isNormalizedApiError(error)) return error;
  return {
    message: error instanceof Error ? error.message : 'Não foi possível concluir a solicitação.',
    isUnauthorized: false,
    isNetworkError: true
  };
}

export function isNormalizedApiError(error: unknown): error is NormalizedApiError {
  return Boolean(error && typeof error === 'object' && 'message' in error && 'isUnauthorized' in error);
}

function extractFieldErrors(body: unknown) {
  if (!body || typeof body !== 'object' || !('errors' in body)) return undefined;
  const errors = (body as { errors?: unknown }).errors;
  return errors && typeof errors === 'object' ? (errors as Record<string, string>) : undefined;
}

function getDefaultMessage(status: number) {
  if (status === 401 || status === 403) return 'Entre novamente para continuar.';
  if (status >= 500) return 'O serviço está indisponível no momento.';
  return 'Não foi possível concluir a solicitação.';
}
