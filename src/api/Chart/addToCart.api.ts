import axios from "axios"

async function addToCart(produitId: number, quantite: number) {
  try {
    const session = localStorage.getItem("clientSession")
    if (!session) throw new Error("Session introuvable")

    const { token } = JSON.parse(session)
    if (!token) throw new Error("Token manquant dans la session")

    const response = await axios.post(
      `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/chart`,
      { produitId, quantite },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response
  } catch (error: any) {
    const message = error.response?.data?.message || "Échec de l'ajout au panier"
    console.error("Erreur addToCart:", message)
    throw new Error(message)
  }
}

export default addToCart
