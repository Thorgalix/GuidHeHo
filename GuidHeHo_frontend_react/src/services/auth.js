const ACCESS_TOKEN_KEY = "guidheho_access_token"
const REFRESH_TOKEN_KEY = "guidheho_refresh_token"
const USER_KEY = "guidheho_user"


// Sauvegarde la session complète après connexion, en mémoire.
export function saveAuth(data) {
    saveAccessToken(data?.access ?? null)
    saveRefreshToken(data?.refresh ?? null)
    saveUser(data?.user ?? null)
}


// Récupère le token d'accès courant.
export function getAccessToken() {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

// Récupère le refresh token courant.
export function getRefreshToken() {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY)
}

// Met à jour uniquement le token d'accès.
export function saveAccessToken(token) {
    if (token) {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
    } else {
        sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    }
}

function saveRefreshToken(token) {
    if (token) {
        sessionStorage.setItem(REFRESH_TOKEN_KEY, token)
    } else {
        sessionStorage.removeItem(REFRESH_TOKEN_KEY)
    }
}

// Récupère l'utilisateur courant en mémoire.
export function getUser() {
    const rawUser = sessionStorage.getItem(USER_KEY)
    if (!rawUser) return null

    try {
        return JSON.parse(rawUser)
    } catch {
        sessionStorage.removeItem(USER_KEY)
        return null
    }
}

// Met à jour l'utilisateur courant en mémoire.
export function saveUser(user) {
    if (user) {
        sessionStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
        sessionStorage.removeItem(USER_KEY)
    }
}

// Supprime toutes les données d'authentification en mémoire.
export function clearAuth() {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    sessionStorage.removeItem(REFRESH_TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
}
