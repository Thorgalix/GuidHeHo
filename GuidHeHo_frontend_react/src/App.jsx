import { Routes, Route, Link } from "react-router-dom"
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
    const { user, isAuthenticated, logout } = useContext(AuthContext)

    function handleLogout() {
        clearAuth()
        logout()
    }

    return (
        <div>
            <h1><Link to="/">GuidHeHo</Link></h1>

            <nav>
                <Link to="/">Search</Link>{" | "}
                <Link to="/login">Login</Link>{" | "}
                <Link to="/register">Register</Link>{" | "}
                <Link to="/become-guide">Become a Guide</Link>{" | "}
                <Link to="/bookings">My Bookings</Link>

                {" | "}

                {isAuthenticated && (
                    <>
                        <span>
                            Welcome {user?.first_name}
                        </span>

                        {" | "}

                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}
            </nav>

            <Routes>
                <Route path="/" element={<Search />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/guides/:id" element={<GuideDetails />} />
                <Route path="/become-guide" element={<BecomeGuide />} />
                <Route path="/bookings" element={<MyBookings />} />
            </Routes>
        </div>
    )
}