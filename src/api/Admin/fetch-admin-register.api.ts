import axios from "axios"

async function fetchAdminRegister(nom: string, prenom: string, email: string, password: string) {
  try {
    const response = await axios.post(
      `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/admin/register`,
      { nom, prenom, email, password },
    )

    return response
  } catch (error: any) {
    const message = error.response?.data?.message || "Échec de l'inscription admin"
    console.error("Erreur fetchAdminRegister:", message)
    throw new Error(message)
  }
}

export default fetchAdminRegister
