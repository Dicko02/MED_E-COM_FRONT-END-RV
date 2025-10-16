import axios from "axios"

async function updateCartItem(id: number, quantite: number) {
  try {
    const session = localStorage.getItem("clientSession")
    if (!session) throw new Error("Session introuvable")

    const { token } = JSON.parse(session)
    if (!token) throw new Error("Token manquant dans la session")

    const response = await axios.put(
      `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/chart/${id}`,
      { quantite },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response
  } catch (error: any) {
    const message = error.response?.data?.message || "Échec de la mise à jour du panier"
    console.error("Erreur updateCartItem:", message)
    throw new Error(message)
  }
}

export default updateCartItem
