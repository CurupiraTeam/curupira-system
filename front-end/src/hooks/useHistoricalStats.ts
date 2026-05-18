import { useCallback } from 'react';
import { StatisticsService } from '../services/statistics.service';
import { useAsyncState } from './useAsyncState';

export function useHistoricalStats() {
  const loader = useCallback(() => StatisticsService.getHistory(), []);
  const fallback = useCallback(() => StatisticsService.fallbackHistory(), []);
  return useAsyncState(loader, {
    fallback,
    isEmpty: (data) => data.length === 0
  });
}
