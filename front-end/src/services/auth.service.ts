import type { AuthResponse, LoginPayload, RegisterPayload } from '../types';
import { storeToken, clearStoredToken } from '../utils/tokenStorage';
import { apiRequest } from './api/httpClient';
import { API_ROUTES } from './api/endpoints';

export const AuthService = {
  async login(payload: LoginPayload) {
    console.log('[AuthService] Fazendo requisição de login para:', API_ROUTES.auth.login);
    const response = await apiRequest<any>(API_ROUTES.auth.login, {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify(payload)
    });
    console.log('[AuthService] Resposta recebida:', response);
    
    // Extrai o token da estrutura correta da resposta
    const token = response.data?.access_token || response.access_token;
    if (!token) {
      throw new Error('Token não encontrado na resposta do servidor');
    }
    
    console.log('[AuthService] Token extraído:', token);
    storeToken(token);
    console.log('[AuthService] Token armazenado com sucesso');
    
    // Retorna uma resposta normalizada
    return {
      access_token: token
    } as AuthResponse;
  },

  async register(payload: RegisterPayload) {
    console.log('[AuthService] Fazendo requisição de registro para:', API_ROUTES.auth.register);
    return apiRequest<AuthResponse | void>(API_ROUTES.auth.register, {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify(payload)
    });
  },

  logout() {
    clearStoredToken();
  }
};
