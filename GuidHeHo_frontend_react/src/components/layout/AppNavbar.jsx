import { NavLink } from "react-router-dom"

function getNavLinkClassName(isActive) {
    return `px-3 py-2 rounded border transition ${
        isActive
            ? "bg-teal-800 text-white border-teal-900"
            : "text-white border-transparent hover:bg-teal-500/30 hover:border-teal-400"
    }`
}

export default function AppNavbar({ isAuthenticated, onLogout }) {
    return (
        <nav className="bg-teal-600 shadow-md rounded p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <NavLink
                to="/"
                className="flex items-center justify-between text-2xl font-bold tracking-wide text-white bg-teal-700 px-3 py-1 rounded-lg shadow"
            >
                GuidHeHo
            </NavLink>

            <div className="flex flex-col md:flex-row gap-2">
                <NavLink to="/" className={({ isActive }) => getNavLinkClassName(isActive)}>
                    Search
                </NavLink>
                <NavLink to="/become-guide" className={({ isActive }) => getNavLinkClassName(isActive)}>
                    Become a Guide
                </NavLink>
            </div>

            <div className="flex gap-4 items-center">
                {isAuthenticated ? (
                    <>
                        <NavLink to="/dashboard" className={({ isActive }) => getNavLinkClassName(isActive)}>
                            Dashboard
                        </NavLink>

                        <button
                            onClick={onLogout}
                            className="cursor-pointer text-white px-3 py-2 rounded border border-transparent transition hover:bg-teal-500/30 hover:border-teal-400"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/register" className={({ isActive }) => getNavLinkClassName(isActive)}>
                            Register
                        </NavLink>
                        <NavLink to="/login" className={({ isActive }) => getNavLinkClassName(isActive)}>
                            Login
                        </NavLink>
                    </>
                )}
            </div>
        </nav>
    )
}
