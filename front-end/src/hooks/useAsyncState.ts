import { useCallback, useEffect, useState } from 'react';
import type { APIState } from '../types';
import { normalizeUnknownError } from '../utils/normalizeApiError';

interface UseAsyncStateOptions<T> {
  fallback?: () => T;
  isEmpty?: (data: T) => boolean;
  immediate?: boolean;
}

export function useAsyncState<T>(loader: () => Promise<T>, options: UseAsyncStateOptions<T> = {}) {
  const { fallback, immediate = true, isEmpty = defaultIsEmpty } = options;
  const [state, setState] = useState<APIState<T>>({
    isLoading: immediate,
    isEmpty: false,
    isUnauthorized: false,
    isSuccess: false
  });

  const refetch = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: undefined }));
    try {
      const data = await loader();
      setState({
        data,
        isLoading: false,
        isEmpty: isEmpty(data),
        isUnauthorized: false,
        isSuccess: true
      });
      return data;
    } catch (error) {
      const normalized = normalizeUnknownError(error);
      const fallbackData = fallback?.();
      setState({
        data: fallbackData,
        isLoading: false,
        error: normalized,
        isEmpty: fallbackData ? isEmpty(fallbackData) : false,
        isUnauthorized: normalized.isUnauthorized,
        isSuccess: Boolean(fallbackData)
      });
      return fallbackData;
    }
  }, [fallback, isEmpty, loader]);

  useEffect(() => {
    if (immediate) {
      void refetch();
    }
  }, []);

  return { ...state, refetch };
}

function defaultIsEmpty<T>(data: T) {
  return Array.isArray(data) ? data.length === 0 : !data;
}
