import { apiUsers } from '../apiUsers';

export const categorieApi = {

  // obtenir toutes les catégories
  getAll: async () => {
    return apiUsers.request('/category/viewAllCategory');
  },

  // obtenir une catégorie par son ID
  getById: async (id: string) => {
    return apiUsers.request(`/category/viewOneCategory/${id}`);
  },

  // créer une nouvelle catégorie
  create: async (name: string) => {
    return apiUsers.request('/category/createNewCategory', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  // mettre à jour une catégorie existante
  update: async (id: string, name: string) => {
    return apiUsers.request(`/category/updateOneCategory/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  },

  // supprimer une catégorie
  delete: async (id: string) => {
    return apiUsers.request(`/category/deleteOneCategory/${id}`, {
      method: 'DELETE',
    });
  },
};