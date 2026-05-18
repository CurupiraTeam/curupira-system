import { useCallback } from 'react';
import { CategoriesService } from '../services/categories.service';
import { useAsyncState } from './useAsyncState';

export function useCategories() {
  const loader = useCallback(() => CategoriesService.listCategories(), []);
  const fallback = useCallback(() => CategoriesService.fallbackCategories(), []);
  return useAsyncState(loader, {
    fallback,
    isEmpty: (data) => data.length === 0
  });
}
