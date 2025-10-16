"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

function SidebarToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const adminSessionStr = localStorage.getItem("adminSession")
  const clientSessionStr = localStorage.getItem("clientSession")
  const isAdmin = !!adminSessionStr
  const isClient = !!clientSessionStr

  const handleLogout = () => {
    if (isAdmin) {
      localStorage.removeItem("adminSession")
      navigate("/admin/connexion")
    } else if (isClient) {
      localStorage.removeItem("clientSession")
      navigate("/connexion")
    }
  }

  const adminLinks = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Produits", path: "/admin/produits" },
    { label: "Catégories", path: "/admin/categories" },
    { label: "Clients", path: "/admin/clients" },
    { label: "Commandes", path: "/admin/commandes" },
  ]

  const clientLinks = [
    { label: "Accueil", path: "/" },
    { label: "Produits", path: "/produits" },
    { label: "Panier", path: "/panier" },
    { label: "Mes commandes", path: "/commandes" },
  ]

  const links = isAdmin ? adminLinks : clientLinks

  return (
    <>
      {/* Bouton toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 1000,
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "0.75rem 1rem",
          cursor: "pointer",
          fontSize: "1.2rem",
        }}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: isOpen ? 0 : "-300px",
          width: "300px",
          height: "100vh",
          backgroundColor: "#2c3e50",
          color: "white",
          transition: "left 0.3s ease",
          zIndex: 999,
          padding: "4rem 1rem 1rem 1rem",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        <nav>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {links.map((link) => (
              <li key={link.path} style={{ marginBottom: "1rem" }}>
                <button
                  onClick={() => {
                    navigate(link.path)
                    setIsOpen(false)
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    backgroundColor: "transparent",
                    color: "white",
                    border: "none",
                    padding: "0.75rem",
                    cursor: "pointer",
                    fontSize: "1rem",
                    borderRadius: "4px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#34495e")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {(isAdmin || isClient) && (
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              marginTop: "2rem",
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              padding: "0.75rem",
              cursor: "pointer",
              fontSize: "1rem",
              borderRadius: "4px",
            }}
          >
            Déconnexion
          </button>
        )}
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 998,
          }}
        />
      )}
    </>
  )
}

export default SidebarToggle
