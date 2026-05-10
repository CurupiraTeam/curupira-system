import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ArduinoService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ArduinoService.name);
  private port!: SerialPort;
  private parser!: ReadlineParser;

  // Ajuste conforme a porta que o seu Windows estiver usando
  private readonly PORTA_COM = 'COM3';

  constructor(private eventEmitter: EventEmitter2) {}

  onModuleInit() {
    this.connectArduino();
  }

  private connectArduino() {
    try {
      this.port = new SerialPort({
        path: this.PORTA_COM,
        baudRate: 9600,
        autoOpen: false,
      });

      this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

      this.port.open((err) => {
        if (err) {
          return this.logger.error(
            `Falha ao abrir ${this.PORTA_COM}: ${err.message}`,
          );
        }
        this.logger.log(`🚀 Conectado ao Arduino na porta ${this.PORTA_COM}`);
      });

      this.parser.on('data', (data: string) => {
        const leitura = data.trim();
        this.logger.debug(`[Leitura Sensor]: ${leitura}`);

        // EMISSÃO INTERNA: Dispara um evento que o Gateway vai "ouvir"
        this.eventEmitter.emit('sensor.update', {
          valor: leitura,
          timestamp: new Date().toISOString(),
        });
      });

      this.port.on('close', () => {
        this.logger.warn('Conexão Serial encerrada.');
      });

      this.port.on('error', (err) => {
        this.logger.error(`Erro crítico na porta serial: ${err.message}`);
      });
    } catch (error) {
      this.logger.error('Erro ao inicializar conexão serial', error);
    }
  }

  onModuleDestroy() {
    if (this.port && this.port.isOpen) {
      this.port.close();
    }
  }
}
