import type { HistoricalStats } from '../../types';
import { getStatusByIqa } from '../../utils/status';

export function HistorySummaryCards({ stats }: { stats: HistoricalStats[] }) {
  const reports = stats.reduce((sum, item) => sum + item.userReportsCount, 0);
  const alerts = stats.reduce((sum, item) => sum + item.officialAlertsCount, 0);
  const averageAqi = stats.length ? Math.round(stats.reduce((sum, item) => sum + (item.aqi || 0), 0) / stats.length) : 0;

  const cards = [
    ['Relatos no período', reports || '0', 'Volume de registros enviados por usuários.'],
    ['Alertas oficiais', alerts || '0', 'Total acumulado de alertas no período.'],
    ['IQA médio', averageAqi || 'Sem dados', averageAqi ? `Classificação ${getStatusByIqa(averageAqi)}.` : 'Aguardando dados suficientes.']
  ];

  return (
    <div className="grid gap-4">
      {cards.map(([label, value, text]) => (
        <article key={label} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">{label}</p>
          <strong className="mt-3 block text-4xl font-black text-slate-950">{value}</strong>
          <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
        </article>
      ))}
    </div>
  );
}
