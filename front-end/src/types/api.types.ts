export interface NormalizedApiError {
  status?: number;
  code?: string;
  message: string;
  fieldErrors?: Record<string, string>;
  isUnauthorized: boolean;
  isNetworkError: boolean;
}

export interface APIState<T> {
  data?: T;
  isLoading: boolean;
  error?: NormalizedApiError;
  isEmpty: boolean;
  isUnauthorized: boolean;
  isSuccess: boolean;
}

export interface ApiListResponse<T> {
  items: T[];
  total?: number;
}

export interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
  timeoutMs?: number;
}
