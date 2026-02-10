import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../api/Auth/auth.api';

// Définition du type User
interface User {
  _id: string;
  email: string;
  nom?: string;
  prenom?: string;
  role: 'admin' | 'client';
}

// Définition du contexte d'authentification
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (data: any) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Vérification de l'authentification (supporte un token forcé pour le login)
  const checkAuth = async (forcedToken?: string) => {
    setLoading(true);
    const token = forcedToken || localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const me = await authApi.getMe();
      setUser(me);
    } catch (err: any) {
      console.error("Auth check failed:", err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false); // Arrête le chargement quoi qu'il arrive
    }
  };

  // 2. IMPORTANT : Lancer checkAuth au montage de l'application
  useEffect(() => {
    checkAuth();
  }, []);

  // 3. Connexion (passe le token directement pour éviter les délais du localStorage)
  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login(email, password);
      if (data?.token) {
        localStorage.setItem("token", data.token);
        await checkAuth(data.token);
      }
      return data?.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // 4. Inscription
  const register = async (data: any) => {
    await authApi.register(data);
  };

  // 5. Vérification du code
  const verifyCode = async (email: string, code: string) => {
    const data = await authApi.verifyCode(email, code);
    if (data?.token) {
      localStorage.setItem('token', data.token);
      await checkAuth(data.token);
    }
  };

  // 6. Déconnexion
  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore erreur backend
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      window.location.href = '/connexion';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyCode, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};