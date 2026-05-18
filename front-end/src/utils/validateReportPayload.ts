import type { CreateUserReportPayload } from '../types';

export interface ReportValidationResult {
  isValid: boolean;
  fieldErrors: Record<string, string>;
}

export function validateReportPayload(payload: Partial<CreateUserReportPayload>): ReportValidationResult {
  const fieldErrors: Record<string, string> = {};

  if (!payload.usuario_id) fieldErrors.usuario_id = 'Entre novamente para enviar um relato.';
  if (!payload.categoria_id) fieldErrors.categoria_id = 'Selecione o tipo da ocorrência.';
  if (!isValidLatitude(payload.latitude)) fieldErrors.latitude = 'Informe uma latitude válida.';
  if (!isValidLongitude(payload.longitude)) fieldErrors.longitude = 'Informe uma longitude válida.';
  if (payload.descricao && payload.descricao.length > 500) {
    fieldErrors.descricao = 'Use no máximo 500 caracteres.';
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors
  };
}

export function isValidLatitude(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value >= -90 && value <= 90;
}

export function isValidLongitude(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value >= -180 && value <= 180;
}
