import { AlertTriangle, Navigation, Plus } from 'lucide-react';
import type { EnvironmentalSummary } from '../../types';

interface DiagnosisCardProps {
  summary: EnvironmentalSummary;
  onReport: () => void;
}

export function DiagnosisCard({ summary, onReport }: DiagnosisCardProps) {
  return (
    <div className="text-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
            <Navigation size={14} aria-hidden="true" /> Diagnóstico local
          </span>
          <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
            {summary.subRegion ? `${summary.subRegion}, ` : ''}
            {summary.region}
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-300">{summary.updatedAt || 'Atualização indisponível'}</p>
        </div>

        {typeof summary.aqiValue === 'number' && (
          <div className="w-fit rounded-3xl bg-orange-400 px-5 py-4 text-slate-950 sm:text-right">
            <p className="text-xs font-black uppercase tracking-[0.2em]">IQA</p>
            <strong className="block text-4xl font-black leading-none">{summary.aqiValue}</strong>
            <span className="text-sm font-black">{summary.aqiStatus || 'Sem status'}</span>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-3xl bg-emerald-400 p-4 text-slate-950">
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
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-300 sm:w-auto"
      >
        <Plus size={19} aria-hidden="true" /> Fazer relato
      </button>
    </div>
  );
}
