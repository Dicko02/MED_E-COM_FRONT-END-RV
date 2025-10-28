import axios from "axios"

async function fetchProduct(id: number) {
  try {
    const response = await axios.get(
      `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/produit/${id}`,
    )

    return response
  } catch (error: any) {
    const message = error.response?.data?.message || "Échec de la récupération du produit"
    console.error("Erreur fetchProduct:", message)
    throw new Error(message)
  }
}

export default fetchProduct
