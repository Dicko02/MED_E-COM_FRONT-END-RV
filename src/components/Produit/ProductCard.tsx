import React from 'react';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group">
      <a href={`/produits/${product._id}`}>
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img 
            src={product.image || '/placeholder.jpg'} 
            alt={product.nom}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
        <h3 className="font-medium text-gray-900 mb-1">{product.nom}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.categorie?.name || 'Non catégorisé'}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{product.prix}€</span>
            {product.ancienPrix && (
              <span className="text-sm text-gray-400 line-through">{product.ancienPrix}€</span>
            )}
          </div>
        </div>
      </a>
      <button 
        onClick={() => addToCart(product._id)}
        className="mt-3 w-full bg-black text-white py-2 rounded-full text-sm hover:bg-gray-800 transition"
      >
        Ajouter au panier
      </button>
    </div>
  );
};