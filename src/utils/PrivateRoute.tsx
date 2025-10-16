import type React from "react"
import { Navigate } from "react-router-dom"

interface PrivateRouteProps {
  children: React.ReactNode
  role?: "client" | "admin"
}

function PrivateRoute({ children, role }: PrivateRouteProps) {
  const clientSessionStr = localStorage.getItem("clientSession")
  const adminSessionStr = localStorage.getItem("adminSession")

  if (role === "client") {
    if (!clientSessionStr) {
      return <Navigate to="/connexion" replace />
    }
    return <>{children}</>
  }

  if (role === "admin") {
    if (!adminSessionStr) {
      return <Navigate to="/admin/connexion" replace />
    }
    return <>{children}</>
  }

  return <>{children}</>
}

export default PrivateRoute
