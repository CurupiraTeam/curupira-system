import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/commons/databases/prisma.service';

/**
 * TESTES DE INTEGRAÇÃO 1, 2 e 3 (Backend)
 * Sobe o AuthController + AuthService + UsersService + JwtService de verdade.
 * Apenas o PrismaService (camada de banco) é mockado.
 */
describe('Auth (integração)', () => {
  let app: INestApplication;
  let prisma: { usuario: { findUnique: jest.Mock; create: jest.Mock } };

  beforeAll(async () => {
    prisma = { usuario: { findUnique: jest.fn(), create: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test-secret', signOptions: { expiresIn: '1h' } })],
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => jest.clearAllMocks());

  it('POST /auth/login retorna um access_token com credenciais válidas', async () => {
    const hash = await bcrypt.hash('senha123', 10);
    prisma.usuario.findUnique.mockResolvedValue({
      id: 'u1',
      nome: 'João',
      email: 'joao@email.com',
      senha: hash,
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'joao@email.com', senha: 'senha123' })
      .expect(200);

    expect(typeof res.body.access_token).toBe('string');
    expect(res.body.access_token.split('.')).toHaveLength(3); // JWT
  });

  it('POST /auth/login retorna 401 com senha inválida', async () => {
    const hash = await bcrypt.hash('senha123', 10);
    prisma.usuario.findUnique.mockResolvedValue({
      id: 'u1',
      nome: 'João',
      email: 'joao@email.com',
      senha: hash,
    });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'joao@email.com', senha: 'errada' })
      .expect(401);
  });

  it('POST /auth/cadastro retorna 400 quando o e-mail é inválido (ValidationPipe)', async () => {
    await request(app.getHttpServer())
      .post('/auth/cadastro')
      .send({ nome: 'João', email: 'nao-e-email', senha: 'senha123' })
      .expect(400);

    expect(prisma.usuario.create).not.toHaveBeenCalled();
  });
});
