import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SensoresController } from './sensores.controller';
import { SensoresService } from './sensores.service';
import { PrismaService } from 'src/commons/databases/prisma.service';

/**
 * TESTE DE INTEGRAÇÃO 4 (Backend)
 * SensoresController + SensoresService reais; PrismaService mockado.
 */
describe('Sensores (integração)', () => {
  let app: INestApplication;
  let prisma: { leituraSensor: { findFirst: jest.Mock } };

  beforeAll(async () => {
    prisma = { leituraSensor: { findFirst: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensoresController],
      providers: [SensoresService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /sensores/metricas retorna pm25, aqiValue e métricas adicionais', async () => {
    prisma.leituraSensor.findFirst.mockResolvedValue({
      valor: 37,
      lido_em: new Date('2026-01-01T00:00:00.000Z'),
    });

    const res = await request(app.getHttpServer()).get('/sensores/metricas').expect(200);

    expect(res.body.pm25).toBe(37);
    expect(typeof res.body.aqiValue).toBe('number');
    expect(Array.isArray(res.body.additionalMetrics)).toBe(true);
    expect(res.body.additionalMetrics).toHaveLength(4);
  });
});
