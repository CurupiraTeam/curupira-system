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

  constructor(private eventEmitter: EventEmitter2) {}

  onModuleInit() {
    this.connectArduino();
  }

  private getPortPath(): string {
    if (process.env.ARDUINO_PORT) {
      return process.env.ARDUINO_PORT;
    }
    // Auto-detect port path based on OS platform
    if (process.platform === 'win32') {
      return 'COM3';
    }
    // On Linux/macOS, default to standard serial ports
    return '/dev/ttyUSB0';
  }

  private connectArduino() {
    const portPath = this.getPortPath();
    try {
      this.port = new SerialPort({
        path: portPath,
        baudRate: 9600,
        autoOpen: false,
      });

      this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

      this.port.open((err) => {
        if (err) {
          return this.logger.warn(
            `Arduino não detectado na porta ${portPath}. Pulando conexão serial para o protótipo real. (Mensagem: ${err.message})`,
          );
        }
        this.logger.log(`🚀 Conectado com sucesso ao protótipo Arduino na porta ${portPath}`);
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
        this.logger.warn('Conexão Serial com o Arduino encerrada.');
      });

      this.port.on('error', (err) => {
        this.logger.warn(`Canal serial temporariamente indisponível: ${err.message}`);
      });
    } catch (error: any) {
      this.logger.warn(`Não foi possível estabelecer conexão serial: ${error.message}`);
    }
  }

  onModuleDestroy() {
    if (this.port && this.port.isOpen) {
      this.port.close();
    }
  }
}
