export interface ArduinoDataEvent {
  valor: string;
  timestamp: string;
}

export type RealtimeConnectionState = 'connected' | 'connecting' | 'reconnecting' | 'disconnected' | 'error';
