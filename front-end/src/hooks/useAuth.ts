import { createContext, createElement, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import type { AuthResponse, LoginPayload, NormalizedApiError, RegisterPayload, User } from '../types';
import { AuthService } from '../services/auth.service';
import { clearStoredToken, getStoredToken, storeToken } from '../utils/tokenStorage';
import { normalizeUnknownError } from '../utils/normalizeApiError';

interface AuthContextValue {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: NormalizedApiError;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<AuthResponse | void>;
  loginAsDemo: () => void;
  logout: () => void;
  handleUnauthorized: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState<User | null>(() => getUserFromToken(getStoredToken()));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<NormalizedApiError | undefined>();

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(undefined);
    try {
      console.log('[Auth] Login iniciado com email:', payload.email);
      const response = await AuthService.login(payload);
      console.log('[Auth] Resposta do login recebida:', response);
      setToken(response.access_token);
      setUser(getUserFromToken(response.access_token));
      console.log('[Auth] Token e usuário atualizados no estado');
      return response;
    } catch (err) {
      const normalized = normalizeUnknownError(err);
      console.error('[Auth] Erro ao fazer login:', normalized);
      setError(normalized);
      throw normalized;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(undefined);
    try {
      return await AuthService.register(payload);
    } catch (err) {
      const normalized = normalizeUnknownError(err);
      setError(normalized);
      throw normalized;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setToken(null);
    setUser(null);
  }, []);

  const loginAsDemo = useCallback(() => {
    const demoUser = {
      sub: 'demo-user',
      id: 'demo-user',
      usuario_id: 'demo-user',
      nome: 'Usuário de demonstração',
      email: 'demo@curupira.local'
    };
    const demoToken = `demo.${window.btoa(JSON.stringify(demoUser))}.token`;
    storeToken(demoToken);
    setToken(demoToken);
    setUser(getUserFromToken(demoToken));
    setError(undefined);
  }, []);

  const handleUnauthorized = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isLoading,
      error,
      login,
      register,
      loginAsDemo,
      logout,
      handleUnauthorized
    }),
    [error, handleUnauthorized, isLoading, login, loginAsDemo, logout, register, token, user]
  );

  return createElement(AuthContext.Provider, { value }, children);
}

function getUserFromToken(token: string | null): User | null {
  if (!token) return null;
  try {
    const payloadPart = token.split('.')[1] || '';
    const payload = JSON.parse(decodeBase64Url(payloadPart)) as Record<string, unknown>;
    const nestedUser = payload.user && typeof payload.user === 'object' ? (payload.user as Record<string, unknown>) : undefined;
    const id =
      payload.usuario_id ??
      payload.userId ??
      payload.id ??
      nestedUser?.id ??
      nestedUser?.usuario_id ??
      payload.sub;
    if (!id) return null;
    return {
      id: id as string | number,
      nome: payload.nome as string | undefined,
      email: payload.email as string | undefined
    };
  } catch {
    return null;
  }
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
