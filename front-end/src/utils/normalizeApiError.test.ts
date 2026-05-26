import { describe, it, expect } from 'vitest';
import { normalizeApiError, normalizeUnknownError, isNormalizedApiError } from './normalizeApiError';

/**
 * TESTE UNITÁRIO 3 (Frontend)
 * Normalização de erros vindos da API.
 */
describe('normalizeApiError (unitário)', () => {
  it('extrai a mensagem do corpo e marca 401 como não autorizado', async () => {
    const response = new Response(JSON.stringify({ message: 'Sessão expirada' }), { status: 401 });

    const result = await normalizeApiError(response);

    expect(result.status).toBe(401);
    expect(result.message).toBe('Sessão expirada');
    expect(result.isUnauthorized).toBe(true);
  });

  it('junta mensagens em array em uma única string', async () => {
    const response = new Response(JSON.stringify({ message: ['campo a', 'campo b'] }), { status: 400 });

    const result = await normalizeApiError(response);

    expect(result.message).toBe('campo a campo b');
    expect(result.isUnauthorized).toBe(false);
  });

  it('usa mensagem padrão de servidor indisponível para status 500 sem corpo', async () => {
    const response = new Response('', { status: 500 });

    const result = await normalizeApiError(response);

    expect(result.message).toBe('O serviço está indisponível no momento.');
  });

  it('normalizeUnknownError trata Error genérico como erro de rede', () => {
    const result = normalizeUnknownError(new Error('falha de conexão'));

    expect(result.isNetworkError).toBe(true);
    expect(result.message).toBe('falha de conexão');
    expect(isNormalizedApiError(result)).toBe(true);
  });
});
