"use client"

import { Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material"
import { ShoppingCart } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

interface ProductCardProps {
  id: number
  nom: string
  description: string
  prix: number
  image_url?: string
  stock: number
  onAddToCart?: (id: number) => void
}

function ProductCard({ id, nom, description, prix, image_url, stock, onAddToCart }: ProductCardProps) {
  const navigate = useNavigate()

  return (
    <Card
      style={{
        background: "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)",
        border: "1px solid #333",
        borderRadius: "12px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={image_url || "/diverse-products-still-life.png"}
        alt={nom}
        style={{
          objectFit: "cover",
          cursor: "pointer",
        }}
        onClick={() => navigate(`/produits/${id}`)}
      />
      <CardContent style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography
          variant="h6"
          style={{
            color: "#fff",
            fontWeight: "bold",
            marginBottom: "8px",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/produits/${id}`)}
        >
          {nom}
        </Typography>
        <Typography
          variant="body2"
          style={{
            color: "#888",
            marginBottom: "16px",
            flexGrow: 1,
          }}
        >
          {description?.substring(0, 100)}...
        </Typography>
        <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography
            variant="h5"
            style={{
              color: "#1976d2",
              fontWeight: "bold",
            }}
          >
            {prix} €
          </Typography>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={() => onAddToCart?.(id)}
            disabled={stock === 0}
            style={{
              backgroundColor: stock === 0 ? "#555" : "#1976d2",
              color: "#fff",
            }}
          >
            {stock === 0 ? "Rupture" : "Ajouter"}
          </Button>
        </Box>
        <Typography
          variant="caption"
          style={{
            color: stock < 10 ? "#ff9800" : "#4caf50",
            marginTop: "8px",
          }}
        >
          {stock === 0 ? "Rupture de stock" : `${stock} en stock`}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default ProductCard
