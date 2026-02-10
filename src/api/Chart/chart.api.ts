import { apiUsers } from '../apiUsers';

export const chartApi = {

  // obtenir le panier d'un client
  getCart: async (clientId: string) => {
    return apiUsers.request(`/chart/${clientId}`);
  },

  // obtenir le total du panier d'un client
  getTotal: async (clientId: string) => {
    return apiUsers.request(`/chart/${clientId}/total`);
  },

  // ajouter un produit au panier
  addToCart: async (clientId: string, productId: string, quantity: number) => {
    return apiUsers.request(`/chart/${clientId}`, {
      method: 'POST',
      body: { productId, quantity },
    });
  },

  // mettre à jour la quantité d'un produit dans le panier
  updateQuantity: async (clientId: string, productId: string, quantity: number) => {
    return apiUsers.request(`/chart/${clientId}/${productId}`, {
      method: 'PUT',
      body: { quantity },
    });
  },

  // supprimer un produit du panier
  removeFromCart: async (clientId: string, productId: string) => {
    return apiUsers.request(`/chart/${clientId}/${productId}`, {
      method: 'DELETE',
    });
  },

  // vider le panier d'un client
  clearCart: async (clientId: string) => {
    return apiUsers.request(`/chart/${clientId}`, {
      method: 'DELETE',
    });
  },
};