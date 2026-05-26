import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as request from 'supertest';
import { RelatosController } from './relatos.controller';
import { RelatosService } from './relatos.service';
import { PrismaService } from 'src/commons/databases/prisma.service';

/**
 * TESTE DE INTEGRAÇÃO 5 (Backend)
 * RelatosController + RelatosService reais; Prisma e EventEmitter mockados.
 */
describe('Relatos (integração)', () => {
  let app: INestApplication;
  let prisma: {
    relatoUsuario: { findMany: jest.Mock };
    relatoOficial: { findMany: jest.Mock };
  };

  beforeAll(async () => {
    prisma = {
      relatoUsuario: { findMany: jest.fn() },
      relatoOficial: { findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelatosController],
      providers: [
        RelatosService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /relatos retorna a lista unificada normalizada e ordenada por data', async () => {
    prisma.relatoUsuario.findMany.mockResolvedValue([
      {
        id: 'antigo',
        latitude: -3.1,
        longitude: -60.0,
        status: 'ATIVO',
        referencia_endereco: 'Centro',
        descricao: 'fumaça',
        criado_em: new Date('2026-01-01T00:00:00.000Z'),
        categoria: { nome: 'Fumaça' },
      },
      {
        id: 'novo',
        latitude: -3.2,
        longitude: -60.1,
        status: 'ATIVO',
        referencia_endereco: 'Adrianópolis',
        descricao: 'queimada',
        criado_em: new Date('2026-02-01T00:00:00.000Z'),
        categoria: { nome: 'Queimada' },
      },
    ]);
    prisma.relatoOficial.findMany.mockResolvedValue([]);

    const res = await request(app.getHttpServer()).get('/relatos').expect(200);

    expect(res.body).toHaveLength(2);
    expect(res.body[0].id).toBe('novo'); // mais recente primeiro
    expect(res.body[0].source).toBe('Usuário');
    expect(res.body[0].city).toBe('Manaus');
  });
});
