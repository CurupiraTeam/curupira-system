import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

/**
 * TESTE UNITÁRIO 1 e 2 (Backend)
 * AuthService isolado: UsersService e JwtService são mockados.
 */
describe('AuthService (unitário)', () => {
  let service: AuthService;
  let usersService: { findByEmail: jest.Mock };
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    usersService = { findByEmail: jest.fn() };
    jwtService = { sign: jest.fn().mockReturnValue('jwt-token-fake') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('valida o usuário e remove a senha do retorno quando as credenciais batem', async () => {
    const senha = 'senha123';
    const hash = await bcrypt.hash(senha, 10);
    usersService.findByEmail.mockResolvedValue({
      id: 'u1',
      email: 'joao@email.com',
      nome: 'João',
      senha: hash,
    });

    const result = await service.validateUser({ email: 'joao@email.com', senha });

    expect(result).toEqual({ id: 'u1', email: 'joao@email.com', nome: 'João' });
    expect((result as any).senha).toBeUndefined();
  });

  it('retorna null quando a senha está incorreta', async () => {
    const hash = await bcrypt.hash('senha-correta', 10);
    usersService.findByEmail.mockResolvedValue({
      id: 'u1',
      email: 'joao@email.com',
      nome: 'João',
      senha: hash,
    });

    const result = await service.validateUser({ email: 'joao@email.com', senha: 'errada' });

    expect(result).toBeNull();
  });

  it('gera um access_token assinado a partir do payload do usuário', async () => {
    const result = await service.login({ id: 'u1', email: 'joao@email.com', nome: 'João' });

    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 'u1',
      email: 'joao@email.com',
      name: 'João',
    });
    expect(result).toEqual({ access_token: 'jwt-token-fake' });
  });
});
