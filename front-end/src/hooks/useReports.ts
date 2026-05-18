import { useCallback, useMemo } from 'react';
import { ReportsService, type ReportFilters } from '../services/reports.service';
import { useAsyncState } from './useAsyncState';

export function useReports(filters: ReportFilters = {}) {
  const filterKey = JSON.stringify(filters);
  const stableFilters = useMemo(() => filters, [filterKey]);
  const loader = useCallback(() => ReportsService.listReports(stableFilters), [stableFilters]);
  const fallback = useCallback(() => ReportsService.fallbackReports(), []);
  return useAsyncState(loader, {
    fallback,
    isEmpty: (data) => data.length === 0
  });
}
