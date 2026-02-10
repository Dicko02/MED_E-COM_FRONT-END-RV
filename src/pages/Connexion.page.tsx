import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const ConnexionPage = () => {
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
      const user = await login(email, password);
      if (user?.role == 'admin') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-light text-center mb-8">Connexion</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-600 mb-2" htmlFor='email'>Email</label>
            <input
              aria-label='email'
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2" htmlFor='password'>Mot de passe</label>
            <input
              aria-label='password'
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
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

        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ?{' '}
          <a href="/inscription" className="text-gray-900 hover:underline">
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  );
};