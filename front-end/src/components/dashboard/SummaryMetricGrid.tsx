import { AlertTriangle, RadioTower, UserRoundCheck } from 'lucide-react';
import type { EnvironmentalSummary } from '../../types';

export function SummaryMetricGrid({ summary }: { summary: EnvironmentalSummary }) {
  const sourceItems = [
    { label: 'Sensor próximo', value: summary.nearbySensorsCount ?? 0, icon: RadioTower },
    { label: 'Alertas oficiais', value: summary.officialAlertsCount ?? 0, icon: AlertTriangle },
    { label: 'Relatos da região', value: summary.regionalReportsCount ?? 0, icon: UserRoundCheck }
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {sourceItems.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-3xl bg-white/10 p-3 ring-1 ring-white/10 sm:p-4">
          <Icon className="mb-2 text-emerald-300 sm:mb-3" size={22} aria-hidden="true" />
          <strong className="text-xl font-black text-white sm:text-2xl">{value}</strong>
          <p className="mt-1 text-[11px] font-semibold leading-tight text-slate-300 sm:text-xs">{label}</p>
        </div>
      ))}
    </div>
  );
}
