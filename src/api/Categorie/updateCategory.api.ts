import axios from "axios"

async function updateCategory(id: number, nom: string, description: string) {
  try {
    const session = localStorage.getItem("adminSession")
    if (!session) throw new Error("Session introuvable")

    const { token } = JSON.parse(session)
    if (!token) throw new Error("Token manquant dans la session")

    const response = await axios.put(
      `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/categorie/${id}`,
      { nom, description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response
  } catch (error: any) {
    const message = error.response?.data?.message || "Échec de la mise à jour de la catégorie"
    console.error("Erreur updateCategory:", message)
    throw new Error(message)
  }
}

export default updateCategory
