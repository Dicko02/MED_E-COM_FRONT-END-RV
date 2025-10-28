import axios from "axios"

async function updateClient(id: number, data: any) {
  try {
    const session = localStorage.getItem("adminSession") || localStorage.getItem("clientSession")
    if (!session) throw new Error("Session introuvable")

    const { token } = JSON.parse(session)
    if (!token) throw new Error("Token manquant dans la session")

    const response = await axios.put(
      `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/client/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response
  } catch (error: any) {
    const message = error.response?.data?.message || "Échec de la mise à jour du client"
    console.error("Erreur updateClient:", message)
    throw new Error(message)
  }
}

export default updateClient
