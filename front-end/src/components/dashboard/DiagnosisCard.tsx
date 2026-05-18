import { AlertTriangle, Navigation, Plus } from 'lucide-react';
import type { EnvironmentalSummary } from '../../types';
import { statusGradient } from '../../utils/status';

interface DiagnosisCardProps {
  summary: EnvironmentalSummary;
  onReport: () => void;
}

export function DiagnosisCard({ summary, onReport }: DiagnosisCardProps) {
  return (
    <div className="text-slate-800">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-emerald-700 border border-emerald-100">
            <Navigation size={14} aria-hidden="true" /> Diagnóstico local
          </span>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {summary.subRegion ? `${summary.subRegion}, ` : ''}
            {summary.region}
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">{summary.updatedAt || 'Atualização indisponível'}</p>
        </div>

        {typeof summary.aqiValue === 'number' && (
          <div className={`w-fit rounded-3xl bg-gradient-to-br ${statusGradient[summary.aqiStatus] || 'from-emerald-400 to-teal-500'} px-5 py-4 text-slate-950 sm:text-right shadow-lg shadow-black/10`}>
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">IQA</p>
            <strong className="block text-4xl font-black leading-none">{summary.aqiValue}</strong>
            <span className="text-sm font-black">{summary.aqiStatus || 'Sem status'}</span>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 p-4 text-white shadow-lg shadow-emerald-600/10">
        <p className="flex items-center gap-2 text-sm font-black">
          <AlertTriangle size={18} aria-hidden="true" /> Atenção para sua região
        </p>
        <p className="mt-2 text-sm font-semibold leading-6">
          {summary.alertMessage || 'Acompanhe os indicadores e relatos próximos para entender a situação ambiental.'}
        </p>
      </div>

      <button
        type="button"
        onClick={onReport}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-black px-6 py-4 transition hover:-translate-y-0.5 shadow-lg shadow-emerald-700/25 active:scale-95 sm:w-auto"
      >
        <Plus size={19} aria-hidden="true" /> Fazer relato
      </button>
    </div>
  );
}
