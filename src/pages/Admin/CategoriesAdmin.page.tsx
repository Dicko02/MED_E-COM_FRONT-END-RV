import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { categorieApi } from '../../api/Categorie/categorie.api';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Complements/Loading';
import { EmptyState } from '../../components/Complements/EmptyState';
import { Modal } from '../../components/Complements/Modal';
import { ConfirmDialog } from '../../components/Complements/ConfirmDialog';
import { Card } from '../../components/Complements/Card';
import { Button } from '../../components/Complements/Button';

export const CategoriesAdminPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<any>(null);
  const [categoryName, setCategoryName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);
  const toast = useToast();

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categorieApi.getAll();
      setCategories(data);
    } catch {
      toast.error('Erreur chargement catégories');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleSave = async () => {
    if (!categoryName.trim()) {
      toast.error('Le nom est requis');
      return;
    }

    try {
      if (editCategory) {
        await categorieApi.update(editCategory._id, categoryName);
        toast.success('Catégorie modifiée');
      } else {
        await categorieApi.create(categoryName);
        toast.success('Catégorie créée');
      }
      setModalOpen(false);
      setCategoryName('');
      setEditCategory(null);
      loadCategories();
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categorieApi.delete(id);
      toast.success('Catégorie supprimée');
      loadCategories();
    } catch {
      toast.error('Erreur suppression');
    }
  };

  const openEditModal = (category: any) => {
    setEditCategory(category);
    setCategoryName(category.name);
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditCategory(null);
    setCategoryName('');
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Loading size="lg" text="Chargement des catégories..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-light">Gestion des Catégories</h1>
        <Button onClick={openCreateModal}>
          <Plus className="w-5 h-5 inline mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          title="Aucune catégorie"
          description="Commencez par ajouter votre première catégorie"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: any) => (
            <Card key={category._id} hover>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-medium">{category.name}</h3>
                <div className="flex gap-2">
                  <button
                    aria-label="Modifier catégorie"
                    onClick={() => openEditModal(category)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    aria-label="Supprimer catégorie"
                    onClick={() => setDeleteConfirm(category)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la catégorie
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Ex: Électronique"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)} fullWidth>
              Annuler
            </Button>
            <Button onClick={handleSave} fullWidth>
              {editCategory ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm._id)}
        title="Supprimer la catégorie ?"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteConfirm?.name}" ?`}
        confirmText="Supprimer"
        type="danger"
      />
    </div>
  );
};
