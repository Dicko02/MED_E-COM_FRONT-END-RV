import React, { useState, useEffect, useCallback } from 'react';
import { commandeApi } from '../api/Commande/commande.api';
import { Loading } from '../components/Complements/Loading';
import { Badge } from '../components/Complements/Badge';
import { useParams } from 'react-router-dom';


export const CommandeDetailPage: React.FC = () => {
  const { id: orderId } = useParams<{ id: string }>();// Récupérer l'ID de la commande depuis les paramètres d'URL
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = useCallback(async () => {
    setLoading(true);
    try {
      const data = await commandeApi.getById(orderId!);
      setOrder(data);
    } catch (error) {
      console.error('Erreur chargement commande:', error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
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
    const labels: any = {
      'pending': 'En attente',
      'confirmed': 'Confirmée',
      'processing': 'En préparation',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'cancelled': 'Annulée'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Loading size="lg" text="Chargement de la commande..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl font-light mb-6">Commande introuvable</h1>
        <a href="/commandes" className="text-gray-600 hover:text-gray-900 transition">
          ← Retour aux commandes
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <a href="/" className="hover:text-gray-900 transition">Accueil</a>
        <span>/</span>
        <a href="/commandes" className="hover:text-gray-900 transition">Mes commandes</a>
        <span>/</span>
        <span className="text-gray-900">#{order._id.slice(-8).toUpperCase()}</span>
      </div>

      {/* En-tête */}
      <div className="bg-white border border-gray-100 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-light mb-2">
              Commande #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-500">Passée le {formatDate(order.orderDate)}</p>
          </div>
          <Badge variant={getStatusColor(order.status)} size="lg">
            {getStatusLabel(order.status)}
          </Badge>
        </div>

        {/* Informations client */}
        {order.customerInfo && (
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-medium mb-3">Informations de livraison</h2>
            <div className="text-gray-600 space-y-1">
              <p><strong>Nom:</strong> {order.customerInfo.nom} {order.customerInfo.prenom}</p>
              <p><strong>Email:</strong> {order.customerInfo.email}</p>
              {order.customerInfo.number && (
                <p><strong>Téléphone:</strong> {order.customerInfo.number}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Produits */}
      <div className="bg-white border border-gray-100 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Produits commandés</h2>
        <div className="space-y-4">
          {order.products && order.products.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-6 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={item.produit?.image || '/placeholder.jpg'} 
                  alt={item.produit?.nom || 'Produit'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-lg">{item.produit?.nom || 'Produit'}</p>
                <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-lg">{((item.produit?.prix || 0) * item.quantity).toFixed(2)}€</p>
                <p className="text-sm text-gray-500">{(item.produit?.prix || 0).toFixed(2)}€ / unité</p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
          <span className="text-lg font-medium">Total</span>
          <span className="text-2xl font-medium">{order.totalAmount?.toFixed(2)}€</span>
        </div>
      </div>

      {/* Suivi */}
      {order.shippingDate && (
        <div className="bg-white border border-gray-100 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-3">Suivi de commande</h2>
          <p className="text-gray-600">
            <strong>Livraison prévue:</strong> {formatDate(order.shippingDate)}
          </p>
        </div>
      )}

      {/* Actions */}
      {order.status === 'pending' && (
        <div className="mt-6 text-center">
          <button
            onClick={async () => {
              if (confirm('Voulez-vous vraiment annuler cette commande ?')) {
                try {
                  await commandeApi.cancel(order._id);
                  alert('Commande annulée');
                  window.location.href = '/commandes';
                } catch (error) {
                  alert('Erreur lors de l\'annulation');
                  console.error('Erreur annulation commande:', error);
                }
              }
            }}
            className="text-red-600 hover:text-red-800 transition"
          >
            Annuler la commande
          </button>
        </div>
      )}
    </div>
  );
};