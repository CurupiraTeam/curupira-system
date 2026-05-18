export const API_ROUTES = {
  auth: {
    login: '/auth/login',
    register: '/auth/cadastro'
  },
  categories: '/categorias',
  statisticsHistory: '/estatisticas/historico',
  health: '/health',
  ping: '/ping',
  versions: '/versoes',
  uploads: '/uploads',
  reports: {
    list: '/relatos',
    user: '/relatos/usuarios',
    official: '/relatos/oficiais'
  },
  sensors: {
    readings: '/sensores/leituras',
    metrics: '/sensores/metricas',
    logs: '/sensores/logs'
  }
} as const;

export function getApiBaseUrl() {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return env?.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:3000';
}

export function getSocketUrl() {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return env?.VITE_SOCKET_URL?.replace(/\/$/, '') || getApiBaseUrl();
}
