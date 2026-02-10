import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { produitApi } from '../../api/Produit/produit.api';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Complements/Loading';
import { EmptyState } from '../../components/Complements/EmptyState';
import { ConfirmDialog } from '../../components/Complements/ConfirmDialog';
import { Badge } from '../../components/Complements/Badge';

export const ProduitsAdminPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);
  const toast = useToast();

  useEffect(() => {
    // ✅ Déclarer la fonction à l'intérieur pour éviter le warning de dépendances
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await produitApi.getAll();
        setProducts(data);
      } catch {
        toast.error('Erreur chargement produits');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [toast]); // toast peut être ajouté dans les dépendances

  const handleDelete = async (id: string) => {
    try {
      await produitApi.delete(id);
      toast.success('Produit supprimé');
      // Recharger la liste après suppression
      const data = await produitApi.getAll();
      setProducts(data);
    } catch {
      toast.error('Erreur suppression');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Loading size="lg" text="Chargement des produits..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-light">Gestion des Produits</h1>
        <a href="/admin/produits/nouveau" className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nouveau produit
        </a>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Aucun produit"
          description="Commencez par ajouter votre premier produit"
          actionText="Ajouter un produit"
          actionHref="/admin/produits/nouveau"
        />
      ) : (
        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ancien Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product: any) => (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                      <img src={product.image || '/placeholder.jpg'} alt={product.nom} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{product.nom ? product.nom : 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-600">{product.categorie?.name || 'N/A'}</td>
                  <td className="px-6 py-4 font-medium">{product.prix ? `${product.prix}€` : 'N/A'}</td>
                  <td className="px-6 py-4 font-medium">{product.ancienPrix ? `${product.ancienPrix}€` : 'N/A'}</td>
                  <td className="px-6 py-4">
                    <Badge variant={product.nombreDisponible > 0 ? 'success' : 'error'}>
                      {product.nombreDisponible}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <a aria-label={`Modifier le produit ${product.nom}`} href={`/admin/produits/modifier/${product._id}`} className="text-blue-600 hover:text-blue-800">
                        <Edit2 className="w-5 h-5" />
                      </a>
                      <button aria-label={`Supprimer le produit ${product.nom}`} onClick={() => setDeleteConfirm(product)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm._id)}
        title="Supprimer le produit ?"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteConfirm?.nom}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        type="danger"
      />
    </div>
  );
};
