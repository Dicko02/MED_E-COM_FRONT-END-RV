"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SidebarToggle from "../components/Complements/SideBar.component"
import Header from "../components/Complements/Header.component"
import Footer from "../components/Complements/Footer.component"
import Loading from "../components/Complements/Loading.component"
import { getAllCommandes } from "../api/commande.api"

function Commandes() {
  const navigate = useNavigate()
  const [commandes, setCommandes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function chargerCommandes() {
      try {
        const result = await getAllCommandes()
        if (result.success) {
          setCommandes(result.data)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des commandes:", error)
      } finally {
        setLoading(false)
      }
    }

    chargerCommandes()
  }, [])

  if (loading) {
    return <Loading text="Chargement des commandes..." />
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
        <Header title="Mes Commandes" />

        {commandes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ fontSize: "1.2rem", color: "#666" }}>Vous n'avez pas encore de commandes</p>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {commandes.map((commande) => (
              <div
                key={commande._id}
                onClick={() => navigate(`/commandes/${commande._id}`)}
                style={{
                  backgroundColor: "white",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 0.5rem 0" }}>Commande #{commande._id.substring(0, 8)}</h3>
                    <p style={{ color: "#666", margin: "0.25rem 0" }}>
                      Date: {new Date(commande.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                    <p style={{ color: "#666", margin: "0.25rem 0" }}>
                      Statut:{" "}
                      <span
                        style={{
                          fontWeight: "bold",
                          color:
                            commande.statut === "livrée"
                              ? "green"
                              : commande.statut === "en cours"
                                ? "orange"
                                : "#1976d2",
                        }}
                      >
                        {commande.statut}
                      </span>
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#1976d2",
                        margin: 0,
                      }}
                    >
                      {commande.total} €
                    </p>
                    <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                      {commande.produits?.length || 0} produit(s)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Commandes
