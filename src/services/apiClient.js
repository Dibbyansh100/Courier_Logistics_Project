import axios from 'axios';

// Base URL configuration (reads VITE_API_URL, fallback http://localhost:8088)
const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8088';

// Ensure base URL points to /api without double slashes
const apiBase = rawBaseUrl.endsWith('/api')
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/+$/, '')}/api`;

export const apiClient = axios.create({
  baseURL: apiBase,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach HTTP Basic Auth header if credentials exist in session
apiClient.interceptors.request.use(
  (config) => {
    const userStr = sessionStorage.getItem('authUser');
    const password = sessionStorage.getItem('authPassword');
    if (userStr && password) {
      try {
        const user = JSON.parse(userStr);
        const identifier = user.loginIdentifier || user.username || user.email || '';
        if (identifier) {
          config.headers.Authorization = 'Basic ' + btoa(identifier + ':' + password);
        }
      } catch (e) {
        console.warn('Failed to attach basic auth header', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: redirect only on genuine unauthenticated sessions (excluding /auth/login)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Do not redirect if the failed request is the login attempt itself
    if (error.config?.url?.includes('/auth/login')) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401) {
      // Only clear and redirect if currently on a protected route
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      if (
        path.startsWith('/admin') ||
        path.startsWith('/customer') ||
        path.startsWith('/agent')
      ) {
        console.warn('401 Unauthorized encountered on protected route:', path);
        sessionStorage.removeItem('authUser');
        sessionStorage.removeItem('authPassword');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
