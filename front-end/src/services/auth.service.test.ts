import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do httpClient antes de importar o serviço
const apiRequestMock = vi.fn();
vi.mock('./api/httpClient', () => ({
  apiRequest: (...args: unknown[]) => apiRequestMock(...args),
}));

import { AuthService } from './auth.service';
import { getStoredToken } from '../utils/tokenStorage';

/**
 * TESTE UNITÁRIO 4 (Frontend)
 * AuthService com httpClient mockado.
 */
describe('AuthService.login (unitário)', () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
    window.localStorage.clear();
  });

  it('extrai o access_token de response.data e o armazena', async () => {
    apiRequestMock.mockResolvedValue({ data: { access_token: 'token-aninhado' } });

    const result = await AuthService.login({ email: 'a@a.com', senha: '123456' });

    expect(result.access_token).toBe('token-aninhado');
    expect(getStoredToken()).toBe('token-aninhado');
  });

  it('extrai o access_token do nível raiz da resposta', async () => {
    apiRequestMock.mockResolvedValue({ access_token: 'token-raiz' });

    const result = await AuthService.login({ email: 'a@a.com', senha: '123456' });

    expect(result.access_token).toBe('token-raiz');
  });

  it('lança erro quando a resposta não contém token', async () => {
    apiRequestMock.mockResolvedValue({ data: {} });

    await expect(AuthService.login({ email: 'a@a.com', senha: '123456' })).rejects.toThrow(
      'Token não encontrado na resposta do servidor',
    );
  });
});
