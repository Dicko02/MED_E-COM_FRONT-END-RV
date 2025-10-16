"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Complements/Header.component"
import Footer from "../../components/Complements/Footer.component"
import SideBar from "../../components/Complements/SideBar.component"
import Loading from "../../components/Complements/Loading.component"
import StatCard from "../../components/DashBoard/StatCard.component"
import fetchProducts from "../../api/Produit/fetch-products.api"
import fetchCategories from "../../api/Categorie/fetch-categories.api"
import fetchClients from "../../api/Client/fetch-clients.api"
import fetchOrders from "../../api/Commande/fetch-orders.api"

function DashboardAdmin() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalClients: 0,
    totalOrders: 0,
    pendingOrders: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [productsRes, categoriesRes, clientsRes, ordersRes] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchClients(),
          fetchOrders(),
        ])

        const orders = ordersRes.data.data || []
        const pendingOrders = orders.filter((order: any) => order.status === "pending").length

        setStats({
          totalProducts: productsRes.data.data?.length || 0,
          totalCategories: categoriesRes.data.data?.length || 0,
          totalClients: clientsRes.data.data?.length || 0,
          totalOrders: orders.length,
          pendingOrders,
        })
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#000" }}>
        <SideBar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Header />
          <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Loading text="Chargement des statistiques..." />
          </main>
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
          <h1 style={{ color: "#fff", fontSize: "32px", marginBottom: "32px" }}>Tableau de bord Admin</h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "24px",
            }}
          >
            <StatCard title="Total Produits" value={stats.totalProducts} onClick={() => navigate("/admin/produits")} />
            <StatCard
              title="Total Catégories"
              value={stats.totalCategories}
              onClick={() => navigate("/admin/categories")}
            />
            <StatCard title="Total Clients" value={stats.totalClients} onClick={() => navigate("/admin/clients")} />
            <StatCard title="Total Commandes" value={stats.totalOrders} onClick={() => navigate("/admin/commandes")} />
            <StatCard
              title="Commandes en attente"
              value={stats.pendingOrders}
              onClick={() => navigate("/admin/commandes")}
              highlight
            />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default DashboardAdmin
