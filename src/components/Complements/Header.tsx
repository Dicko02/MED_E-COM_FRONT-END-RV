import { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center space-x-6">
            <a href="/panier" className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </a>
            
            {user ? (
              <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">
                Déconnexion
              </button>
            ) : (
              <a href="/connexion" className="text-sm text-gray-600 hover:text-gray-900">
                Connexion
              </a>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 pb-4">
          <a href="/" className="block px-4 py-2 text-gray-600">Accueil</a>
          <a href="/produits" className="block px-4 py-2 text-gray-600">Produits</a>
          {user?.role === 'admin' && (
            <a href="/admin/dashboard" className="block px-4 py-2 text-gray-600">Dashboard</a>
          )}
        </div>
      )}
    </header>
  );
};