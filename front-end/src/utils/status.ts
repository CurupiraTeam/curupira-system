import type { AirStatus } from '../types';

export const statusStyles: Record<AirStatus, string> = {
  Bom: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  Moderado: 'bg-amber-100 text-amber-700 ring-amber-200',
  Ruim: 'bg-orange-100 text-orange-700 ring-orange-200',
  Crítico: 'bg-red-100 text-red-700 ring-red-200'
};

export const statusGradient: Record<AirStatus, string> = {
  Bom: 'from-emerald-500 to-teal-500',
  Moderado: 'from-amber-400 to-orange-400',
  Ruim: 'from-orange-500 to-red-500',
  Crítico: 'from-red-600 to-rose-700'
};

export const getStatusByIqa = (iqa: number): AirStatus => {
  if (iqa < 45) return 'Bom';
  if (iqa < 65) return 'Moderado';
  if (iqa < 85) return 'Ruim';
  return 'Crítico';
};
