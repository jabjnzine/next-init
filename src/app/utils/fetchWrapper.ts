import { AuthTokens, AuthResponse } from '../types/auth.types';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const TENANT_ID = 'tester';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
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
    
    // Convert snake_case to camelCase for store
    useAuthStore.getState().setTokens({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });

    // Fetch fresh profile data after successful token refresh
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

export async function fetchWrapper<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requireAuth = false, headers = {}, ...restOptions } = options;
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  // Add default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'x-tenant-id': TENANT_ID,
    ...headers,
  };

  // Add auth header if required
  if (requireAuth) {
    let accessToken = useAuthStore.getState().accessToken;

    // If no access token and we have a refresh token, try to refresh
    if (!accessToken && useAuthStore.getState().refreshToken) {
      const newTokens = await refreshTokens();
      if (newTokens) {
        accessToken = newTokens.access_token;
      }
    }

    if (!accessToken) {
      throw new Error('No access token available');
    }

    Object.assign(defaultHeaders, {
      Authorization: `Bearer ${accessToken}`,
    });
  }

  const response = await fetch(url, {
    ...restOptions,
    headers: defaultHeaders,
  });

  // Handle 401 errors
  if (response.status === 401 && requireAuth) {
    const newTokens = await refreshTokens();
    if (newTokens) {
      // Retry the request with new access token
      Object.assign(defaultHeaders, {
        Authorization: `Bearer ${newTokens.access_token}`,
      });
      const retryResponse = await fetch(url, {
        ...restOptions,
        headers: defaultHeaders,
      });
      
      if (!retryResponse.ok) {
        throw new Error(`HTTP error! status: ${retryResponse.status}`);
      }
      return retryResponse.json();
    }
    throw new Error('Authentication failed');
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
} 