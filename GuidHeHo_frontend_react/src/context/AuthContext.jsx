import { createContext, useState, useEffect } from "react"
import { getUser, getAccessToken, getRefreshToken, clearAuth, saveUser } from "../services/auth"

export const AuthContext = createContext()

const BASE_URL = "http://127.0.0.1:8000"

export function AuthProvider({ children }) {
    // States
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [authLoading, setAuthLoading] = useState(true)

    // Comportements
    useEffect(() => {
        // Au chargement, on reconstruit la session depuis le localStorage.
        const storedUser = getUser()
        const token = getAccessToken()

        if (storedUser && token) {
            setUser(storedUser)
            setIsAuthenticated(true)
        }

        setAuthLoading(false)
    }, [])

    // On enregistre l'utilisateur dans le contexte après la connexion.
    function login(userData) {
        setUser(userData.user)
        setIsAuthenticated(true)
    }

    // Met a jour l'utilisateur en memoire et dans le stockage local.
    function updateUser(nextUser) {
        setUser(nextUser)
        saveUser(nextUser)
    }

    // On ferme la session côté UI et côté stockage local.
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