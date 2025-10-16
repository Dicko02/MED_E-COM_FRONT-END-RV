"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import fetchClientLogin from "../api/Client/fetch-client-login.api"
import Loading from "../components/Complements/Loading.component"

function Connexion() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetchClientLogin({ email, password })

      if (response.data.success) {
        localStorage.setItem(
          "clientSession",
          JSON.stringify({
            token: response.data.token,
            user: response.data.data,
          }),
        )
        navigate("/produits")
      } else {
        setError(response.data.message || "Erreur de connexion")
      }
    } catch (err: any) {
      setError(err.message || "Erreur de connexion au serveur")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading text="Connexion en cours..." />
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Connexion Client</h1>

        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "1rem",
              borderRadius: "4px",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Se connecter
          </button>
        </form>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <button
            onClick={() => navigate("/inscription")}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#1976d2",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Pas encore de compte ? S'inscrire
          </button>
        </div>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#666",
              cursor: "pointer",
            }}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  )
}

export default Connexion
