import { apiRequest } from './api/httpClient';
import { API_ROUTES } from './api/endpoints';

export const SystemVersionService = {
  versions() {
    return apiRequest<string>(API_ROUTES.versions, { skipAuth: true });
  }
};
