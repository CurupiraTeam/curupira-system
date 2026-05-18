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

    // Se não houver leituras reais, usamos o valor base simulado (37) para o painel não ficar zerado
    const valorReal = ultimaLeitura ? ultimaLeitura.valor : 37;

    const additionalMetrics = [
      { label: 'Material particulado PM2.5', value: valorReal, unit: 'µg/m³', safeLimit: 25 },
      { label: 'Material particulado PM10', value: 68, unit: 'µg/m³', safeLimit: 50 },
      { label: 'Monóxido de carbono', value: 5, unit: 'ppm', safeLimit: 9 },
      { label: 'Dióxido de nitrogênio', value: 42, unit: 'ppb', safeLimit: 53 }
    ];

    // Cálculo simplificado de AQI (IQA) baseado no PM2.5
    // Faixas típicas US EPA PM2.5 (µg/m³):
    // 0 - 12.0   -> AQI 0 - 50 (Bom)
    // 12.1 - 35.4 -> AQI 51 - 100 (Moderado)
    // 35.5 - 55.4 -> AQI 101 - 150 (Inadequado para grupos sensíveis)
    // 55.5 - 150.4 -> AQI 151 - 200 (Ruim)
    let aqiValue = 78;
    if (valorReal <= 12) {
      aqiValue = Math.round((50 / 12) * valorReal);
    } else if (valorReal <= 35.4) {
      aqiValue = Math.round(50 + ((100 - 50) / (35.4 - 12)) * (valorReal - 12));
    } else if (valorReal <= 55.4) {
      aqiValue = Math.round(100 + ((150 - 100) / (55.4 - 35.4)) * (valorReal - 35.4));
    } else if (valorReal <= 150.4) {
      aqiValue = Math.round(150 + ((200 - 150) / (150.4 - 55.4)) * (valorReal - 55.4));
    } else {
      aqiValue = Math.round(200 + ((300 - 200) / (250.4 - 150.4)) * (valorReal - 150.4));
    }

    return {
      pm25: valorReal,
      aqiValue,
      updatedAt: ultimaLeitura ? ultimaLeitura.lido_em.toISOString() : new Date().toISOString(),
      additionalMetrics
    };
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
