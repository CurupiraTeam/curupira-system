import type { Report } from '../../types';
import { EmptyState } from '../ui/StateView';
import { ReportCard } from '../reports/ReportCard';

export function LatestReportsPanel({ reports }: { reports: Report[] }) {
  return (
    <div className="rounded-[2.5rem] bg-white/80 border border-emerald-100/60 backdrop-blur-xl p-5 shadow-xl shadow-slate-200/30 sm:p-6 text-slate-900">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 border border-emerald-100">
        Últimos relatos
      </span>
      <h2 className="mt-3 text-xl font-black text-slate-900">Movimentação próxima</h2>
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
