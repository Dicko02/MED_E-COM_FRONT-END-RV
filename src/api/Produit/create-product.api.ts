import axios from "axios"

async function createProduct(formData: FormData) {
  try {
    const session = localStorage.getItem("adminSession")
    if (!session) throw new Error("Session introuvable")

    const { token } = JSON.parse(session)
    if (!token) throw new Error("Token manquant dans la session")

    const response = await axios.post(
      `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/produit`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    )

    return response
  } catch (error: any) {
    const message = error.response?.data?.message || "Échec de la création du produit"
    console.error("Erreur createProduct:", message)
    throw new Error(message)
  }
}

export default createProduct
