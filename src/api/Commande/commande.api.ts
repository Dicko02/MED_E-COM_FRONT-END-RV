import { apiUsers } from '../apiUsers';

export const commandeApi = {

  // obtenir toutes les commandes
  getAll: async () => {
    return apiUsers.request('/orders/all');
  },

  // obtenir une commande par son ID
  getById: async (orderId: string) => {
    return apiUsers.request(`/orders/${orderId}`);
  },

  // obtenir les commandes d'un utilisateur par son email
  getByUser: async (email: string) => {
    return apiUsers.request(`/orders/user/${email}`);
  },

  // créer une nouvelle commande
  create: async (orderData: any) => {
    return apiUsers.request('/orders/create', {
      method: 'POST',
      body: orderData,
    });
  },

  // créer une commande à partir du panier
  createFromCart: async (orderData: any) => {
    alert('Creating order with data:'+ JSON.stringify(orderData));
    return apiUsers.request('/orders/cart/create', {
      method: 'POST',
      body: orderData,
    });
  },

  // mettre à jour le statut d'une commande
  updateStatus: async (orderId: string, status: string) => {
    return apiUsers.request(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: { status },
    });
  },

  // annuler une commande
  cancel: async (orderId: string) => {
    return apiUsers.request(`/orders/${orderId}/cancel`, {
      method: 'PUT',
    });
  },

  // obtenir les statistiques des commandes
  getStats: async () => {
    return apiUsers.request('/orders/stats/overview');
  },
};