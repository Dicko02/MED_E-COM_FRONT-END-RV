"use client"

import { useNavigate } from "react-router-dom"

function NotFound() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <h1 style={{ fontSize: "6rem", margin: 0, color: "#1976d2" }}>404</h1>
      <p style={{ fontSize: "1.5rem", color: "#666", marginBottom: "2rem" }}>Page non trouvée</p>
      <button
        onClick={() => navigate("/")}
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
        Retour à l'accueil
      </button>
    </div>
  )
}

export default NotFound
