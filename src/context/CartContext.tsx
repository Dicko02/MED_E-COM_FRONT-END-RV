import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { chartApi } from '../api/Chart/chart.api';
import { useAuth } from './AuthContext';

interface CartItem {
  product: any;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  totalPrice: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { user } = useAuth();
  
  // 1. Extraire l'ID de manière stable
  const clientId = user?._id;

  // 2. loadCart stabilisé avec useCallback
  const loadCart = useCallback(async () => {
    if (!clientId) return;

    try {
      // On lance les deux appels en parallèle pour plus de rapidité (comme pour le dashboard)
      const [cartData, totalData] = await Promise.all([
        chartApi.getCart(clientId),
        chartApi.getTotal(clientId)
      ]);
      
      setCart(cartData.products || []);
      setTotalPrice(totalData.totalPrice || 0);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
    }
  }, [clientId]); // Dépend uniquement de clientId

  // 3. Effet de chargement initial
  useEffect(() => {
    if (clientId) {
      loadCart();
    } else {
      // Si l'utilisateur se déconnecte, on vide l'état local du panier
      setCart([]);
      setTotalPrice(0);
    }
  }, [clientId, loadCart]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) {
      alert('Veuillez vous connecter');
      return;
    }
    if (!clientId) return;
    
    try {
      await chartApi.addToCart(clientId, productId, quantity); 
      await loadCart();
    } catch (error) {
      console.error('Erreur ajout panier:', error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!clientId) return;
    try {
      await chartApi.updateQuantity(clientId, productId, quantity); 
      await loadCart();
    } catch (error) {
      console.error('Erreur mise à jour panier:', error);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!clientId) return;
    try {
      await chartApi.removeFromCart(clientId, productId); 
      await loadCart();
    } catch (error) {
      console.error('Erreur suppression panier:', error);
    }
  };

  const clearCart = async () => {
    if (!clientId) return;
    try {
      await chartApi.clearCart(clientId); 
      setCart([]);
      setTotalPrice(0); // Correction ici : c'était setTotal(0)
    } catch (error) {
      console.error('Erreur vidage panier:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, totalPrice, addToCart, updateQuantity, removeFromCart, clearCart, loadCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};