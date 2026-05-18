import type { AirStatus } from '../types';
import { statusStyles } from '../utils/status';

interface StatusBadgeProps {
  status: AirStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
