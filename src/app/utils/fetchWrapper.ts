import { AuthTokens, AuthResponse } from '../types/auth.types';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const TENANT_ID = 'tester';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  credentials?: RequestCredentials;
}

interface FetchWrapper {
  get: (url: string, body?: any, options?: RequestOptions) => Promise<any>;
  post: (url: string, body?: any, options?: RequestOptions) => Promise<any>;
  put: (url: string, body?: any, options?: RequestOptions) => Promise<any>;
  delete: (url: string, body?: any, options?: RequestOptions) => Promise<any>;
  patch: (url: string, body?: any, options?: RequestOptions) => Promise<any>;
}

async function refreshTokens(): Promise<AuthResponse | null> {
  try {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) return null;

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': TENANT_ID,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      useAuthStore.getState().logout();
      return null;
    }

    const data: AuthResponse = await response.json();
    useAuthStore.getState().setTokens({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });

    try {
      await useAuthStore.getState().fetchProfile();
    } catch (error) {
      console.error('Failed to fetch profile after token refresh:', error);
    }

    return data;
  } catch (error) {
    useAuthStore.getState().logout();
    return null;
  }
}

async function handleResponse(response: Response) {
  const text = await response.text();
  let data;
  try {
    data = text && JSON.parse(text);
  } catch {
    data = text;
  }

  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }

  return data;
}

async function createHeaders(url: string, options?: RequestOptions): Promise<Headers> {
  const headers: Record<string, string> = {
    'x-tenant-id': TENANT_ID,
  };

  if (!(options?.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (!options?.skipAuth) {
    let accessToken = useAuthStore.getState().accessToken;

    if (!accessToken && useAuthStore.getState().refreshToken) {
      const newTokens = await refreshTokens();
      if (newTokens) {
        accessToken = newTokens.access_token;
      }
    }

    if (!accessToken) {
      throw new Error('No access token available');
    }

    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return new Headers(headers);
}

function createRequest(method: string) {
  return async (url: string, body?: any, options: RequestOptions = {}) => {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    const urlObj = new URL(fullUrl);

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: await createHeaders(url, options),
      credentials: options.credentials || 'same-origin',
      ...options,
    };

    // Handle body based on request method and type
    if (body instanceof FormData) {
      requestOptions.body = body;
    } else if (body) {
      if (method === 'GET') {
        // Add query params for GET requests
        Object.entries(body).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            urlObj.searchParams.append(key, String(value));
          }
        });
      } else if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        requestOptions.body = JSON.stringify(body);
      }
    }

    try {
      const response = await fetch(urlObj.toString(), requestOptions);

      if (response.status === 401 && !options?.skipAuth) {
        const newTokens = await refreshTokens();
        if (newTokens) {
          requestOptions.headers = new Headers({
            ...Object.fromEntries(requestOptions.headers as Headers),
            'Authorization': `Bearer ${newTokens.access_token}`
          });
          const retryResponse = await fetch(urlObj.toString(), requestOptions);

          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          return await handleResponse(retryResponse);
        }
        throw new Error('Authentication failed');
      }

      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  };
}

export const fetchWrapper: FetchWrapper = {
  get: createRequest('GET'),
  post: createRequest('POST'),
  put: createRequest('PUT'),
  delete: createRequest('DELETE'),
  patch: createRequest('PATCH'),
}; 