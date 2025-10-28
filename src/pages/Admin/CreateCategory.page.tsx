"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Complements/Header.component"
import Footer from "../../components/Complements/Footer.component"
import SideBar from "../../components/Complements/SideBar.component"
import createCategory from "../../api/Categorie/createCategory.api"

function CreateCategory() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await createCategory(formData)
      alert("Catégorie créée avec succès")
      navigate("/admin/categories")
    } catch (error: any) {
      setError(error.message || "Erreur lors de la création de la catégorie")
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
          <h1 style={{ color: "#fff", fontSize: "32px", marginBottom: "24px" }}>Créer une catégorie</h1>

          {error && (
            <div
              style={{
                backgroundColor: "#ef4444",
                color: "#fff",
                padding: "16px",
                borderRadius: "4px",
                marginBottom: "24px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontWeight: "bold" }}>
                Nom de la catégorie
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1e1e1e",
                  border: "1px solid #333",
                  borderRadius: "4px",
                  color: "#fff",
                  fontSize: "16px",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontWeight: "bold" }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1e1e1e",
                  border: "1px solid #333",
                  borderRadius: "4px",
                  color: "#fff",
                  fontSize: "16px",
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "12px 24px",
                  backgroundColor: loading ? "#666" : "#0ea5e9",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                {loading ? "Création..." : "Créer la catégorie"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/categories")}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #555",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default CreateCategory
