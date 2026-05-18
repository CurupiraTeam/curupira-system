import { Flame, MapPin, RadioTower } from 'lucide-react';
import type { Report } from '../../types';
import { mapCategoryToIcon } from '../../utils/mapCategoryToIcon';
import { formatDateTime } from '../../utils/formatDate';
import { StatusBadge } from '../StatusBadge';

export function ReportCard({ report }: { report: Report }) {
  const visual = mapCategoryToIcon(report.categoryName);
  const Icon = visual.icon || Flame;
  const location = report.approximateLocation || [report.neighborhood, report.city].filter(Boolean).join(', ') || report.region || 'Local aproximado';

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`rounded-2xl p-3 ${visual.colorClass}`}>
            <Icon size={22} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-black text-slate-950">{report.categoryName}</h3>
            <p className="flex items-center gap-1 text-sm text-slate-500">
              <MapPin size={14} aria-hidden="true" /> <span className="truncate">{location}</span>
            </p>
          </div>
        </div>
        {report.status && <StatusBadge status={report.status === 'Desconhecido' ? 'Moderado' : report.status} />}
      </div>

      {report.description && <p className="mt-4 text-sm leading-6 text-slate-600">{report.description}</p>}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm">
        <span className="flex items-center gap-2 font-semibold text-slate-600">
          <RadioTower size={16} aria-hidden="true" /> {report.source}
        </span>
        {typeof report.intensity === 'number' && <span className="font-bold text-emerald-700">Intensidade {report.intensity}%</span>}
        <span className="text-slate-400">{formatDateTime(report.createdAt)}</span>
      </div>
    </article>
  );
}
