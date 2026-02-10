import { useState, useEffect } from 'react';
import { produitApi } from '../api/Produit/produit.api';
import { ProductCard } from '../components/Produit/ProductCard';

export const AccueilPage = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    // Définir une fonction asynchrone à l'intérieur de l'effet
    const fetchProducts = async () => {
      try {
        const [newData, popularData] = await Promise.all([
          produitApi.getNew(),
          produitApi.getPopular()
        ]);
        setNewProducts(newData.slice(0, 4)); // Affiche les 4 premiers produits
        setPopularProducts(popularData.slice(0, 4));
      } catch (error) {
        console.error('Erreur chargement produits:', error);
      }
    };

    fetchProducts(); // Appel de la fonction asynchrone
  }, []); // ne dépend de rien

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-light tracking-tight text-gray-900 mb-6">
            Découvrez notre collection
          </h1>
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
            Des produits sélectionnés avec soin pour vous offrir le meilleur
          </p>
          <a href="/produits" className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
            Explorer
          </a>
        </div>
      </section>

      {/* Nouveaux produits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-light mb-8">Nouveautés</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {newProducts.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Produits populaires */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-light mb-8">Populaires</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {popularProducts.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
