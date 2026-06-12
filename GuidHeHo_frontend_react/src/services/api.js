import { getAccessToken, getRefreshToken, saveAccessToken, clearAuth } from "./auth"
import { getErrorMessage } from "./errors"

// URL de base de l'API backend.
const BASE_URL = "http://127.0.0.1:8000"

// Promesse partagée pour éviter plusieurs refresh en parallèle.
let refreshPromise = null

async function refreshAccessToken() {
    // Si un refresh est déjà en cours, on réutilise la même promesse.
    if (refreshPromise) return refreshPromise

    refreshPromise = (async () => {
        // On récupère le refresh token stocké localement.
        const refresh = getRefreshToken()

        if (!refresh) throw new Error("No refresh token")

        const response = await fetch(`${BASE_URL}/api/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh })
        })

        if (!response.ok) {
            // Si le refresh échoue, la session est considérée comme expirée.
            clearAuth()
            window.location.href = "/login"
            throw new Error("Refresh failed")
        }

        // On remplace seulement le token d'accès, pas le refresh token.
        const data = await response.json()
        saveAccessToken(data.access)

        return data.access
    })()

    return refreshPromise.finally(() => {
        refreshPromise = null
    })
}


function normalizeResponse(data) {
    // Si l'API renvoie une réponse vide, on retourne un tableau vide.
    if (!data) return []

    // Réponse paginée DRF.
    if (data.results && Array.isArray(data.results)) {
        return {
            results: data.results,
            count: data.count,
            next: data.next,
            previous: data.previous
        }
    }

    // Liste simple.
    if (Array.isArray(data)) {
        return data
    }

    // Objet simple.
    return data
}

async function request(url, options = {}) {
    // On injecte automatiquement le token d'accès courant.
    const token = getAccessToken()

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    }

    // auto injection token
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const finalUrl = url.startsWith("http") ? url : BASE_URL + url

    // Première tentative de requête.
    const response = await fetch(finalUrl, {
        ...options,
        headers
    })

    let data = null

    try {
        data = await response.json()
    } catch {
        data = null
    }

    const shouldTryRefresh = response.status === 401 && !options.skipAuthRefresh && !!token && !!getRefreshToken()

    // Gestion globale du 401 avec refresh automatique pour les routes protégées.
    if (shouldTryRefresh) {
        try {
            const newAccessToken = await refreshAccessToken()

            // On rejoue la requête avec le nouveau token.
            const retryResponse = await fetch(finalUrl, {
                ...options,
                headers: {
                    ...headers,
                    Authorization: `Bearer ${newAccessToken}`
                }
            })

            const retryData = await retryResponse.json().catch(() => null)

            if (!retryResponse.ok) {
                throw new Error(getErrorMessage(retryData, retryResponse))
            }

            return normalizeResponse(retryData)
        } catch (err) {
            // Si le refresh échoue, on force une reconnexion.
            clearAuth()
            window.location.href = "/login"
            throw err
        }
    }


    if (!response.ok) {
        throw new Error(getErrorMessage(data, response))
    }

    return normalizeResponse(data)
}

// Petit wrapper CRUD pour éviter de répéter fetch partout dans l'UI.
export const api = {
    get: (url) => request(url),
    post: (url, body, options = {}) =>
        request(url, {
            method: "POST",
            body: JSON.stringify(body),
            ...options
        }),
    put: (url, body, options = {}) =>
        request(url, {
            method: "PUT",
            body: JSON.stringify(body),
            ...options
        }),
    patch: (url, body, options = {}) =>
        request(url, {
            method: "PATCH",
            body: JSON.stringify(body),
            ...options
        }),
    delete: (url, options = {}) =>
        request(url, {
            method: "DELETE",
            ...options
        })
}
