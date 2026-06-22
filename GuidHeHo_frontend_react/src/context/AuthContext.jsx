import { useState } from "react"
import { getUser, getAccessToken, getRefreshToken, clearAuth, saveUser } from "../services/auth"
import { AuthContext } from "./auth-context"
import { API_BASE_URL } from "../config/apiConfig"

const BASE_URL = API_BASE_URL

export function AuthProvider({ children }) {
    // States
    const [user, setUser] = useState(() => getUser())
    const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getUser() && getAccessToken()))
    const [authLoading] = useState(false)

    // On enregistre l'utilisateur dans le contexte après la connexion.
    function login(userData) {
        setUser(userData.user)
        setIsAuthenticated(true)
    }

    // Met a jour l'utilisateur en memoire.
    function updateUser(nextUser) {
        setUser(nextUser)
        saveUser(nextUser)
    }

    // On ferme la session côté UI et côté mémoire.
    async function logout() {
        const refresh = getRefreshToken()

        try {
            if (refresh) {
                await fetch(`${BASE_URL}/users/logout/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {}),
                    },
                    body: JSON.stringify({ refresh }),
                })
            }
        } finally {
            clearAuth()
            setUser(null)
            setIsAuthenticated(false)
        }
    }

    // Affichage
    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            isAuthenticated,
            authLoading,
            login,
            updateUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}
