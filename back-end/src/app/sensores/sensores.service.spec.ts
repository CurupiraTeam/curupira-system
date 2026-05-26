import { Test, TestingModule } from '@nestjs/testing';
import { SensoresService } from './sensores.service';
import { PrismaService } from 'src/commons/databases/prisma.service';

/**
 * TESTE UNITÁRIO 5 (Backend) + casos extras
 * SensoresService isolado: PrismaService é mockado.
 */
describe('SensoresService (unitário)', () => {
  let service: SensoresService;
  let prisma: {
    leituraSensor: { findFirst: jest.Mock; create: jest.Mock };
    dispositivoSensor: { findUnique: jest.Mock; create: jest.Mock };
    logDispositivo: { create: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      leituraSensor: { findFirst: jest.fn(), create: jest.fn() },
      dispositivoSensor: { findUnique: jest.fn(), create: jest.fn() },
      logDispositivo: { create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [SensoresService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<SensoresService>(SensoresService);
  });

  it('calcula o AQI na faixa "Bom" para PM2.5 baixo (10 µg/m³ -> ~42)', async () => {
    prisma.leituraSensor.findFirst.mockResolvedValue({
      valor: 10,
      lido_em: new Date('2026-01-01T00:00:00.000Z'),
    });

    const metricas = await service.getMetricas();

    expect(metricas.pm25).toBe(10);
    // (50/12)*10 = 41.66 -> 42
    expect(metricas.aqiValue).toBe(42);
  });

  it('usa o valor base 37 quando não há leituras reais', async () => {
    prisma.leituraSensor.findFirst.mockResolvedValue(null);

    const metricas = await service.getMetricas();

    expect(metricas.pm25).toBe(37);
    expect(metricas.additionalMetrics).toHaveLength(4);
  });

  it('cria o dispositivo automaticamente ao salvar uma leitura de sensor inexistente', async () => {
    prisma.dispositivoSensor.findUnique.mockResolvedValue(null);
    prisma.dispositivoSensor.create.mockResolvedValue({ id: 'sensor-1' });
    prisma.leituraSensor.create.mockResolvedValue({ id: 'leitura-1' });

    await service.createLeitura({ dispositivo_id: 'sensor-1', valor: 42 });

    expect(prisma.dispositivoSensor.create).toHaveBeenCalledTimes(1);
    expect(prisma.leituraSensor.create).toHaveBeenCalledWith({
      data: { dispositivo_id: 'sensor-1', valor: 42, unidade: 'µg/m³' },
    });
  });
});
