import { Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "./context/AuthContext"

import Search from "./pages/Search"
import Login from "./pages/Login"
import Register from "./pages/Register"
import GuideDetails from "./pages/GuideDetails"
import BecomeGuide from "./pages/BecomeGuide"
import Dashboard from "./pages/Dashboard"

export default function App() {
    // States
    const { user, isAuthenticated, authLoading, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    // Comportements
    async function handleLogout() {
        await logout()
        navigate("/login", { replace: true })
    }

    // Affichage
    return (
        <div className="min-h-screen bg-teal-100 dark:bg-teal-950">
            <nav className="
            bg-teal-600 
            shadow-md 
            rounded
            p-4 
            flex 
            flex-col
            md:flex-row
            md:justify-between 
            md:items-center
            gap-4
        ">
                <NavLink
                    to="/"
                    className="
                    flex 
                    items-center 
                    justify-between 
                    text-2xl 
                    font-bold 
                    tracking-wide 
                    text-white 
                    bg-teal-700 
                    px-3 
                    py-1 
                    rounded-lg 
                    shadow"
                >
                    GuidHeHo
                </NavLink>
                <div className="flex flex-col md:flex-row gap-2">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `px-3 py-2 rounded border transition
                        ${isActive
                                ? "bg-teal-800 text-white border-teal-900"
                                : " text-white border-transparent hover:bg-teal-500/30 hover:border-teal-400 "
                            }`
                        }
                    >
                        Search
                    </NavLink>
                    <NavLink
                        to="/become-guide"
                        className={({ isActive }) =>
                            `px-3 py-2 rounded border transition
                        ${isActive
                                ? "bg-teal-800 text-white border-teal-900"
                                : " text-white border-transparent hover:bg-teal-500/30 hover:border-teal-400 "
                            }`
                        }
                    >
                        Become a Guide
                    </NavLink>
                </div>

                <div className="flex gap-4 items-center">
                    {isAuthenticated ? (
                        <>
                            <NavLink 
                            to="/dashboard" 
                            className={({ isActive }) =>
                                `px-3 py-2 rounded border transition
                            ${isActive
                                    ? "bg-teal-800 text-white border-teal-900"
                                    : " text-white border-transparent hover:bg-teal-500/30 hover:border-teal-400 "
                                }`
                            }
                            >
                                Dashboard
                            </NavLink>

                            <button onClick={handleLogout} className="
                            cursor-pointer 
                            text-white 
                            px-3 
                            py-2 
                            rounded 
                            border 
                            border-transparent 
                            transition 
                            hover:bg-teal-500/30 
                            hover:border-teal-400">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/register" className={({ isActive }) =>
                                `px-3 py-2 rounded border transition
                            ${isActive
                                    ? "bg-teal-800 text-white border-teal-900"
                                    : " text-white border-transparent hover:bg-teal-500/30 hover:border-teal-400 "
                                }`
                            }
                            >
                                Register
                            </NavLink>
                            <NavLink to="/login" className={({ isActive }) =>
                                `px-3 py-2 rounded border transition
                            ${isActive
                                    ? "bg-teal-800 text-white border-teal-900"
                                    : " text-white border-transparent hover:bg-teal-500/30 hover:border-teal-400 "
                                }`
                            }
                            >
                                Login
                            </NavLink>
                        </>
                    )}
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Search />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/guides/:id" element={<GuideDetails />} />
                <Route path="/become-guide" element={<BecomeGuide />} />
                <Route
                    path="/dashboard"
                    element={
                        authLoading
                            ? <p>Loading session...</p>
                            : isAuthenticated
                                ? <Dashboard />
                                : <Navigate to="/login" replace />
                    }
                />
            </Routes>
        </div>
    )
}