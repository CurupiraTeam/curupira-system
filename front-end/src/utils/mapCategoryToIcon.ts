import { AlertTriangle, Flame, LucideIcon, SprayCan, Wind } from 'lucide-react';

export interface CategoryVisual {
  icon: LucideIcon;
  label: string;
  colorClass: string;
  markerClass: string;
}

export function mapCategoryToIcon(category?: string): CategoryVisual {
  const normalized = (category || '').toLowerCase();

  if (normalized.includes('queimada') || normalized.includes('fogo')) {
    return {
      icon: Flame,
      label: 'Queimada',
      colorClass: 'text-red-700 bg-red-50',
      markerClass: 'bg-red-600'
    };
  }

  if (normalized.includes('odor') || normalized.includes('quim')) {
    return {
      icon: SprayCan,
      label: 'Odor químico',
      colorClass: 'text-violet-700 bg-violet-50',
      markerClass: 'bg-violet-600'
    };
  }

  if (normalized.includes('fuma') || normalized.includes('poeira')) {
    return {
      icon: Wind,
      label: normalized.includes('poeira') ? 'Poeira' : 'Fumaça',
      colorClass: 'text-orange-700 bg-orange-50',
      markerClass: 'bg-orange-500'
    };
  }

  return {
    icon: AlertTriangle,
    label: 'Outro',
    colorClass: 'text-emerald-700 bg-emerald-50',
    markerClass: 'bg-emerald-600'
  };
}
