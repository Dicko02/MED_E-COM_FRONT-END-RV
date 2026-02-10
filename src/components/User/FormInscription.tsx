import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface FormInscriptionProps {
  onSuccess?: () => void;
}

export const FormInscription: React.FC<FormInscriptionProps> = ({ onSuccess }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    number: '',
    code: ''
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!formData.nom || !formData.prenom || !formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        number: formData.number,
        code: formData.code
      };

      await register(userData, isAdmin);
      setSuccess('Inscription réussie ! Un email de vérification a été envoyé.');
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.href = '/connexion';
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg text-sm">
          {success}
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-600 mb-2">Nom *</label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Votre nom"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">Prénom *</label>
        <input
          type="text"
          name="prenom"
          value={formData.prenom}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Votre prénom"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="votre@email.com"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">Téléphone</label>
        <input
          type="tel"
          name="number"
          value={formData.number}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="+221 XX XXX XX XX"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">Code (optionnel)</label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Code promotionnel"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">Mot de passe *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">Confirmer le mot de passe *</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="••••••••"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isAdminRegister"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="isAdminRegister" className="text-sm text-gray-600">
          Inscription en tant qu'administrateur
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Inscription en cours...' : 'S\'inscrire'}
      </button>
    </div>
  );
};