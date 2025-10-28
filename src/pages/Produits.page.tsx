"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SidebarToggle from "../components/Complements/SideBar.component"
import Header from "../components/Complements/Header.component"
import Footer from "../components/Complements/Footer.component"
import Loading from "../components/Complements/Loading.component"
import ProductCard from "../components/Produit/ProductCard.component"
import fetchProducts from "../api/Produit/allProducts.api"
import fetchCategories from "../api/Categorie/allCategories.api"

function Produits() {
  const navigate = useNavigate()
  const [produits, setProduits] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [categorieSelectionnee, setCategorieSelectionnee] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function chargerDonnees() {
      try {
        const [produitsRes, categoriesRes] = await Promise.all([fetchProducts(), fetchCategories()])

        if (produitsRes.data.data) {
          setProduits(produitsRes.data.data)
        }
        if (categoriesRes.data.data) {
          setCategories(categoriesRes.data.data)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      } finally {
        setLoading(false)
      }
    }

    chargerDonnees()
  }, [])

  const produitsFiltres = categorieSelectionnee
    ? produits.filter((p) => p.category?._id === categorieSelectionnee)
    : produits

  if (loading) {
    return <Loading text="Chargement des produits..." />
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <SidebarToggle />
      <main
        style={{
          padding: "1.5rem",
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <Header title="Nos Produits" />

        {/* Filtres par catégorie */}
        <div style={{ marginBottom: "2rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            Filtrer par catégorie :
          </label>
          <select
            value={categorieSelectionnee}
            onChange={(e) => setCategorieSelectionnee(e.target.value)}
            style={{
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "1rem",
              minWidth: "200px",
            }}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1.5rem",
            flexGrow: 1,
          }}
        >
          {produitsFiltres.map((produit) => (
            <ProductCard key={produit._id} product={produit} onClick={() => navigate(`/produits/${produit._id}`)} />
          ))}
        </div>

        {produitsFiltres.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#666",
              fontSize: "1.2rem",
            }}
          >
            Aucun produit trouvé
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Produits
