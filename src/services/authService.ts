import api from './api';

interface LoginResponse {
  token: string;
  role: string;
  message: string;
}

/**
 * Login operator CMS via backend API
 * Maps frontend roles ('Admin Utama'/'Staf Humas'/'OSIM') to backend roles ('Admin'/'Humas'/'OSIM')
 */
export const login = async (
  role: 'Admin Utama' | 'Staf Humas' | 'OSIM',
  password: string
): Promise<LoginResponse> => {
  // Map frontend role names to backend role names
  const roleMap: Record<string, string> = {
    'Admin Utama': 'Admin',
    'Staf Humas': 'Humas',
    'OSIM': 'OSIM',
  };

  const backendRole = roleMap[role] || role;

  const response = await api.post<LoginResponse>('/auth/login', {
    role: backendRole,
    password,
  });

  const { token, role: returnedRole } = response.data;

  // Store JWT token
  localStorage.setItem('man_lhokseumawe_jwt_token', token);
  localStorage.setItem('man_lhokseumawe_admin_auth', 'true');
  localStorage.setItem('man_lhokseumawe_admin_role', role);

  return response.data;
};

/**
 * Get stored JWT token
 */
export const getToken = (): string | null => {
  return localStorage.getItem('man_lhokseumawe_jwt_token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Logout — clear all auth data
 */
export const logout = (): void => {
  localStorage.removeItem('man_lhokseumawe_jwt_token');
  localStorage.removeItem('man_lhokseumawe_admin_auth');
  localStorage.removeItem('man_lhokseumawe_admin_role');
};

export default {
  login,
  getToken,
  isAuthenticated,
  logout,
};
