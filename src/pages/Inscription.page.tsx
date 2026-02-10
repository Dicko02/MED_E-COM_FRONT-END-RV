import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const InscriptionPage = () => {
  const { register, verifyCode } = useAuth();
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    number: '',
    code: '',
    role: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
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

  // ÉTAPE 1 : Inscription
  const handleSubmitForm = async () => {
    setError('');
    setSuccess('');

    // Validation
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
        code: formData.code,
        role: isAdmin ? 'admin' : 'client'
      };

      await register(userData);
      setSuccess('Un code de vérification a été envoyé à votre email !');
      setStep('verify'); // Passer à l'étape de vérification
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  // ÉTAPE 2 : Vérification du code
  const handleVerifyCode = async () => {
    setError('');
    setLoading(true);

    try {
      await verifyCode(formData.email, verificationCode);
      alert('Vous allez être redirigé.');
      setSuccess('Inscription validée ! Redirection...');
      
      setTimeout(() => {
        window.location.href = isAdmin ? '/admin/dashboard' : '/';
      }, 1500);
    } catch {
      setError('Code incorrect. Votre compte a été supprimé. Veuillez vous réinscrire.');
      setTimeout(() => {
        setStep('form');
        setVerificationCode('');
        setError('');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-light text-center mb-8">
          {step === 'form' ? 'Inscription' : 'Vérification'}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 text-sm">
            {success}
          </div>
        )}

        {step === 'form' ? (
          // FORMULAIRE D'INSCRIPTION
          <div className="space-y-5">
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
              <label className="block text-sm text-gray-600 mb-2">Code promotionnel (optionnel)</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Code promo"
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
              onClick={handleSubmitForm}
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
          </div>
        ) : (
          // FORMULAIRE DE VÉRIFICATION
          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-gray-600">
                Un code à 6 chiffres a été envoyé à <strong>{formData.email}</strong>
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2 text-center">
                Entrez le code de vérification
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-center text-2xl tracking-widest"
                placeholder="000000"
              />
            </div>

            <button
              onClick={handleVerifyCode}
              disabled={loading || verificationCode.length !== 6}
              className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Vérification...' : 'Vérifier'}
            </button>

            <button
              onClick={() => setStep('form')}
              className="w-full text-gray-600 text-sm hover:text-gray-900"
            >
              ← Retour au formulaire
            </button>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Vous avez déjà un compte ?{' '}
          <a href="/connexion" className="text-gray-900 hover:underline">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
};