import type { MapMarker } from '../types';

export function groupMapMarkers(markers: MapMarker[]) {
  return markers.reduce<Record<string, MapMarker[]>>((groups, marker) => {
    const key = marker.clusterKey || `${marker.position.lat.toFixed(3)},${marker.position.lng.toFixed(3)}`;
    groups[key] = groups[key] || [];
    groups[key].push(marker);
    return groups;
  }, {});
}
