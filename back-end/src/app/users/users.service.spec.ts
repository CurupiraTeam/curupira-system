import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/commons/databases/prisma.service';

/**
 * TESTE UNITÁRIO 3 e 4 (Backend)
 * UsersService isolado: PrismaService é mockado.
 */
describe('UsersService (unitário)', () => {
  let service: UsersService;
  let prisma: { usuario: { findUnique: jest.Mock; create: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      usuario: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('lança ConflictException quando o e-mail já existe', async () => {
    prisma.usuario.findUnique.mockResolvedValue({ id: 'u1', email: 'joao@email.com' });

    await expect(
      service.create({ nome: 'João', email: 'joao@email.com', senha: 'senha123' }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prisma.usuario.create).not.toHaveBeenCalled();
  });

  it('cria o usuário com a senha criptografada (hash diferente do texto puro)', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null);
    prisma.usuario.create.mockImplementation(({ data }) =>
      Promise.resolve({ id: 'u1', nome: data.nome, email: data.email }),
    );

    await service.create({ nome: 'Maria', email: 'maria@email.com', senha: 'senha123' });

    expect(prisma.usuario.create).toHaveBeenCalledTimes(1);
    const enviado = prisma.usuario.create.mock.calls[0][0].data;
    expect(enviado.email).toBe('maria@email.com');
    expect(enviado.senha).not.toBe('senha123');
    expect(enviado.senha.length).toBeGreaterThan(20); // hash bcrypt
  });
});
