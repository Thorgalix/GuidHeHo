const ACCESS_KEY = "guidheho_access_token"
const REFRESH_KEY = "guidheho_refresh_token"
const USER_KEY = "guidheho_user"

export function saveAuth(data) {
    localStorage.setItem(ACCESS_KEY, data.access)
    localStorage.setItem(REFRESH_KEY, data.refresh)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
}

export function getAccessToken() {
    return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken() {
    return localStorage.getItem(REFRESH_KEY)
}

export function getUser() {
    const user = localStorage.getItem(USER_KEY)
    if (!user) return null

    try {
        return JSON.parse(user)
    } catch {
        return null
    }
}

export function clearAuth() {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(USER_KEY)
}
