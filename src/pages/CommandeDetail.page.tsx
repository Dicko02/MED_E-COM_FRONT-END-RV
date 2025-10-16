"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import SidebarToggle from "../components/Complements/SideBar.component"
import Header from "../components/Complements/Header.component"
import Footer from "../components/Complements/Footer.component"
import Loading from "../components/Complements/Loading.component"
import { getCommandeById } from "../api/commande.api"

function CommandeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [commande, setCommande] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function chargerCommande() {
      try {
        const result = await getCommandeById(id!)
        if (result.success) {
          setCommande(result.data)
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la commande:", error)
      } finally {
        setLoading(false)
      }
    }

    chargerCommande()
  }, [id])

  if (loading) {
    return <Loading text="Chargement de la commande..." />
  }

  if (!commande) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Commande non trouvée</h2>
        <button onClick={() => navigate("/commandes")}>Retour aux commandes</button>
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
        <Header title={`Commande #${commande._id.substring(0, 8)}`} />

        <div
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <h2>Informations de la commande</h2>
            <p>
              <strong>Date:</strong> {new Date(commande.createdAt).toLocaleDateString("fr-FR")} à{" "}
              {new Date(commande.createdAt).toLocaleTimeString("fr-FR")}
            </p>
            <p>
              <strong>Statut:</strong>{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: commande.statut === "livrée" ? "green" : commande.statut === "en cours" ? "orange" : "#1976d2",
                }}
              >
                {commande.statut}
              </span>
            </p>
            <p>
              <strong>Adresse de livraison:</strong> {commande.adresseLivraison}
            </p>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h2>Produits</h2>
            {commande.produits?.map((item: any) => (
              <div
                key={item.produitId._id}
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  padding: "1rem",
                  borderBottom: "1px solid #eee",
                }}
              >
                <img
                  src={item.produitId.image || "/placeholder.jpg"}
                  alt={item.produitId.nom}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>{item.produitId.nom}</h3>
                  <p style={{ color: "#666", margin: 0 }}>
                    Quantité: {item.quantite} × {item.produitId.prix} €
                  </p>
                </div>
                <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                  {(item.quantite * item.produitId.prix).toFixed(2)} €
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "right", borderTop: "2px solid #1976d2", paddingTop: "1rem" }}>
            <p style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#1976d2", margin: 0 }}>
              Total: {commande.total} €
            </p>
          </div>

          <button
            onClick={() => navigate("/commandes")}
            style={{
              marginTop: "2rem",
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
            Retour aux commandes
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CommandeDetail
