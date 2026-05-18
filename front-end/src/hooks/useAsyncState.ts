import { useCallback, useEffect, useRef, useState } from 'react';
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

  // Use refs to store the latest versions of the callbacks so that refetch doesn't recreate on every render
  const loaderRef = useRef(loader);
  const fallbackRef = useRef(fallback);
  const isEmptyRef = useRef(isEmpty);

  // Sync refs on every render
  useEffect(() => {
    loaderRef.current = loader;
    fallbackRef.current = fallback;
    isEmptyRef.current = isEmpty;
  });

  const refetch = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: undefined }));
    try {
      const data = await loaderRef.current();
      setState({
        data,
        isLoading: false,
        isEmpty: isEmptyRef.current(data),
        isUnauthorized: false,
        isSuccess: true
      });
      return data;
    } catch (error) {
      const normalized = normalizeUnknownError(error);
      const fallbackData = fallbackRef.current?.();
      setState({
        data: fallbackData,
        isLoading: false,
        error: normalized,
        isEmpty: fallbackData ? isEmptyRef.current(fallbackData) : false,
        isUnauthorized: normalized.isUnauthorized,
        isSuccess: Boolean(fallbackData)
      });
      return fallbackData;
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      void refetch();
    }
  }, [immediate, refetch]);

  return { ...state, refetch };
}

function defaultIsEmpty<T>(data: T) {
  return Array.isArray(data) ? data.length === 0 : !data;
}
