import { createContext, useState, useEffect } from "react"
import { getUser, getAccessToken, clearAuth } from "../services/auth"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    // States
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Comportements
    useEffect(() => {
        // Au chargement, on reconstruit la session depuis le localStorage.
        const storedUser = getUser()
        const token = getAccessToken()

        if (storedUser && token) {
            setUser(storedUser)
            setIsAuthenticated(true)
        }
    }, [])

    // On enregistre l'utilisateur dans le contexte après la connexion.
    function login(userData) {
        setUser(userData.user)
        setIsAuthenticated(true)
    }

    // On ferme la session côté UI et côté stockage local.
    function logout() {
        clearAuth()
        setUser(null)
        setIsAuthenticated(false)
    }

    // Affichage
    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}