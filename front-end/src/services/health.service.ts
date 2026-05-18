import { apiRequest } from './api/httpClient';
import { API_ROUTES } from './api/endpoints';

export const HealthService = {
  ping() {
    return apiRequest<string>(API_ROUTES.ping, { skipAuth: true });
  },

  health() {
    return apiRequest<unknown>(API_ROUTES.health);
  }
};
