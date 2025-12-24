import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import { API_BASE_URL, Endpoint } from './endpoint';
import { clearTokens, getRefreshToken, getToken, setTokens } from '@repo/core';

// Create axios instance
const apiClient = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if token refresh is in progress
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedQueue: any[] = [];

// Process the queue of failed requests
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Call your refresh token endpoint
    const response = await axios.post(
      `${API_BASE_URL}${Endpoint.refreshTokens}`,
      {
        refresh_token: refreshToken,
      }
    );

    const access_token = response.data.access_token;
    const refresh_token = response.data.refresh_token;

    // Save the new tokens
    await setTokens(access_token, refresh_token);

    return access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Clear tokens on refresh failure
    await clearTokens();

    // Todo should logout user or redirect to login page

    throw error;
  }
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await getToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);

        // Update the authorization header
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
