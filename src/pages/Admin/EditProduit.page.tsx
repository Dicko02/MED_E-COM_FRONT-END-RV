"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "../../components/Complements/Header.component"
import Footer from "../../components/Complements/Footer.component"
import SideBar from "../../components/Complements/SideBar.component"
import fetchProduct from "../../api/Produit/fetch-product.api"
import updateProduct from "../../api/Produit/update-product.api"
import fetchCategories from "../../api/Categorie/fetch-categories.api"

function EditProduit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  })
  const [images, setImages] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      const [productRes, categoriesRes] = await Promise.all([fetchProduct(id!), fetchCategories()])

      const product = productRes.data.data
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category?._id || "",
      })
      setCategories(categoriesRes.data.data || [])
    } catch (error) {
      console.error("Erreur lors du chargement:", error)
      setError("Erreur lors du chargement du produit")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("price", formData.price)
      formDataToSend.append("stock", formData.stock)
      formDataToSend.append("category", formData.category)

      images.forEach((image) => {
        formDataToSend.append("images", image)
      })

      await updateProduct(id!, formDataToSend)
      alert("Produit modifié avec succès")
      navigate("/admin/produits")
    } catch (error: any) {
      setError(error.message || "Erreur lors de la modification du produit")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#000" }}>
        <SideBar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Header />
          <main style={{ flex: 1, padding: "40px", color: "#fff" }}>Chargement...</main>
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#000" }}>
      <SideBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, padding: "40px" }}>
          <h1 style={{ color: "#fff", fontSize: "32px", marginBottom: "24px" }}>Modifier le produit</h1>

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
                Nom du produit
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

            <div style={{ marginBottom: "20px" }}>
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

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontWeight: "bold" }}>
                Prix (€)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
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

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontWeight: "bold" }}>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
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

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontWeight: "bold" }}>
                Catégorie
              </label>
              <select
                name="category"
                value={formData.category}
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
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontWeight: "bold" }}>
                Nouvelles images (optionnel)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
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

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "12px 24px",
                  backgroundColor: submitting ? "#666" : "#0ea5e9",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                {submitting ? "Modification..." : "Modifier le produit"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/produits")}
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

export default EditProduit
