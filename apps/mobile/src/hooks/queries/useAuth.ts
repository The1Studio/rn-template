import { useMutation } from '@tanstack/react-query';
import { authService, LoginRequest } from '@/api/services';
import { useAuthStore } from '@/stores';
import { setTokens, clearTokens } from '@repo/core';

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: async (response) => {
      // Save tokens to secure storage
      await setTokens(response.access_token, response.refresh_token);

      // Update auth store
      login(response.user, response.access_token);
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: async () => {
      // Clear tokens from secure storage
      await clearTokens();

      // Update auth store
      logout();
    },
    onError: async () => {
      // Even if API fails, clear local state
      await clearTokens();
      logout();
    },
  });
};
