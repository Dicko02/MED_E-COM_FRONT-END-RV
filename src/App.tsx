import { Suspense, lazy } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Loading from "./components/Complements/Loading.component"
import PrivateRoute from "./utils/PrivateRoute"

// Lazy loading des pages
const Connexion = lazy(() => import("./pages/Connexion.page"))
const ConnexionAdmin = lazy(() => import("./pages/ConnexionAdmin.page"))
const Inscription = lazy(() => import("./pages/Inscription.page"))
const Accueil = lazy(() => import("./pages/Accueil.page"))
const Produits = lazy(() => import("./pages/Produits.page"))
const ProduitDetail = lazy(() => import("./pages/ProduitDetail.page"))
const Panier = lazy(() => import("./pages/Panier.page"))
const Commandes = lazy(() => import("./pages/Commandes.page"))
const CommandeDetail = lazy(() => import("./pages/CommandeDetail.page"))
const DashboardAdmin = lazy(() => import("./pages/Admin/Dashboard.page"))
const ProduitsAdmin = lazy(() => import("./pages/Admin/ProduitsAdmin.page"))
const CategoriesAdmin = lazy(() => import("./pages/Admin/CategoriesAdmin.page"))
const ClientsAdmin = lazy(() => import("./pages/Admin/ClientsAdmin.page"))
const CommandesAdmin = lazy(() => import("./pages/Admin/CommandesAdmin.page"))
const CreateProduit = lazy(() => import("./pages/Admin/CreateProduit.page"))
const EditProduit = lazy(() => import("./pages/Admin/EditProduit.page"))
const CreateCategory = lazy(() => import("./pages/Admin/CreateCategory.page"))
const EditCategory = lazy(() => import("./pages/Admin/EditCategory.page"))
const NotFound = lazy(() => import("./pages/NotFound.page"))

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading text="Chargement de la page..." />}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Accueil />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/admin/connexion" element={<ConnexionAdmin />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/produits" element={<Produits />} />
          <Route path="/produits/:id" element={<ProduitDetail />} />

          {/* Routes protégées client */}
          <Route
            path="/panier"
            element={
              <PrivateRoute role="client">
                <Panier />
              </PrivateRoute>
            }
          />
          <Route
            path="/commandes"
            element={
              <PrivateRoute role="client">
                <Commandes />
              </PrivateRoute>
            }
          />
          <Route
            path="/commandes/:id"
            element={
              <PrivateRoute role="client">
                <CommandeDetail />
              </PrivateRoute>
            }
          />

          {/* Routes protégées admin */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute role="admin">
                <DashboardAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/produits"
            element={
              <PrivateRoute role="admin">
                <ProduitsAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/produits/create"
            element={
              <PrivateRoute role="admin">
                <CreateProduit />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/produits/edit/:id"
            element={
              <PrivateRoute role="admin">
                <EditProduit />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <PrivateRoute role="admin">
                <CategoriesAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/categories/create"
            element={
              <PrivateRoute role="admin">
                <CreateCategory />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/categories/edit/:id"
            element={
              <PrivateRoute role="admin">
                <EditCategory />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/clients"
            element={
              <PrivateRoute role="admin">
                <ClientsAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/commandes"
            element={
              <PrivateRoute role="admin">
                <CommandesAdmin />
              </PrivateRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
