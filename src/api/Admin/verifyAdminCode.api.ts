import axios from "axios"

async function fetchAdminVerifyCode(code: string, email: string) {
  try {

    const response = await axios.post(
      `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/admin/verify/${email}`,
      { code },
    );

    return response;
  } catch (error: any) {
    const message = error.response?.data?.message || "Échec de la verification de code envoyer par mail";
    console.error("Erreur fetchAdminVerifyCode:", message);
    throw new Error(message);
  }
}

export default fetchAdminVerifyCode
