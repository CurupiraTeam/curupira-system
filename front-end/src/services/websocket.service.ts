import { io, Socket } from 'socket.io-client';
import type { ArduinoDataEvent, RealtimeConnectionState } from '../types';
import { getSocketUrl } from './api/endpoints';

type ArduinoListener = (event: ArduinoDataEvent) => void;
type ConnectionListener = (state: RealtimeConnectionState) => void;

let socket: Socket | null = null;
const arduinoListeners = new Set<ArduinoListener>();
const connectionListeners = new Set<ConnectionListener>();

export const WebSocketService = {
  connect() {
    if (socket) return socket;
    emitConnection('connecting');
    socket = io(getSocketUrl(), {
      autoConnect: true,
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => emitConnection('connected'));
    socket.on('disconnect', () => emitConnection('disconnected'));
    socket.io.on('reconnect_attempt', () => emitConnection('reconnecting'));
    socket.on('connect_error', () => emitConnection('error'));
    socket.on('dados_arduino', (event: ArduinoDataEvent) => {
      arduinoListeners.forEach((listener) => listener(event));
    });
    return socket;
  },

  disconnect() {
    socket?.disconnect();
    socket = null;
    emitConnection('disconnected');
  },

  onArduinoData(listener: ArduinoListener) {
    arduinoListeners.add(listener);
    this.connect();
    return () => arduinoListeners.delete(listener);
  },

  onConnectionChange(listener: ConnectionListener) {
    connectionListeners.add(listener);
    this.connect();
    return () => connectionListeners.delete(listener);
  }
};

function emitConnection(state: RealtimeConnectionState) {
  connectionListeners.forEach((listener) => listener(state));
}
