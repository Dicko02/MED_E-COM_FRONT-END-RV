import { useState, useEffect } from 'react';
import { Package, ShoppingBag, Users, TrendingUp, Plus } from 'lucide-react';
import { commandeApi } from '../../api/Commande/commande.api';
import { userApi } from '../../api/User/user.api';
import { produitApi } from '../../api/Produit/produit.api';
import { StatCard } from '../../components/DashBoard/StatCard';

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });

  useEffect(() => {
    // Crée une fonction async à l'intérieur de l'effet
    const fetchStats = async () => {
      try {

        // Lancement parallèle des requêtes pour optimiser le temps de chargement
        const [orderStats, totalUsers, totalProducts] = await Promise.all([
          commandeApi.getStats(),
          userApi.total(),
          produitApi.getTotalProducts()
        ]);

        setStats({
          products: totalProducts.count || 0,
          orders: orderStats.stats.totalOrders || 0,
          users: totalUsers.count || 0,
          revenue: orderStats.stats.totalRevenue || 0
        });
      } catch (error) {
        console.error('Erreur chargement stats:', error);
      }
    };

    fetchStats(); // Appel de la fonction async
  }, []); // Dépendances vides = appelé une seule fois au montage

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-light mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={<Package />} title="Produits" value={stats.products} />
        <StatCard icon={<ShoppingBag />} title="Commandes" value={stats.orders} />
        <StatCard icon={<Users />} title="Utilisateurs" value={stats.users} />
        <StatCard icon={<TrendingUp />} title="Revenu" value={`${stats.revenue}€`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <h2 className="text-xl font-medium mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <a href="/admin/produits/nouveau" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <Plus className="inline w-5 h-5 mr-2" />
              Ajouter un produit
            </a>
            <a href="/admin/categories" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <Plus className="inline w-5 h-5 mr-2" />
              Gérer les catégories
            </a>
            <a href="/admin/commandes" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <ShoppingBag className="inline w-5 h-5 mr-2" />
              Voir les commandes
            </a>
            <a href="/admin/produits" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <Package className="inline w-5 h-5 mr-2" />
              Gérer les produits
            </a>
            <a href="/admin/clients" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <Users className="inline w-5 h-5 mr-2" />
              Gérer les clients
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
