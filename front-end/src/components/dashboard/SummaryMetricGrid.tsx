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
        <div key={label} className="rounded-3xl bg-white/90 border border-emerald-100/60 p-3 shadow-md shadow-slate-200/20 transition-all hover:scale-[1.03] duration-300 sm:p-4">
          <Icon className="mb-2 text-emerald-600 sm:mb-3" size={22} aria-hidden="true" />
          <strong className="text-xl font-black text-slate-900 sm:text-2xl">{value}</strong>
          <p className="mt-1 text-[11px] font-semibold leading-tight text-slate-500 sm:text-xs">{label}</p>
        </div>
      ))}
    </div>
  );
}
