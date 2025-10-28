"use client"

import { useState, useEffect } from "react"
import Header from "../../components/Complements/Header.component"
import Footer from "../../components/Complements/Footer.component"
import SideBar from "../../components/Complements/SideBar.component"
import TableauClients from "../../components/Client/TableauClients.component"
import fetchClients from "../../api/Client/allClients.api"

function ClientsAdmin() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const response = await fetchClients()
      const data = response.data.data || []
      setClients(data.map((item: any) => ({ ...item, id: item._id })))
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error)
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
          <h1 style={{ color: "#fff", fontSize: "32px", marginBottom: "24px" }}>Gestion des Clients</h1>

          <TableauClients clients={clients} loading={loading} onRefresh={loadClients} />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default ClientsAdmin
