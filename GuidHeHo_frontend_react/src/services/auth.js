// Store d'auth en mémoire uniquement (jamais persistant dans le navigateur).
const authState = {
    access: null,
    refresh: null,
    user: null,
}

// Sauvegarde la session complète après connexion, en mémoire.
export function saveAuth(data) {
    authState.access = data?.access ?? null
    authState.refresh = data?.refresh ?? null
    authState.user = data?.user ?? null
}

// Récupère le token d'accès courant.
export function getAccessToken() {
    return authState.access
}

// Récupère le refresh token courant.
export function getRefreshToken() {
    return authState.refresh
}

// Met à jour uniquement le token d'accès.
export function saveAccessToken(token) {
    authState.access = token ?? null
}

// Récupère l'utilisateur courant en mémoire.
export function getUser() {
    return authState.user
}

// Met à jour l'utilisateur courant en mémoire.
export function saveUser(user) {
    authState.user = user ?? null
}

// Supprime toutes les données d'authentification en mémoire.
export function clearAuth() {
    authState.access = null
    authState.refresh = null
    authState.user = null
}
