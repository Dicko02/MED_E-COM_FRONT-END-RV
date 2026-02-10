import { apiUsers } from '../apiUsers';

export const produitApi = {
  // Afficher tous les produits
  getAll: async (params?: { page?: number; limit?: number }) => {
    const qs = params ? `?page=${params.page || 1}&limit=${params.limit || 12}` : '';
    return apiUsers.request(`/produits/getAllProduits${qs}`);
  },

  // Obtenir un produit par ID
  getById: async (id: string) => {
    return apiUsers.request(`/produits/getProduit/${id}`);
  },

  // Recherche
  search: async (options: { q?: string } = {}) => {
    const qp: string[] = [];
    if (options.q) qp.push(`search=${encodeURIComponent(options.q)}`);
    const qs = qp.length ? `?${qp.join('&')}` : '';
    return apiUsers.request(`/produits/search${qs}`);
  },

  // Produits populaires
  getPopular: async (limit = 10) => {
    return apiUsers.request(`/produits/popular?limit=${limit}`); // Endpoint pour les produits populaires, avec une limite par défaut de 10
  },

  // Nouveaux produits
  getNew: async (limit = 10) => {
    return apiUsers.request(`/produits/new?limit=${limit}`); // Endpoint pour les nouveaux produits, avec une limite par défaut de 10
  },

  // Produits par catégorie
  getByCategory: async (categoryId: string, options?: { page?: number; limit?: number }) => {
    const qs = options ? `?page=${options.page || 1}&limit=${options.limit || 12}` : '';
    return apiUsers.request(`/produits/category/${categoryId}${qs}`);
  },

  // Ajouter un produit
  create: async (productData: any) => {
    return apiUsers.request('/produits/addProduit', {
      method: 'POST',
      body: productData,
    });
  },

  // Modifier un produit
  update: async (id: string, productData: any) => {
    return apiUsers.request(`/produits/updateProduit/${id}`, {
      method: 'PUT',
      body: productData,
    });
  },

  // Supprimer un produit
  delete: async (id: string) => {
    return apiUsers.request(`/produits/deleteProduit/${id}`, {
      method: 'DELETE',
    });
  },

  // Upload image
  uploadImage: async (file: File) => {
    return apiUsers.uploadImage(file);
  },

  // obtenir le nombre total de produits
  getTotalProducts: async () => {
    return apiUsers.request('/produits/statistiques/total-products');
  },
};
