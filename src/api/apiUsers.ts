// Central API client used by all API modules.
export const API_BASE_URL = (import.meta).env?.VITE_API_BASE_URL || "http://localhost:5000/api";

const USE_CREDENTIALS = ((import.meta).env?.VITE_API_USE_CREDENTIALS || "true") === "true";

export const apiUsers = {
  request: async (endpoint: string, options: RequestInit = {}) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const isFormData = options.body instanceof FormData;

    const headers: Record<string, string> = {
      // IMPORTANT : ne pas mettre Content-Type si c'est FormData
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: USE_CREDENTIALS ? "include" : undefined,
      headers,
      // Remplacer par ceci :
      body: options.body ? (isFormData ? options.body : JSON.stringify(options.body)) : undefined,
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error("UNAUTHORIZED");

      const error = await response
        .json()
        .catch(() => ({ message: "Erreur réseau" }));

      throw new Error(error.message || "Erreur lors de la requête");
    }

    if (response.status === 204) return null;

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }

    return response.text();
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    return apiUsers.request("/produits/uploadImage", {
      method: "POST",
      body: formData,
      // Pas de headers → nécessaire pour FormData
      headers: {},
    } as RequestInit);
  },
};
