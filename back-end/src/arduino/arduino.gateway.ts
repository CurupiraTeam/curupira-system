import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ArduinoGateway {
  @WebSocketServer()
  server!: Server;

  @OnEvent('sensor.update')
  handleSensorUpdate(payload: { valor: string; timestamp: string }) {
    this.server.emit('dados_arduino', payload);
  }
}
