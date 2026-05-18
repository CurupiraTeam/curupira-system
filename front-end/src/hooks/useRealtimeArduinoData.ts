import { useEffect, useState } from 'react';
import type { ArduinoDataEvent, RealtimeConnectionState } from '../types';
import { WebSocketService } from '../services/websocket.service';

export function useRealtimeArduinoData() {
  const [latest, setLatest] = useState<ArduinoDataEvent | undefined>();
  const [connectionState, setConnectionState] = useState<RealtimeConnectionState>('connecting');

  useEffect(() => {
    const offConnection = WebSocketService.onConnectionChange(setConnectionState);
    const offData = WebSocketService.onArduinoData((event) => {
      setLatest((current) => {
        if (!current) return event;
        const currentTime = new Date(current.timestamp).getTime();
        const nextTime = new Date(event.timestamp).getTime();
        return Number.isFinite(nextTime) && nextTime >= currentTime ? event : current;
      });
    });

    return () => {
      offData();
      offConnection();
    };
  }, []);

  return { latest, connectionState };
}
