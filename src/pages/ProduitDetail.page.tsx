"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import SidebarToggle from "../components/Complements/SideBar.component"
import Header from "../components/Complements/Header.component"
import Footer from "../components/Complements/Footer.component"
import Loading from "../components/Complements/Loading.component"
import { getProduitById } from "../api/produit.api"
import { ajouterAuPanier } from "../api/panier.api"

function ProduitDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [produit, setProduit] = useState<any>(null)
  const [quantite, setQuantite] = useState(1)
  const [loading, setLoading] = useState(true)
  const [ajoutEnCours, setAjoutEnCours] = useState(false)

  useEffect(() => {
    async function chargerProduit() {
      try {
        const result = await getProduitById(id!)
        if (result.success) {
          setProduit(result.data)
        }
      } catch (error) {
        console.error("Erreur lors du chargement du produit:", error)
      } finally {
        setLoading(false)
      }
    }

    chargerProduit()
  }, [id])

  const handleAjouterAuPanier = async () => {
    const clientSession = localStorage.getItem("clientSession")
    if (!clientSession) {
      alert("Vous devez être connecté pour ajouter au panier")
      navigate("/connexion")
      return
    }

    setAjoutEnCours(true)
    try {
      const result = await ajouterAuPanier(id!, quantite)
      if (result.success) {
        alert("Produit ajouté au panier !")
        navigate("/panier")
      } else {
        alert(result.message || "Erreur lors de l'ajout au panier")
      }
    } catch (error) {
      alert("Erreur lors de l'ajout au panier")
    } finally {
      setAjoutEnCours(false)
    }
  }

  if (loading) {
    return <Loading text="Chargement du produit..." />
  }

  if (!produit) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Produit non trouvé</h2>
        <button onClick={() => navigate("/produits")}>Retour aux produits</button>
      </div>
    )
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
        <Header title={produit.nom} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          {/* Image */}
          <div>
            <img
              src={produit.image || "/placeholder.jpg"}
              alt={produit.nom}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Détails */}
          <div>
            <h2 style={{ marginTop: 0 }}>{produit.nom}</h2>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1976d2" }}>{produit.prix} €</p>
            <p style={{ color: "#666", lineHeight: "1.6" }}>{produit.description}</p>
            <p style={{ marginTop: "1rem" }}>
              <strong>Stock disponible:</strong> {produit.stock}
            </p>

            <div style={{ marginTop: "2rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                Quantité:
              </label>
              <input
                type="number"
                min="1"
                max={produit.stock}
                value={quantite}
                onChange={(e) => setQuantite(Number.parseInt(e.target.value))}
                style={{
                  padding: "0.75rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  width: "100px",
                }}
              />
            </div>

            <button
              onClick={handleAjouterAuPanier}
              disabled={ajoutEnCours || produit.stock === 0}
              style={{
                marginTop: "2rem",
                padding: "1rem 2rem",
                backgroundColor: produit.stock === 0 ? "#ccc" : "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.1rem",
                cursor: produit.stock === 0 ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              {ajoutEnCours ? "Ajout en cours..." : produit.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
            </button>

            <button
              onClick={() => navigate("/produits")}
              style={{
                marginTop: "1rem",
                marginLeft: "1rem",
                padding: "1rem 2rem",
                backgroundColor: "transparent",
                color: "#1976d2",
                border: "2px solid #1976d2",
                borderRadius: "8px",
                fontSize: "1.1rem",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Retour aux produits
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProduitDetail
