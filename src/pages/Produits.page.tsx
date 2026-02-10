import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { produitApi } from '../api/Produit/produit.api';
import { categorieApi } from '../api/Categorie/categorie.api';
import { ProductCard } from '../components/Produit/ProductCard';

export const ProduitsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');


  // Charger tous les produits
  const loadProducts = async () => {
    try {
      const data = await produitApi.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    }
  };

  // Charger toutes les catégories
  const loadCategories = async () => {
    try {
      const data = await categorieApi?.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
    }
  };

  // Gérer la recherche
  const handleSearch = async () => {
    if (!searchQuery) {
      loadProducts();
      return;
    }
    try {
      const data = await produitApi.search({ q: searchQuery });
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      console.error('Erreur recherche:', error);
    }
  };

  // Filtrer par catégorie
  const filterByCategory = async (categoryId: string | null) => {
    setSelectedCategory(categoryId);

    if (!categoryId) {
      loadProducts();
      return;
    }

    try {
      const data = await produitApi.getByCategory(categoryId);
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      console.error('Erreur filtrage:', error);
    }
  };


  // Charger produits et catégories au montage
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-light mb-8">Nos Produits</h1>

      {/* Barre de recherche */}
      <div className="mb-8 flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <Search className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800"
        >
          Rechercher
        </button>
      </div>

      {/* Filtres catégories */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => filterByCategory(null)}
          className={`px-4 py-2 rounded-full transition ${
            !selectedCategory
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Tous
        </button>

        {categories.map((cat: any) => (
          <button
            key={cat._id}
            onClick={() => filterByCategory(cat._id)}
            className={`px-4 py-2 rounded-full transition ${
              selectedCategory === cat._id
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grille produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Aucun produit trouvé
        </div>
      )}
    </div>
  );
};
