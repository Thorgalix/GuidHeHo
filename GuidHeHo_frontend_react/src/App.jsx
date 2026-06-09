import { Routes, Route, NavLink } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "./context/AuthContext"
import { clearAuth } from "./services/auth"

import Search from "./pages/Search"
import Login from "./pages/Login"
import Register from "./pages/Register"
import GuideDetails from "./pages/GuideDetails"
import BecomeGuide from "./pages/BecomeGuide"
import MyBookings from "./pages/MyBookings"

export default function App() {
    // States
    const { user, isAuthenticated, logout } = useContext(AuthContext)

    // Comportements
    function handleLogout() {
        // On vide le stockage local puis on met à jour le contexte React.
        clearAuth()
        logout()
    }

    // Affichage
    return (
        <>
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
                    className="flex items-center justify-between text-2xl font-bold tracking-wide text-white bg-teal-700 px-3 py-1 rounded-lg shadow"
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
                    <NavLink
                        to="/bookings"
                        className={({ isActive }) =>
                            `px-3 py-2 rounded border transition
                        ${isActive
                                ? "bg-teal-800 text-white border-teal-900"
                                : " text-white border-transparent hover:bg-teal-500/30 hover:border-teal-400 "
                            }`
                        }
                    >
                        My Bookings
                    </NavLink>
                </div>

                <div className="flex gap-4 items-center">
                    {isAuthenticated ? (
                        <>
                            <span className="px-3 py-2 text-white">
                                Welcome {user.firstname}!
                            </span>

                            <button onClick={handleLogout} className="cursor-pointer text-white px-3 py-2 rounded border border-transparent transition hover:bg-teal-500/30 hover:border-teal-400">
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
                <Route path="/bookings" element={<MyBookings />} />
            </Routes>
        </>
    )
}