import axios from "axios"

async function fetchClientRegister(nom: string, prenom: string, email: string, password: string) {
  try {
    const response = await axios.post(
      `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/client/register`,
      { nom, prenom, email, password },
    )

    return response
  } catch (error: any) {
    const message = error.response?.data?.message || "Échec de l'inscription client"
    console.error("Erreur fetchClientRegister:", message)
    throw new Error(message)
  }
}

export default fetchClientRegister
