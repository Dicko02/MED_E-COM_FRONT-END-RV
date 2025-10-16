import axios from "axios"

async function createOrder(data: any) {
  try {
    const session = localStorage.getItem("clientSession")
    if (!session) throw new Error("Session introuvable")

    const { token } = JSON.parse(session)
    if (!token) throw new Error("Token manquant dans la session")

    const response = await axios.post(
      `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/commande`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response
  } catch (error: any) {
    const message = error.response?.data?.message || "Échec de la création de la commande"
    console.error("Erreur createOrder:", message)
    throw new Error(message)
  }
}

export default createOrder
