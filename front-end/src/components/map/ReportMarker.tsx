import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import type { MapMarker } from '../../types';
import { mapCategoryToIcon } from '../../utils/mapCategoryToIcon';
import { formatDateTime } from '../../utils/formatDate';

interface ReportMarkerProps {
  marker: MapMarker;
  onSelect: (marker: MapMarker) => void;
}

export function ReportMarker({ marker, onSelect }: ReportMarkerProps) {
  const visual = mapCategoryToIcon(marker.categoryName);
  const icon = L.divIcon({
    className: '',
    html: `<span class="block h-5 w-5 rounded-full border-2 border-white shadow-lg ${visual.markerClass}"></span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  return (
    <Marker position={marker.position} icon={icon} eventHandlers={{ click: () => onSelect(marker) }}>
      <Popup>
        <div className="min-w-44">
          <strong>{marker.label}</strong>
          <p>{marker.description || 'Sem descrição.'}</p>
          <small>{formatDateTime(marker.createdAt)}</small>
        </div>
      </Popup>
    </Marker>
  );
}
