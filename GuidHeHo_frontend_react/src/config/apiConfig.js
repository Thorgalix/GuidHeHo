const configuredApiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

// Les chemins de l'API commencent déjà par "/" : on retire donc les
// "/" finaux de l'URL de base pour éviter les requêtes en "//users/...".
export const API_BASE_URL = configuredApiUrl.replace(/\/+$/, "")
