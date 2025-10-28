"use client"

import { useState, useEffect } from "react"
import Header from "../../components/Complements/Header.component"
import Footer from "../../components/Complements/Footer.component"
import SideBar from "../../components/Complements/SideBar.component"
import TableauCommandes from "../../components/Commande/TableauCommandes.component"
import fetchOrders from "../../api/Commande/allOrders.api"

function CommandesAdmin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const response = await fetchOrders()
      const data = response.data.data || []
      setOrders(data.map((item: any) => ({ ...item, id: item._id })))
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error)
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
          <h1 style={{ color: "#fff", fontSize: "32px", marginBottom: "24px" }}>Gestion des Commandes</h1>

          <TableauCommandes orders={orders} loading={loading} onRefresh={loadOrders} />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default CommandesAdmin
