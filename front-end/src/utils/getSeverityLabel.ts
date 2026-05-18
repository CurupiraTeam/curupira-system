import type { AQIStatus } from '../types';
import { statusLabels } from '../constants/statusLabels';

export function getSeverityLabel(status?: AQIStatus | string) {
  if (status === 'Bom' || status === 'Moderado' || status === 'Ruim' || status === 'Crítico') {
    return statusLabels[status];
  }

  return {
    label: 'Sem status',
    description: 'Status ambiental não informado.',
    tone: 'slate'
  };
}
