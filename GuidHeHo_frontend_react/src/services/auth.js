const ACCESS_KEY = "guidheho_access_token"
const REFRESH_KEY = "guidheho_refresh_token"
const USER_KEY = "guidheho_user"

// Sauvegarde la session complète après connexion.
export function saveAuth(data) {
    localStorage.setItem(ACCESS_KEY, data.access)
    localStorage.setItem(REFRESH_KEY, data.refresh)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
}

// Récupère le token d'accès courant.
export function getAccessToken() {
    return localStorage.getItem(ACCESS_KEY)
}

// Récupère le refresh token courant.
export function getRefreshToken() {
    return localStorage.getItem(REFRESH_KEY)
}

// Met à jour uniquement le token d'accès.
export function saveAccessToken(token) {
    localStorage.setItem(ACCESS_KEY, token)
}

// Récupère l'utilisateur sauvegardé en localStorage.
export function getUser() {
    const user = localStorage.getItem(USER_KEY)
    if (!user) return null

    try {
        return JSON.parse(user)
    } catch {
        return null
    }
}

// Met à jour l'utilisateur courant dans le localStorage.
export function saveUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// Supprime toutes les données d'authentification locales.
export function clearAuth() {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(USER_KEY)
}
