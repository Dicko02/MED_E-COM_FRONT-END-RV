import axios from "axios"

async function fetchOrder(id: number) {
  try {
    const session = localStorage.getItem("adminSession") || localStorage.getItem("clientSession")
    if (!session) throw new Error("Session introuvable")

    const { token } = JSON.parse(session)
    if (!token) throw new Error("Token manquant dans la session")

    const response = await axios.get(
      `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/commande/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response
  } catch (error: any) {
    const message = error.response?.data?.message || "Échec de la récupération de la commande"
    console.error("Erreur fetchOrder:", message)
    throw new Error(message)
  }
}

export default fetchOrder
