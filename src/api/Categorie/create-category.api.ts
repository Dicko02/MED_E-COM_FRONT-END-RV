import axios from "axios"

async function createCategory(nom: string, description: string) {
  try {
    const session = localStorage.getItem("adminSession")
    if (!session) throw new Error("Session introuvable")

    const { token } = JSON.parse(session)
    if (!token) throw new Error("Token manquant dans la session")

    const response = await axios.post(
      `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/categorie`,
      { nom, description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response
  } catch (error: any) {
    const message = error.response?.data?.message || "Échec de la création de la catégorie"
    console.error("Erreur createCategory:", message)
    throw new Error(message)
  }
}

export default createCategory
