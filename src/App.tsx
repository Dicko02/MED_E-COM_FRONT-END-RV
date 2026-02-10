import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";

import { Header } from "./components/Complements/Header";
import { Footer } from "./components/Complements/Footer";
import { PrivateRoute } from "./utils/PrivateRoute";

// Pages Client
import { AccueilPage } from "./pages/Accueil.page";
import { ConnexionPage } from "./pages/Connexion.page";
import { InscriptionPage } from "./pages/Inscription.page";
import { ProduitsPage } from "./pages/Produits.page";
import { ProduitDetailPage } from "./pages/ProduitDetail.page";
import { PanierPage } from "./pages/Panier.page";
import { CommandesPage } from "./pages/Commandes.page";
import { CommandeDetailPage } from "./pages/CommandeDetail.page";

// Pages Admin
import { DashboardPage } from "./pages/Admin/Dashboard.page";
import { ProduitsAdminPage } from "./pages/Admin/ProduitsAdmin.page";
import { CreateProduitPage } from "./pages/Admin/CreateProduit.page";
import { EditProduitPage } from "./pages/Admin/EditProduit.page";
import { CategoriesAdminPage } from "./pages/Admin/CategoriesAdmin.page";
import { CommandesAdminPage } from "./pages/Admin/CommandesAdmin.page";
import { ClientsAdminPage } from "./pages/Admin/ClientsAdmin.page";

const App = () => {

  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-white">
              <Header />

              <main>
                <Routes>
                  {/* Public */}
                  <Route path="/connexion" element={<ConnexionPage />} />
                  <Route path="/inscription" element={<InscriptionPage />} />

                  {/* Client */}
                  <Route
                    path="/"
                    element={<AccueilPage />}
                  />

                  <Route
                    path="/produits"
                    element={<ProduitsPage />}
                  />
                  <Route
                    path="/produits/:id"
                    element={<ProduitDetailPage />}
                  />

                  <Route
                    path="/panier"
                    element={<PrivateRoute><PanierPage /></PrivateRoute>}
                  />

                  <Route
                    path="/commandes"
                    element={<PrivateRoute><CommandesPage /></PrivateRoute>}
                  />
                  <Route
                    path="/commandes/:id"
                    element={<PrivateRoute><CommandeDetailPage /></PrivateRoute>}
                  />

                  {/* Admin */}
                  <Route
                    path="/admin/dashboard"
                    element={<PrivateRoute adminOnly><DashboardPage /></PrivateRoute>}
                  />

                  <Route
                    path="/admin/produits"
                    element={<PrivateRoute adminOnly><ProduitsAdminPage /></PrivateRoute>}
                  />
                  <Route
                    path="/admin/produits/nouveau"
                    element={<PrivateRoute adminOnly><CreateProduitPage /></PrivateRoute>}
                  />

                  <Route
                    path="/admin/categories"
                    element={<PrivateRoute adminOnly><CategoriesAdminPage /></PrivateRoute>}
                  />

                  <Route
                    path="/admin/commandes"
                    element={<PrivateRoute adminOnly><CommandesAdminPage /></PrivateRoute>}
                  />

                  <Route
                    path="/admin/clients"
                    element={<PrivateRoute adminOnly><ClientsAdminPage /></PrivateRoute>}
                  />

                  <Route
                    path="/admin/produits/modifier/:id"
                    element={<PrivateRoute adminOnly><EditProduitPage /></PrivateRoute>}
                  />

                  {/* 404 */}
                  <Route
                    path="*"
                    element={
                      <div className="text-center py-20">
                        <h1 className="text-4xl font-light mb-4">404</h1>
                        <p className="text-gray-500 mb-8">Page introuvable</p>
                        <a href="/" className="text-gray-900 hover:underline">
                          ← Retour à l'accueil
                        </a>
                      </div>
                    }
                  />
                </Routes>
              </main>

              <Footer />
            </div>
          </BrowserRouter>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
