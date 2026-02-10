import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface FormConnexionProps {
  onSuccess?: () => void;
}

export const FormConnexion: React.FC<FormConnexionProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await login(email, password, isAdmin);
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = isAdmin ? '/admin/dashboard' : '/';
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-600 mb-2">Email</label>
        <input
          aria-label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">Mot de passe</label>
        <input
          aria-label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isAdmin"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="isAdmin" className="text-sm text-gray-600">
          Connexion administrateur
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </div>
  );
};