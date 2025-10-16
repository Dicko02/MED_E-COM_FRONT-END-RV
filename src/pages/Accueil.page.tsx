"use client"

import { useNavigate } from "react-router-dom"
import SidebarToggle from "../components/Complements/SideBar.component"
import Footer from "../components/Complements/Footer.component"

function Accueil() {
  const navigate = useNavigate()

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
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Bienvenue sur notre E-Commerce</h1>
          <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "2rem" }}>Découvrez nos produits de qualité</p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => navigate("/produits")}
              style={{
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

            <button
              onClick={() => navigate("/connexion")}
              style={{
                padding: "1rem 2rem",
                backgroundColor: "#fff",
                color: "#1976d2",
                border: "2px solid #1976d2",
                borderRadius: "8px",
                fontSize: "1.1rem",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Se connecter
            </button>

            <button
              onClick={() => navigate("/admin/connexion")}
              style={{
                padding: "1rem 2rem",
                backgroundColor: "#d32f2f",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.1rem",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Admin
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Accueil
