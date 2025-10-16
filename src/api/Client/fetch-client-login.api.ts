import axios from "axios"

async function fetchClientLogin(email: string, password: string) {
  try {
    const response = await axios.post(
      `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/client/login`,
      { email, password },
    )

    return response
  } catch (error: any) {
    const message = error.response?.data?.message || "Échec de la connexion client"
    console.error("Erreur fetchClientLogin:", message)
    throw new Error(message)
  }
}

export default fetchClientLogin
