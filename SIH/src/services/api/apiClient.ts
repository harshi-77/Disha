import { ENV } from '../../config/env';

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const getRuntimeSettings = () => {
  try { return JSON.parse(localStorage.getItem('disha_settings') || '{}') as Partial<{ mode: 'demo' | 'live'; apiBaseUrl: string }>; }
  catch { return {}; }
};
// The build-time mode is authoritative. This prevents a previous session's
// settings from unexpectedly trying to call a backend in the bundled build.
export const isLiveMode = (): boolean => ENV.dishaMode === 'live' && (getRuntimeSettings().mode ?? ENV.dishaMode) === 'live';
export const getApiBaseUrl = (): string => getRuntimeSettings().apiBaseUrl?.trim() || ENV.apiBaseUrl;

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${getApiBaseUrl().replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = localStorage.getItem('disha_auth_token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new ApiError(
        errorBody.detail || errorBody.message || `API error (${response.status}): ${response.statusText}`,
        response.status
      );
    }

    return (await response.json()) as T;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out after 10 seconds. Check backend connectivity.', 408);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Network request failed. Is the DISHA backend running?', 0);
  }
}
