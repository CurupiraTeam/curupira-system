import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/commons/databases/prisma.service';
import { NivelLog } from '@prisma/client';

@Injectable()
export class SensoresService {
  constructor(private readonly prisma: PrismaService) {}

  async createLeitura(data: { dispositivo_id: string, valor: number, unidade?: string }) {
    let dispositivo = await this.prisma.dispositivoSensor.findUnique({
      where: { id: data.dispositivo_id }
    });

    if (!dispositivo) {
       dispositivo = await this.prisma.dispositivoSensor.create({
         data: {
           id: data.dispositivo_id,
           nome: 'Sensor Autogerado',
           latitude: -3.1019, 
           longitude: -60.0250
         }
       });
    }

    return this.prisma.leituraSensor.create({
      data: {
        dispositivo_id: dispositivo.id,
        valor: typeof data.valor === 'string' ? parseFloat(data.valor) : data.valor,
        unidade: data.unidade || 'µg/m³'
      }
    });
  }

  async getMetricas() {
    const ultimaLeitura = await this.prisma.leituraSensor.findFirst({
      orderBy: { lido_em: 'desc' }
    });

    const valorReal = ultimaLeitura ? ultimaLeitura.valor : 0;

    return [
      { label: 'Material particulado PM2.5', value: valorReal, unit: 'µg/m³', safeLimit: 25 },
      { label: 'Material particulado PM10', value: 68, unit: 'µg/m³', safeLimit: 50 },
      { label: 'Monóxido de carbono', value: 5, unit: 'ppm', safeLimit: 9 },
      { label: 'Dióxido de nitrogênio', value: 42, unit: 'ppb', safeLimit: 53 }
    ];
  }

  async createLog(data: { dispositivo_id: string, nivel?: NivelLog, mensagem: string, detalhes?: any }) {
    let dispositivo = await this.prisma.dispositivoSensor.findUnique({
      where: { id: data.dispositivo_id }
    });

    if (!dispositivo) {
       dispositivo = await this.prisma.dispositivoSensor.create({
         data: {
           id: data.dispositivo_id,
           nome: 'Sensor Autogerado',
           latitude: -3.1019,
           longitude: -60.0250
         }
       });
    }

    return this.prisma.logDispositivo.create({
      data: {
        dispositivo_id: dispositivo.id,
        nivel: data.nivel || NivelLog.INFO,
        mensagem: data.mensagem,
        detalhes: data.detalhes || {}
      }
    });
  }
}
