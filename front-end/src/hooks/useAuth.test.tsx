import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';

// Mock do httpClient usado indiretamente pelo AuthService
const apiRequestMock = vi.fn();
vi.mock('../services/api/httpClient', () => ({
  apiRequest: (...args: unknown[]) => apiRequestMock(...args),
}));

import { AuthProvider, useAuth } from './useAuth';
import { getStoredToken } from '../utils/tokenStorage';

/**
 * TESTES DE INTEGRAÇÃO 3, 4 e 5 (Frontend)
 * Integra useAuth + AuthProvider + AuthService + tokenStorage + parsing do JWT.
 */
const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;

describe('useAuth (integração)', () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
    window.localStorage.clear();
  });

  it('começa não autenticado quando não há token', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('autentica e extrai o usuário do JWT após o login', async () => {
    // payload {"sub":"u1","nome":"João","email":"joao@email.com"}
    const payload = btoa(JSON.stringify({ sub: 'u1', nome: 'João', email: 'joao@email.com' }));
    apiRequestMock.mockResolvedValue({ access_token: `header.${payload}.sig` });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({ email: 'joao@email.com', senha: '123456' });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.id).toBe('u1');
    expect(result.current.user?.nome).toBe('João');
    expect(getStoredToken()).toContain(payload);
  });

  it('faz logout limpando token e usuário', async () => {
    const payload = btoa(JSON.stringify({ sub: 'u1' }));
    apiRequestMock.mockResolvedValue({ access_token: `header.${payload}.sig` });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login({ email: 'a@a.com', senha: '123456' });
    });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => result.current.logout());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(getStoredToken()).toBeNull();
  });

  it('loginAsDemo autentica com um usuário de demonstração', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => result.current.loginAsDemo());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.id).toBe('demo-user');
  });
});
