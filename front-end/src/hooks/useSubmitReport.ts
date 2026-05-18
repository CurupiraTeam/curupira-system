import { useState } from 'react';
import type { CreateUserReportPayload, NormalizedApiError } from '../types';
import { ReportsService } from '../services/reports.service';
import { normalizeUnknownError } from '../utils/normalizeApiError';
import { validateReportPayload } from '../utils/validateReportPayload';

export type SubmitReportStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'validationError' | 'submissionError' | 'unauthorized';

export function useSubmitReport(onSuccess?: () => void | Promise<void>) {
  const [status, setStatus] = useState<SubmitReportStatus>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<NormalizedApiError | undefined>();

  async function submit(payload: Partial<CreateUserReportPayload>) {
    setStatus('validating');
    setFieldErrors({});
    setError(undefined);
    const validation = validateReportPayload(payload);
    if (!validation.isValid) {
      setFieldErrors(validation.fieldErrors);
      setStatus(validation.fieldErrors.usuario_id ? 'unauthorized' : 'validationError');
      return false;
    }

    setStatus('submitting');
    try {
      await ReportsService.createUserReport(payload as CreateUserReportPayload);
      setStatus('success');
      await onSuccess?.();
      return true;
    } catch (err) {
      const normalized = normalizeUnknownError(err);
      setError(normalized);
      setStatus(normalized.isUnauthorized ? 'unauthorized' : 'submissionError');
      return false;
    }
  }

  return {
    status,
    fieldErrors,
    error,
    submit,
    reset: () => {
      setStatus('idle');
      setFieldErrors({});
      setError(undefined);
    }
  };
}
