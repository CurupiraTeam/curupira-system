import { useEffect, useState } from 'react';
import { HealthService } from '../../services/health.service';
import { RealtimeStatusIndicator } from './RealtimeStatusIndicator';
import type { RealtimeConnectionState } from '../../types';

export function ApiStatusPanel({ realtimeState }: { realtimeState: RealtimeConnectionState }) {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');

  useEffect(() => {
    let active = true;
    HealthService.ping()
      .then(() => {
        if (active) setStatus('online');
      })
      .catch(() => {
        if (active) setStatus('offline');
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="rounded-3xl bg-white/10 p-5">
      <p className="text-sm font-bold text-emerald-300">Status da plataforma</p>
      <strong className="mt-2 block text-2xl font-black">
        {status === 'online' ? 'API disponível' : status === 'offline' ? 'API indisponível' : 'Verificando API'}
      </strong>
      <p className="mt-2 text-sm text-slate-300">
        {status === 'offline' ? 'Dados locais podem aparecer enquanto a API não responde.' : 'Monitoramento preparado para dados oficiais e relatos comunitários.'}
      </p>
      <div className="mt-4">
        <RealtimeStatusIndicator state={realtimeState} />
      </div>
    </div>
  );
}
