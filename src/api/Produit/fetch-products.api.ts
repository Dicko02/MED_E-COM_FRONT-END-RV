import axios from "axios"

async function fetchProducts() {
  try {
    const response = await axios.get(
      `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/produit`,
    )

    return response
  } catch (error: any) {
    const message = error.response?.data?.message || "Échec de la récupération des produits"
    console.error("Erreur fetchProducts:", message)
    throw new Error(message)
  }
}

export default fetchProducts
