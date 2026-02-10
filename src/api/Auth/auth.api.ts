import { apiUsers } from '../apiUsers';

export const authApi = {

  login: async (email: string, password: string) => {
    return apiUsers.request('/users/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  register: async (data: any) => { 
    return apiUsers.request('/users/register', {
      method: 'POST',
      body: data,
    })
  },

  verifyCode: async (email: string, code: string) => { 
    return apiUsers.request(`/users/verify/${encodeURIComponent(email)}`, {
      method: 'POST',
      body: { code },
    });
  },

  logout: async () => { return apiUsers.request('/users/logout') },

  getMe: async () => { return apiUsers.request('/users/getMe') },
};
