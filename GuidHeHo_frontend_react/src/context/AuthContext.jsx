import { createContext, useState, useEffect } from "react"
import { getUser, getAccessToken, clearAuth } from "../services/auth"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const storedUser = getUser()
        const token = getAccessToken()

        if (storedUser && token) {
            setUser(storedUser)
            setIsAuthenticated(true)
        }
    }, [])

    function login(userData) {
        setUser(userData.user)
        setIsAuthenticated(true)
    }

    function logout() {
        clearAuth()
        setUser(null)
        setIsAuthenticated(false)
    }

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