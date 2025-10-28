"use client"

import { useState, useEffect } from "react"
import { DataGrid, type GridColDef, GridActionsCellItem } from "@mui/x-data-grid"
import { Box, Button } from "@mui/material"
import { Edit, Delete, Add } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import fetchProducts from "../../api/Produit/allProducts.api"
import deleteProduct from "../../api/Produit/deleteProduct.api"

function TableauProduits() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await fetchProducts()
      setProducts(response.data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await deleteProduct(id)
        loadProducts()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nom", headerName: "Nom", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "prix", headerName: "Prix", width: 100 },
    { field: "stock", headerName: "Stock", width: 100 },
    { field: "categorie_nom", headerName: "Catégorie", width: 150 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key={`edit-${params.id}`}
          icon={<Edit />}
          label="Modifier"
          onClick={() => navigate(`/admin/produits/edit/${params.id}`)}
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
      <Box style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/admin/produits/create")}
          style={{
            backgroundColor: "#1976d2",
            color: "#fff",
          }}
        >
          Ajouter un produit
        </Button>
      </Box>
      <DataGrid
        rows={products}
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

export default TableauProduits
