import React, { useState, useEffect, useCallback } from 'react';
import { produitApi } from '../../api/Produit/produit.api';
import { categorieApi } from '../../api/Categorie/categorie.api';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/Complements/Card';
import { Button } from '../../components/Complements/Button';
import { Loading } from '../../components/Complements/Loading';
import { useParams } from 'react-router-dom';


export const EditProduitPage: React.FC = () => {
  const { id: productId } = useParams<{ id: string }>(); // Récupérer l'ID du produit depuis les paramètres d'URL
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    categorie: '',
    prix: '',
    ancienPrix: '',
    nombreDisponible: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  // Charger les catégories
  const loadCategories = useCallback(async () => {
    try {
      const data = await categorieApi.getAll();
      setCategories(data);
    } catch {
      toast.error('Erreur chargement catégories');
    }
  }, [toast]);

  // Charger le produit
  const loadProduct = useCallback(async () => {
    try {
      console.log('Loading product with ID:', productId);
      const data = await produitApi.getById(productId!);
      setFormData({
        nom: data.nom || '',
        description: data.description || '',
        categorie: data.categorie?._id || '',
        prix: data.prix || '',
        ancienPrix: data.ancienPrix || '',
        nombreDisponible: data.nombreDisponible || '',
      });
      setImagePreview(data.image || '');
    } catch {
      toast.error('Erreur chargement produit');
    } finally {
      setLoading(false);
    }
  }, [productId, toast]);

  // Effet pour charger les données au montage
  useEffect(() => {
    loadCategories();
    loadProduct();
  }, [loadCategories, loadProduct]);

  // Gestion des changements de formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!formData.nom || !formData.prix || !formData.categorie) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSaving(true);
    try {
      let imageUrl = imagePreview;

      if (imageFile) {
        const uploadResult = await produitApi.uploadImage(imageFile);
        //alert('Image uploaded, URL:' + uploadResult.imageUrl);
        imageUrl = uploadResult.imageUrl;
      }

      const productData = {
        ...formData,
        image: imageUrl,
        prix: parseFloat(formData.prix),
        ancienPrix: formData.ancienPrix ? parseFloat(formData.ancienPrix) : undefined,
        nombreDisponible: parseInt(formData.nombreDisponible) || 0,
      };

      await produitApi.update(productId!, productData);
      toast.success('Produit modifié');
      window.location.href = '/admin/produits';
    } catch {
      toast.error('Erreur lors de la modification');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Loading size="lg" text="Chargement du produit..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-light mb-8">Modifier le produit</h1>

      <Card>
        <div className="space-y-6">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image du produit</label>
            {imagePreview && (
              <div className="mb-4 w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              aria-label="Télécharger une image du produit"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
            <input
              aria-label="Nom du produit"
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              aria-label="Description du produit"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
            <select
              aria-label="Catégorie du produit"
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Prix */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prix *</label>
              <input
                aria-label="Prix du produit"
                type="number"
                step="0.01"
                name="prix"
                value={formData.prix}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ancien prix</label>
              <input
                aria-label="Ancien prix du produit"
                type="number"
                step="0.01"
                name="ancienPrix"
                value={formData.ancienPrix}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock disponible</label>
            <input
              aria-label="Nombre de produits disponibles"
              type="number"
              name="nombreDisponible"
              value={formData.nombreDisponible}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-6">
            <Button variant="outline" onClick={() => window.history.back()} fullWidth>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={saving} fullWidth>
              {saving ? 'Enregistrement...' : 'Modifier'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
