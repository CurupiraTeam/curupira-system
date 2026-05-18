import { useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import type { ReportFilters } from '../../services/reports.service';

interface MapViewportControllerProps {
  onBoundsChange: (filters: ReportFilters) => void;
}

export function MapViewportController({ onBoundsChange }: MapViewportControllerProps) {
  const map = useMapEvents({
    moveend: () => emitBounds(),
    zoomend: () => emitBounds()
  });

  function emitBounds() {
    const bounds = map.getBounds();
    onBoundsChange({
      latMin: bounds.getSouth(),
      latMax: bounds.getNorth(),
      lngMin: bounds.getWest(),
      lngMax: bounds.getEast()
    });
  }

  useEffect(() => {
    emitBounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
