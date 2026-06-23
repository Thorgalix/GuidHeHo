import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "./context/auth-context"

import AppNavbar from "./components/layout/AppNavbar"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import DashboardPage from "./pages/dashboard/DashboardPage"
import BecomeGuidePage from "./pages/guides/BecomeGuidePage"
import GuideDetailsPage from "./pages/guides/GuideDetailsPage"
import SearchPage from "./pages/guides/SearchPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
import FavoriteGuidesPage from "./pages/guides/FavoriteGuidesPage"
import VerifyEmailPage from "./pages/auth/VerifyEmailPage"

export default function App() {
    // States
    const { isAuthenticated, authLoading, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    // Comportements
    async function handleLogout() {
        await logout()
        navigate("/login", { replace: true })
    }

    // Affichage
    return (
        <div className="min-h-screen bg-teal-100 dark:bg-teal-950">
            <AppNavbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />

            <Routes>
                <Route path="/" element={<SearchPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />

                <Route path="/guides/:id" element={<GuideDetailsPage />} />
                <Route path="/become-guide" element={<BecomeGuidePage />} />
                <Route
                    path="/dashboard"
                    element={
                        authLoading
                            ? <p>Chargement de la session...</p>
                            : isAuthenticated
                                ? <DashboardPage />
                                : <Navigate to="/login" replace />
                    }
                />
                <Route path="/favourites" element={
                    authLoading
                        ? <p>Chargement de la session...</p>
                        : isAuthenticated
                            ? <FavoriteGuidesPage />
                            : <Navigate to="/login" replace />
                }
                />
            </Routes>
        </div>
    )
}
