"use client"

import { useState, useEffect } from "react"
import { DataGrid, type GridColDef, GridActionsCellItem } from "@mui/x-data-grid"
import { Box, Chip } from "@mui/material"
import { Visibility, Delete } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import fetchOrders from "../../api/Commande/allOrders.api"
import deleteOrder from "../../api/Commande/deleteOrder.api"

function TableauCommandes() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await fetchOrders()
      setOrders(response.data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      try {
        await deleteOrder(id)
        loadOrders()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_attente":
        return "warning"
      case "en_cours":
        return "info"
      case "livree":
        return "success"
      case "annulee":
        return "error"
      default:
        return "default"
    }
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "client_nom", headerName: "Client", width: 200 },
    { field: "total", headerName: "Total", width: 120 },
    {
      field: "statut",
      headerName: "Statut",
      width: 150,
      renderCell: (params) => <Chip label={params.value} color={getStatusColor(params.value)} size="small" />,
    },
    { field: "date_commande", headerName: "Date", width: 180 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key={`view-${params.id}`}
          icon={<Visibility />}
          label="Voir"
          onClick={() => navigate(`/admin/commandes/${params.id}`)}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<Delete />}
          label="Supprimer"
          onClick={() => handleDelete(params.id as number)}
        />,
      ],
    },
  ]

  return (
    <Box style={{ width: "100%" }}>
      <DataGrid
        rows={orders}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        style={{
          backgroundColor: "#1e1e1e",
          color: "#fff",
          border: "1px solid #333",
        }}
        sx={{
          "& .MuiDataGrid-cell": {
            color: "#fff",
            borderColor: "#333",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#2d2d2d",
            color: "#fff",
            borderColor: "#333",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#2d2d2d",
            color: "#fff",
            borderColor: "#333",
          },
        }}
      />
    </Box>
  )
}

export default TableauCommandes
