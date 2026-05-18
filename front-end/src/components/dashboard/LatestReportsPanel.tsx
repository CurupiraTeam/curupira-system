import type { Report } from '../../types';
import { EmptyState } from '../ui/StateView';
import { ReportCard } from '../reports/ReportCard';

export function LatestReportsPanel({ reports }: { reports: Report[] }) {
  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Últimos relatos</p>
      <h2 className="mt-1 text-xl font-black text-slate-950">Movimentação próxima</h2>
      <div className="mt-4 grid gap-3">
        {reports.length ? (
          reports.slice(0, 3).map((report) => <ReportCard key={report.id} report={report} />)
        ) : (
          <EmptyState compact title="Nenhum relato recente" description="Quando novos relatos chegarem, eles aparecerão aqui." />
        )}
      </div>
    </div>
  );
}
