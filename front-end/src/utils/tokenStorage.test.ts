import { describe, it, expect, beforeEach } from 'vitest';
import { getStoredToken, storeToken, clearStoredToken } from './tokenStorage';

/**
 * TESTE UNITÁRIO 2 (Frontend)
 * Persistência do token no localStorage (jsdom).
 */
describe('tokenStorage (unitário)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('retorna null quando não há token armazenado', () => {
    expect(getStoredToken()).toBeNull();
  });

  it('armazena e recupera o token', () => {
    storeToken('abc.123.xyz');
    expect(getStoredToken()).toBe('abc.123.xyz');
  });

  it('remove o token ao limpar', () => {
    storeToken('abc.123.xyz');
    clearStoredToken();
    expect(getStoredToken()).toBeNull();
  });
});
