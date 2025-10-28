"use client"

import { useState, useEffect } from "react"
import Header from "../../components/Complements/Header.component"
import Footer from "../../components/Complements/Footer.component"
import SideBar from "../../components/Complements/SideBar.component"
import TableauProduits from "../../components/Produit/TableauProduits.component"
import fetchProducts from "../../api/Produit/allProducts.api"

function ProduitsAdmin() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetchProducts()
      const data = response.data.data || []
      setProducts(data.map((item: any) => ({ ...item, id: item._id })))
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#000" }}>
      <SideBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, padding: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h1 style={{ color: "#fff", fontSize: "32px", margin: 0 }}>Gestion des Produits</h1>
            <button
              onClick={() => (window.location.href = "/admin/produits/create")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#0ea5e9",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Ajouter un produit
            </button>
          </div>

          <TableauProduits products={products} loading={loading} onRefresh={loadProducts} />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default ProduitsAdmin
