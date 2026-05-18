import { Wifi, WifiOff } from 'lucide-react';
import type { RealtimeConnectionState } from '../../types';

export function RealtimeStatusIndicator({ state }: { state: RealtimeConnectionState }) {
  const connected = state === 'connected';
  const Icon = connected ? Wifi : WifiOff;
  const label = connected ? 'Tempo real conectado' : state === 'reconnecting' ? 'Reconectando tempo real' : 'Tempo real indisponível';

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ${connected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
      <Icon size={14} aria-hidden="true" />
      {label}
    </div>
  );
}
