import type { Report } from '../../types';
import { ReportCard } from '../reports/ReportCard';
import { EmptyState } from '../ui/StateView';

export function RecentRecordsList({ reports }: { reports: Report[] }) {
  if (!reports.length) {
    return <EmptyState title="Sem registros recentes" description="Ainda não há relatos detalhados para listar neste período." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}
