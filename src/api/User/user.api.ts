import { apiUsers } from '../apiUsers';

export const userApi = {

  getAll : async () => {
    return apiUsers.request('/users')
  },

  getOne: async (id: string) => {
    return apiUsers.request(`/users/${id}`)
  },

  update: async (id: string, data: any) => {
    return apiUsers.request(`/users/${id}`, 
      {
        method: 'PUT',
        body: data,
      }
    )
  },

  delete: async (id: string) => {
    return apiUsers.request(`/users/${id}`,
      {
        method: 'DELETE',
      }
    )
  },

  total : async () => { return apiUsers.request('/users/statistiques/total-users') }

};
