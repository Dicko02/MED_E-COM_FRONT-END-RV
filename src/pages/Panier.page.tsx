"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SidebarToggle from "../components/Complements/SideBar.component"
import Header from "../components/Complements/Header.component"
import Footer from "../components/Complements/Footer.component"
import Loading from "../components/Complements/Loading.component"
import { getPanier, modifierQuantite, supprimerDuPanier } from "../api/panier.api"
import { creerCommande } from "../api/commande.api"

function Panier() {
  const navigate = useNavigate()
  const [panier, setPanier] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [adresseLivraison, setAdresseLivraison] = useState("")

  useEffect(() => {
    chargerPanier()
  }, [])

  async function chargerPanier() {
    try {
      const result = await getPanier()
      if (result.success) {
        setPanier(result.data)
        const clientSession = JSON.parse(localStorage.getItem("clientSession") || "{}")
        setAdresseLivraison(clientSession.adresse || "")
      }
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleModifierQuantite = async (produitId: string, nouvelleQuantite: number) => {
    try {
      const result = await modifierQuantite(produitId, nouvelleQuantite)
      if (result.success) {
        chargerPanier()
      }
    } catch (error) {
      alert("Erreur lors de la modification")
    }
  }

  const handleSupprimer = async (produitId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return

    try {
      const result = await supprimerDuPanier(produitId)
      if (result.success) {
        chargerPanier()
      }
    } catch (error) {
      alert("Erreur lors de la suppression")
    }
  }

  const handleValiderCommande = async () => {
    if (!adresseLivraison) {
      alert("Veuillez saisir une adresse de livraison")
      return
    }

    try {
      const result = await creerCommande(adresseLivraison)
      if (result.success) {
        alert("Commande créée avec succès ! Un email de confirmation vous a été envoyé.")
        navigate("/commandes")
      } else {
        alert(result.message || "Erreur lors de la création de la commande")
      }
    } catch (error) {
      alert("Erreur lors de la création de la commande")
    }
  }

  if (loading) {
    return <Loading text="Chargement du panier..." />
  }

  const total = panier?.produits?.reduce((sum: number, item: any) => sum + item.produitId.prix * item.quantite, 0) || 0

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
        <Header title="Mon Panier" />

        {!panier || panier.produits?.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ fontSize: "1.2rem", color: "#666" }}>Votre panier est vide</p>
            <button
              onClick={() => navigate("/produits")}
              style={{
                marginTop: "1rem",
                padding: "1rem 2rem",
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.1rem",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Voir les produits
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {/* Liste des produits */}
            <div style={{ flex: "2", minWidth: "300px" }}>
              {panier.produits.map((item: any) => (
                <div
                  key={item.produitId._id}
                  style={{
                    backgroundColor: "white",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    marginBottom: "1rem",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={item.produitId.image || "/placeholder.jpg"}
                    alt={item.produitId.nom}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 0.5rem 0" }}>{item.produitId.nom}</h3>
                    <p style={{ color: "#1976d2", fontWeight: "bold", fontSize: "1.2rem" }}>{item.produitId.prix} €</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleModifierQuantite(item.produitId._id, item.quantite - 1)}
                      disabled={item.quantite <= 1}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#f0f0f0",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{item.quantite}</span>
                    <button
                      onClick={() => handleModifierQuantite(item.produitId._id, item.quantite + 1)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#f0f0f0",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleSupprimer(item.produitId._id)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#e74c3c",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>

            {/* Récapitulatif */}
            <div style={{ flex: "1", minWidth: "300px" }}>
              <div
                style={{
                  backgroundColor: "white",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  position: "sticky",
                  top: "1rem",
                }}
              >
                <h2 style={{ marginTop: 0 }}>Récapitulatif</h2>
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Sous-total:</span>
                    <span>{total.toFixed(2)} €</span>
                  </p>
                  <p
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    <span>Total:</span>
                    <span>{total.toFixed(2)} €</span>
                  </p>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    Adresse de livraison:
                  </label>
                  <textarea
                    value={adresseLivraison}
                    onChange={(e) => setAdresseLivraison(e.target.value)}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "1rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  onClick={handleValiderCommande}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Valider la commande
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Panier
