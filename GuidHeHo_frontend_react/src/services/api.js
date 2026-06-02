import { getAccessToken, clearAuth } from "./auth"
import { getErrorMessage } from "./errors"

const BASE_URL = "http://127.0.0.1:8000"

async function request(url, options = {}) {
    const token = getAccessToken()

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    }

    // 👉 auto injection token
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(BASE_URL + url, {
        ...options,
        headers
    })

    let data = null

    try {
        data = await response.json()
    } catch {
        data = null
    }

    // 👉 gestion 401 globale
    if (response.status === 401) {
        clearAuth()
        window.location.href = "/login"
        throw new Error("Session expirée")
    }

    if (!response.ok) {
        throw new Error(getErrorMessage(data, response))
    }

    return data
}

export const api = {
    get: (url) => request(url),
    post: (url, body) =>
        request(url, {
            method: "POST",
            body: JSON.stringify(body)
        }),
    put: (url, body) =>
        request(url, {
            method: "PUT",
            body: JSON.stringify(body)
        }),
    delete: (url) =>
        request(url, {
            method: "DELETE"
        })
}
