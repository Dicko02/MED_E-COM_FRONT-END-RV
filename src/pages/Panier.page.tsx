import { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { commandeApi } from '../api/Commande/commande.api';

export const PanierPage = () => {
  const { cart, totalPrice, updateQuantity, removeFromCart, clearCart, loadCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Charger le panier au montage et à chaque changement d'utilisateur
  useEffect(() => {
    if (user) {
      loadCart();
    }
    // On ne met que user en dépendance
  }, [user]);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Votre panier est vide');
      return;
    }
    
    setLoading(true);
    try {
      const orderData = {
        clientId: user?._id,
        cartItems: cart,
        customerInfo: {
          nom: user?.nom,
          prenom: user?.prenom,
          email: user?.email,
          number: user?.number,
        },
        totalAmount: totalPrice
      };

      alert('Données de la commande:'+ JSON.stringify(orderData));

      await commandeApi.createFromCart(orderData);
      await clearCart();
      alert('Commande créée avec succès !');
      window.location.href = '/commandes';
    } catch (error) {
      console.error('Erreur création commande:', error);
      alert('Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl font-light mb-6">Panier</h1>
        <p className="text-gray-500 mb-8">Veuillez vous connecter pour voir votre panier</p>
        <a href="/connexion" className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
          Se connecter
        </a>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl font-light mb-6">Panier</h1>
        <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 mb-8">Votre panier est vide</p>
        <a href="/produits" className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
          Continuer vos achats
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-light mb-8">Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des produits */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item: any) => (
            <div key={item.product._id} className="bg-white border border-gray-100 rounded-lg p-6 flex gap-6">
              {/* Image produit */}
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={item.product.image || '/placeholder.jpg'} 
                  alt={item.product.nom}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Détails produit */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-lg">{item.product.nom}</h3>
                    <p className="text-sm text-gray-500">{item.product.categorie?.name}</p>
                  </div>
                  <button
                    aria-label="button de details d'un produit"
                    onClick={() => removeFromCart(item.product._id)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantité */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Prix */}
                  <div className="text-right">
                    <p className="font-medium text-lg">{(item.product.prix * item.quantity).toFixed(2)}€</p>
                    <p className="text-sm text-gray-500">{item.product.prix}€ / unité</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Récapitulatif */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-medium mb-6">Récapitulatif</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total </span>
                <span>{totalPrice.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison </span>
                <span>Gratuite</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-medium">
                <span>Total </span>
                <span>{totalPrice.toFixed(2)}€</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            >
              {loading ? 'Traitement...' : 'Valider la commande'}
            </button>

            <button
              onClick={clearCart}
              className="w-full border border-gray-200 text-gray-600 py-3 rounded-full hover:bg-gray-50 transition"
            >
              Vider le panier
            </button>

            <div className="mt-6 text-center">
              <a href="/produits" className="text-sm text-gray-500 hover:text-gray-900 transition">
                ← Continuer mes achats
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};