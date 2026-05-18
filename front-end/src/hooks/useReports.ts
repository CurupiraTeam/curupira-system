import { useCallback, useEffect, useMemo } from 'react';
import { ReportsService, type ReportFilters } from '../services/reports.service';
import { useAsyncState } from './useAsyncState';
import { WebSocketService } from '../services/websocket.service';

export function useReports(filters: ReportFilters = {}) {
  const filterKey = JSON.stringify(filters);
  const stableFilters = useMemo(() => filters, [filterKey]);
  const loader = useCallback(() => ReportsService.listReports(stableFilters), [stableFilters]);
  const fallback = useCallback(() => ReportsService.fallbackReports(), []);
  
  const asyncState = useAsyncState(loader, {
    fallback,
    isEmpty: (data) => data.length === 0
  });

  // Listen to WebSocket events to automatically refetch when reports are created/updated/resolved
  useEffect(() => {
    const unsubscribe = WebSocketService.onRelatosChange(() => {
      void asyncState.refetch();
    });
    return () => {
      unsubscribe();
    };
  }, [asyncState.refetch]);

  return asyncState;
}
