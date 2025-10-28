"use client"

import { useState, useEffect } from "react"
import { DataGrid, type GridColDef, GridActionsCellItem } from "@mui/x-data-grid"
import { Box } from "@mui/material"
import { Delete } from "@mui/icons-material"
import fetchClients from "../../api/Client/allClients.api"
import deleteClient from "../../api/Client/deleteClient.api"

function TableauClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      const response = await fetchClients()
      setClients(response.data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        await deleteClient(id)
        loadClients()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nom", headerName: "Nom", width: 200 },
    { field: "prenom", headerName: "Prénom", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "telephone", headerName: "Téléphone", width: 150 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key={params.id} // Added key property
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
        rows={clients}
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

export default TableauClients
