import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RelatosService } from './relatos.service';
import { PrismaService } from 'src/commons/databases/prisma.service';

/**
 * Casos unitários extras (Backend) - RelatosService isolado.
 */
describe('RelatosService (unitário)', () => {
  let service: RelatosService;
  let prisma: {
    relatoUsuario: { create: jest.Mock; findMany: jest.Mock };
    relatoOficial: { findMany: jest.Mock };
    midiaRelato: { create: jest.Mock };
  };
  let eventEmitter: { emit: jest.Mock };

  beforeEach(async () => {
    prisma = {
      relatoUsuario: { create: jest.fn(), findMany: jest.fn() },
      relatoOficial: { findMany: jest.fn() },
      midiaRelato: { create: jest.fn() },
    };
    eventEmitter = { emit: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelatosService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventEmitter2, useValue: eventEmitter },
      ],
    }).compile();

    service = module.get<RelatosService>(RelatosService);
  });

  it('resolve o slug "queimada" para categoria 2 e emite o evento relatos.change', async () => {
    prisma.relatoUsuario.create.mockResolvedValue({ id: 'r1' });

    await service.createUsuarioRelato('user-1', {
      categoria_id: 'queimada',
      latitude: '-3.1',
      longitude: '-60.0',
    });

    const dataEnviada = prisma.relatoUsuario.create.mock.calls[0][0].data;
    expect(dataEnviada.categoria.connect.id).toBe(2);
    expect(eventEmitter.emit).toHaveBeenCalledWith('relatos.change');
  });

  it('filtra os relatos unificados pela bounding box geográfica', async () => {
    prisma.relatoUsuario.findMany.mockResolvedValue([
      {
        id: 'dentro',
        latitude: -3.1,
        longitude: -60.0,
        status: 'ATIVO',
        criado_em: new Date('2026-01-02T00:00:00.000Z'),
        categoria: { nome: 'Fumaça' },
      },
      {
        id: 'fora',
        latitude: -10,
        longitude: -10,
        status: 'ATIVO',
        criado_em: new Date('2026-01-01T00:00:00.000Z'),
        categoria: { nome: 'Fumaça' },
      },
    ]);
    prisma.relatoOficial.findMany.mockResolvedValue([]);

    const result = await service.findAllUnified({
      latMin: '-4',
      latMax: '-2',
      lngMin: '-61',
      lngMax: '-59',
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('dentro');
  });
});
