import { NavLink } from "react-router-dom"
import { FaSearch } from "react-icons/fa";

function getNavLinkClassName(isActive) {
    return `px-3 py-2 rounded border transition ${isActive
        ? "bg-teal-700 text-white font-bold border-teal-800"
        : "text-white font-bold border-transparent hover:bg-teal-600 hover:border-teal-800"
        }`
}

export default function AppNavbar({ isAuthenticated, isGuide, onLogout }) {
    return (
        <nav className="bg-teal-500 shadow-md rounded p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <NavLink
                to="/"
                className="flex items-center justify-between bg-teal-600 px-3 py-1 rounded-lg shadow"
            >
                <img src="/guidheho-logo-transparent.svg" alt="GuidHeHo Logo" className="h-14 w-auto" />
            </NavLink>

            <div className="flex gap-4 items-center">
                <NavLink to="/" className={({ isActive }) => getNavLinkClassName(isActive)}>
                    <FaSearch
                        aria-label="Lien pour rechercher des guides"
                        className="inline-block mr-1" size={15}
                    />
                </NavLink>
                {!isGuide && (
                    <NavLink to="/become-guide" className={({ isActive }) => getNavLinkClassName(isActive)}>
                        Devenir guide
                    </NavLink>
                )}
                {isAuthenticated ? (
                    <>
                        <NavLink to="/dashboard" className={({ isActive }) => getNavLinkClassName(isActive)}>
                            Tableau de bord
                        </NavLink>

                        <NavLink to="/favourites" className={({ isActive }) => getNavLinkClassName(isActive)}>
                            Mes favoris
                        </NavLink>

                        <button
                            onClick={onLogout}
                            className="cursor-pointer text-white font-bold px-3 py-2 rounded border border-transparent transition hover:bg-teal-900 hover:border-teal-950"
                        >
                            Déconnexion
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/register" className={({ isActive }) => getNavLinkClassName(isActive)}>
                            Inscription
                        </NavLink>
                        <NavLink to="/login" className={({ isActive }) => getNavLinkClassName(isActive)}>
                            Connexion
                        </NavLink>
                    </>
                )}
            </div>
        </nav>
    )
}
