import { useState, useEffect, useCallback } from 'react';
import { ShoppingBag } from 'lucide-react';
import { commandeApi } from '../../api/Commande/commande.api';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Complements/Loading';
import { EmptyState } from '../../components/Complements/EmptyState';
import { Badge } from '../../components/Complements/Badge';

export const CommandesAdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const toast = useToast();

  // Stabilisation de loadOrders avec useCallback
  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await commandeApi.getAll();
      setOrders(data.orders); // <-- prendre le tableau orders
    } catch {
      toast.error('Erreur chargement commandes');
    } finally {
      setLoading(false);
    }
  }, [toast]);


  // Appel au montage
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await commandeApi.updateStatus(orderId, newStatus);
      toast.success('Statut mis à jour');
      loadOrders();
    } catch {
      toast.error('Erreur mise à jour statut');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: any = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      processing: 'En préparation',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  };

  const filteredOrders = statusFilter === 'all' ? orders : orders.filter((order: any) => order.status === statusFilter);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Loading size="lg" text="Chargement des commandes..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-light mb-8">Gestion des Commandes</h1>

      {/* Filtres */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {['all','pending','confirmed','processing','shipped','delivered','cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full transition ${
              statusFilter === status ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'Tous' : getStatusLabel(status)}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Aucune commande"
          description={statusFilter === 'all' 
            ? 'Aucune commande pour le moment' 
            : `Aucune commande avec le statut "${getStatusLabel(statusFilter)}"`} 
        />
      ) : (
        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order: any) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{order.customerInfo?.nom} {order.customerInfo?.prenom}</p>
                      <p className="text-sm text-gray-500">{order.customerInfo?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(order.orderDate)}</td>
                  <td className="px-6 py-4 font-medium">{order.totalAmount?.toFixed(2)}€</td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      aria-label={`Changer le statut de la commande #${order._id.slice(-8).toUpperCase()}`}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="px-3 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="processing">En préparation</option>
                      <option value="shipped">Expédiée</option>
                      <option value="delivered">Livrée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
