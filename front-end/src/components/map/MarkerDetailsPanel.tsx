import type { MapMarker } from '../../types';
import { formatDateTime } from '../../utils/formatDate';

interface MarkerDetailsPanelProps {
  marker?: MapMarker;
}

export function MarkerDetailsPanel({ marker }: MarkerDetailsPanelProps) {
  if (!marker) {
    return (
      <div className="rounded-3xl bg-slate-950 p-5 text-white">
        <p className="text-sm font-bold text-emerald-300">Ocorrência</p>
        <h3 className="mt-3 text-2xl font-black">Selecione um marcador</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">Clique em uma ocorrência no mapa para ver detalhes resumidos.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-slate-950 p-5 text-white">
      <p className="text-sm font-bold text-emerald-300">{marker.source}</p>
      <h3 className="mt-3 text-2xl font-black">{marker.label}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{marker.description || 'Sem descrição informada.'}</p>
      <p className="mt-4 text-sm font-semibold text-slate-300">{formatDateTime(marker.createdAt)}</p>
    </div>
  );
}
