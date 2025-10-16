import axios from "axios"

async function fetchAdminLogin(email: string, password: string) {
  try {
    const response = await axios.post(
      `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/admin/login`,
      { email, password },
    )

    return response
  } catch (error: any) {
    const message = error.response?.data?.message || "Échec de la connexion admin"
    console.error("Erreur fetchAdminLogin:", message)
    throw new Error(message)
  }
}

export default fetchAdminLogin
