"use client"

import type React from "react"

import { useState } from "react"
import { TextField, Button, Box, Typography, Alert } from "@mui/material"
import { Login } from "@mui/icons-material"

interface FormConnexionProps {
  onSubmit: (email: string, password: string) => Promise<void>
  title: string
  isAdmin?: boolean
}

function FormConnexion({ onSubmit, title, isAdmin = false }: FormConnexionProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await onSubmit(email, password)
    } catch (err: any) {
      setError(err.message || "Erreur lors de la connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "40px",
        backgroundColor: "#1e1e1e",
        borderRadius: "12px",
        border: "1px solid #333",
      }}
    >
      <Typography
        variant="h4"
        style={{
          color: "#fff",
          marginBottom: "30px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {title}
      </Typography>

      {error && (
        <Alert severity="error" style={{ marginBottom: "20px" }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ marginBottom: "20px" }}
        InputLabelProps={{ style: { color: "#888" } }}
        InputProps={{
          style: { color: "#fff", backgroundColor: "#2d2d2d", borderRadius: "8px" },
        }}
      />

      <TextField
        fullWidth
        label="Mot de passe"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ marginBottom: "30px" }}
        InputLabelProps={{ style: { color: "#888" } }}
        InputProps={{
          style: { color: "#fff", backgroundColor: "#2d2d2d", borderRadius: "8px" },
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        startIcon={<Login />}
        disabled={loading}
        style={{
          backgroundColor: isAdmin ? "#d32f2f" : "#1976d2",
          color: "#fff",
          padding: "12px",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        {loading ? "Connexion..." : "Se connecter"}
      </Button>
    </Box>
  )
}

export default FormConnexion
