import axios from "axios"

async function fetchCategory(id: number) {
  try {
    const response = await axios.get(
      `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/categorie/${id}`,
    )

    return response
  } catch (error: any) {
    const message = error.response?.data?.message || "Échec de la récupération de la catégorie"
    console.error("Erreur fetchCategory:", message)
    throw new Error(message)
  }
}

export default fetchCategory
