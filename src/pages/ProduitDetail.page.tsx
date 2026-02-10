import React, { useState, useEffect, useCallback } from 'react';
import { Package, ShoppingBag } from 'lucide-react';
import { produitApi } from '../api/Produit/produit.api';
import { useCart } from '../context/CartContext';
import { Loading } from '../components/Complements/Loading';
import { useParams } from 'react-router-dom';

export const ProduitDetailPage: React.FC = () => {

  const { id: productId } = useParams<{ id: string }>();// Récupérer l'ID du produit depuis les paramètres d'URL
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // ---- Solution propre : on mémorise loadProduct ----
  const loadProduct = useCallback(async () => {
    setLoading(true);
    try {
      const data = await produitApi.getById(productId!);
      setProduct(data);
    } catch (error) {
      console.error('Erreur chargement produit:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // ---- Plus d'erreur car loadProduct est stable ----
  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity);
      console.log('Produit ajouté au panier !');
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      alert("Erreur lors de l'ajout au panier");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Loading size="lg" text="Chargement du produit..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl font-light mb-6">Produit introuvable</h1>
        <a href="/produits" className="text-gray-600 hover:text-gray-900 transition">
          ← Retour aux produits
        </a>
      </div>
    );
  }

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const discount = product.ancienPrix ? Math.round(((product.ancienPrix - product.prix) / product.ancienPrix) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <a href="/" className="hover:text-gray-900 transition">Accueil</a>
        <span>/</span>
        <a href="/produits" className="hover:text-gray-900 transition">Produits</a>
        <span>/</span>
        <span className="text-gray-900">{product.nom}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Galerie d'images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img 
              src={allImages[selectedImage] || '/placeholder.jpg'} 
              alt={product.nom}
              className="w-full h-full object-cover"
            />
          </div>

          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {allImages.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`${product.nom} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informations produit */}
        <div>
          {product.categorie?.name && (
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full mb-4">
              {product.categorie.name}
            </span>
          )}

          <h1 className="text-4xl font-light mb-4">{product.nom}</h1>

          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-medium">{product.prix}€</span>
            {product.ancienPrix && (
              <>
                <span className="text-xl text-gray-400 line-through">{product.ancienPrix}€</span>
                <span className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded-full">-{discount}%</span>
              </>
            )}
          </div>

          <div className="mb-6">
            {product.nombreDisponible > 0 ? (
              <p className="text-green-600 text-sm">
                ✓ En stock ({product.nombreDisponible} disponible{product.nombreDisponible > 1 ? 's' : ''})
              </p>
            ) : (
              <p className="text-red-600 text-sm">✗ Rupture de stock</p>
            )}
          </div>

          {product.description && (
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Quantité</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.nombreDisponible, quantity + 1))}
                disabled={quantity >= product.nombreDisponible}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={product.nombreDisponible === 0}
              className="w-full bg-black text-white py-4 rounded-full hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.nombreDisponible === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
            </button>
            
            <a 
              href="/panier"
              className="block w-full text-center border border-gray-200 text-gray-900 py-4 rounded-full hover:bg-gray-50 transition"
            >
              Voir le panier
            </a>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>Livraison gratuite</span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Retour sous 30 jours</span>
            </div>
          </div>
          </div>
      </div>
    </div>
  );
};