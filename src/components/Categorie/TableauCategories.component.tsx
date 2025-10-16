"use client"

import { useState, useEffect } from "react"
import { DataGrid, type GridColDef, GridActionsCellItem } from "@mui/x-data-grid"
import { Box, Button } from "@mui/material"
import { Edit, Delete, Add } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import fetchCategories from "../../api/Categorie/fetch-categories.api"
import deleteCategory from "../../api/Categorie/delete-category.api"

function TableauCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await fetchCategories()
      setCategories(response.data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      try {
        await deleteCategory(id)
        loadCategories()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nom", headerName: "Nom", width: 300 },
    { field: "description", headerName: "Description", width: 400 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key={params.id} // Added key property
          icon={<Edit />}
          label="Modifier"
          onClick={() => navigate(`/admin/categories/edit/${params.id}`)}
        />,
        <GridActionsCellItem
          key={params.id + "delete"} // Added key property
          icon={<Delete />}
          label="Supprimer"
          onClick={() => handleDelete(params.id as number)}
        />,
      ],
    },
  ]

  return (
    <Box style={{ width: "100%" }}>
      <Box style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/admin/categories/create")}
          style={{
            backgroundColor: "#1976d2",
            color: "#fff",
          }}
        >
          Ajouter une catégorie
        </Button>
      </Box>
      <DataGrid
        rows={categories}
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

export default TableauCategories
