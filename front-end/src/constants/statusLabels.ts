import type { AQIStatus, ReportStatus } from '../types';

export const statusLabels: Record<AQIStatus, { label: string; description: string; tone: string }> = {
  Bom: {
    label: 'Bom',
    description: 'Condição favorável para atividades comuns.',
    tone: 'emerald'
  },
  Moderado: {
    label: 'Moderado',
    description: 'Atenção para pessoas sensíveis.',
    tone: 'amber'
  },
  Ruim: {
    label: 'Ruim',
    description: 'Evite exposição prolongada ao ar livre.',
    tone: 'orange'
  },
  Crítico: {
    label: 'Crítico',
    description: 'Risco elevado; reduza exposição e acompanhe alertas.',
    tone: 'red'
  }
};

export const unknownStatusLabel: ReportStatus = 'Desconhecido';
