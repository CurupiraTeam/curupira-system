import { useCallback, useMemo, useState } from 'react';
import { Crosshair, LocateFixed } from 'lucide-react';
import { MapLegend } from '../../components/map/MapLegend';
import { MapShell } from '../../components/map/MapShell';
import { MapViewportController } from '../../components/map/MapViewportController';
import { MarkerDetailsPanel } from '../../components/map/MarkerDetailsPanel';
import { ReportMarker } from '../../components/map/ReportMarker';
import { EmptyState, ErrorState, LoadingState, PartialDataState, UnauthorizedState } from '../../components/ui/StateView';
import { useReports } from '../../hooks/useReports';
import type { ReportFilters } from '../../services/reports.service';
import type { MapMarker } from '../../types';
import { groupMapMarkers } from '../../utils/groupMapMarkers';
import { toMapMarker } from '../../utils/toMapMarker';

function nearlySameFilters(current: ReportFilters, next: ReportFilters) {
  return (['latMin', 'latMax', 'lngMin', 'lngMax'] as const).every((key) => Math.abs((current[key] || 0) - (next[key] || 0)) < 0.01);
}

export function MapPage() {
  const [filters, setFilters] = useState<ReportFilters>({});
  const [selectedMarker, setSelectedMarker] = useState<MapMarker>();
  const reports = useReports(filters);

  const markers = useMemo(() => (reports.data || []).map(toMapMarker).filter(Boolean) as MapMarker[], [reports.data]);
  const groupedMarkers = useMemo(() => groupMapMarkers(markers), [markers]);
  const invalidMarkerCount = Math.max((reports.data || []).length - markers.length, 0);

  const handleBoundsChange = useCallback((nextFilters: ReportFilters) => {
    setFilters((current) => (nearlySameFilters(current, nextFilters) ? current : nextFilters));
  }, []);

  return (
    <section className="px-4 py-8 pb-24 md:px-6 md:py-12 text-slate-800">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 border border-emerald-100">
            Mapa
          </span>
          <h1 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">Mapa colaborativo de ocorrências</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Visualize relatos georreferenciados, alertas oficiais e dados integrados preparados para consulta por área do mapa.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">
          <div className="grid gap-4">
            {reports.isLoading && <LoadingState compact title="Carregando mapa" description="Buscando ocorrências para a área visível." />}
            {reports.isUnauthorized && <UnauthorizedState compact title="Sessão necessária" description="Entre para carregar ocorrências protegidas. Dados locais podem aparecer como fallback." />}
            {reports.error && !reports.isUnauthorized && <ErrorState compact title="Usando ocorrências locais" description="A API de relatos não respondeu agora; mantendo uma visualização de demonstração." />}
            {reports.error && <PartialDataState compact title="Dados parciais" description="Alguns marcadores podem vir de fallback enquanto a conexão não normaliza." />}

            <MapShell>
              <MapViewportController onBoundsChange={handleBoundsChange} />
              {markers.map((marker) => (
                <ReportMarker key={marker.id} marker={marker} onSelect={setSelectedMarker} />
              ))}
            </MapShell>

            <MapLegend />
            {!markers.length && !reports.isLoading && <EmptyState title="Nenhuma ocorrência encontrada" description="Não há relatos georreferenciados para a área visível neste momento." />}
            {invalidMarkerCount > 0 && (
              <PartialDataState compact title="Coordenadas incompletas" description={`${invalidMarkerCount} registro(s) foram ignorados por não conter latitude e longitude válidas.`} />
            )}
          </div>

          <aside className="grid content-start gap-4">
            <div className="rounded-[2.5rem] border border-emerald-100 bg-white/95 p-5 shadow-xl shadow-slate-200/30">
              <p className="flex items-center gap-2 text-sm font-black text-emerald-700">
                <Crosshair size={18} aria-hidden="true" /> Área visível
              </p>
              <strong className="mt-3 block text-3xl font-black text-slate-900">{markers.length}</strong>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Marcadores válidos em {Object.keys(groupedMarkers).length} grupo(s) aproximados, evitando sobrecarga visual quando relatos estão muito próximos.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 hover:bg-emerald-600 px-4 py-3 text-sm font-black text-white transition shadow-lg shadow-emerald-700/25 active:scale-95"
              aria-label="Usar minha localização no mapa"
            >
              <LocateFixed size={18} aria-hidden="true" /> Usar minha localização
            </button>
            <MarkerDetailsPanel marker={selectedMarker} />
          </aside>
        </div>
      </div>
    </section>
  );
}
