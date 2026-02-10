import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loading } from "../components/Complements/Loading";

interface PrivateRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export const PrivateRoute = ({ children, adminOnly = false }: PrivateRouteProps) => {
  const { user, loading } = useAuth();

  // Affiche l'état dans la console pour débugger
  console.log(`[PrivateRoute] Loading: ${loading}, User: ${user?.email || 'Aucun'}`);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Vérification de vos accès..." />
      </div>
    );
  }

  // Si pas de chargement et pas d'utilisateur -> Direction Connexion
  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  // Si admin requis mais utilisateur n'est pas admin
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
