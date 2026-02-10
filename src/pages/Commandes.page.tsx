import { useState, useEffect, useCallback } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { commandeApi } from '../api/Commande/commande.api';
import { Loading } from '../components/Complements/Loading';
import { Badge } from '../components/Complements/Badge';

export const CommandesPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ---- stable loadOrders ----
  const loadOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await commandeApi.getByUser(user.email);
      //console.log('COMMANDES API =', data);
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user]);


  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'warning',
      'confirmed': 'info',
      'processing': 'info',
      'shipped': 'primary',
      'delivered': 'success',
      'cancelled': 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'En attente',
      'confirmed': 'Confirmée',
      'processing': 'En préparation',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'cancelled': 'Annulée'
    };
    return labels[status] || status;
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl font-light mb-6">Mes Commandes</h1>
        <p className="text-gray-500 mb-8">Veuillez vous connecter pour voir vos commandes</p>
        <a href="/connexion" className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
          Se connecter
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Loading size="lg" text="Chargement des commandes..." />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl font-light mb-6">Mes Commandes</h1>
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 mb-8">Vous n'avez pas encore passé de commande</p>
        <a href="/produits" className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
          Découvrir nos produits
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-light mb-8">Mes Commandes</h1>

      <div className="space-y-6">
        {Array.isArray(orders) && orders.map((order: any) => (
          <div key={order._id} className="bg-white border border-gray-100 rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium mb-1">
                  Commande #{order._id.slice(-8).toUpperCase()}
                </h3>
                <p className="text-sm text-gray-500">
                  Passée le {formatDate(order.orderDate)}
                </p>
              </div>
              <div className="mt-3 md:mt-0 flex items-center space-x-3">
                <Badge variant={getStatusColor(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
                <span className="text-lg font-medium">{order.totalAmount?.toFixed(2)}€</span>
              </div>
            </div>

            {/* Produits de la commande */}
            {order.products && order.products.length > 0 && (
              <div className="border-t border-gray-100 pt-4 space-y-3">
                {order.products.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.produit?.image || '/placeholder.jpg'} 
                        alt={item.produit?.nom || 'Produit'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.produit?.nom || 'Produit'}</p>
                      <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{((item.produit?.prix || 0) * item.quantity).toFixed(2)}€</p>
                  </div>
                ))}
              </div>
            )}

            {/* Informations de livraison */}
            {order.shippingDate && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  <strong>Livraison prévue:</strong> {formatDate(order.shippingDate)}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex gap-3">
              <a 
                href={`/commandes/${order._id}`}
                className="text-sm text-gray-600 hover:text-gray-900 transition"
              >
                Voir les détails →
              </a>
              {order.status === 'pending' && (
                <button
                  onClick={async () => {
                    if (confirm('Voulez-vous vraiment annuler cette commande ?')) {
                      try {
                        await commandeApi.cancel(order._id);
                        loadOrders();
                        alert('Commande annulée');
                      } catch (error) {
                        alert('Erreur lors de l\'annulation');
                      }
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-800 transition"
                >
                  Annuler la commande
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
