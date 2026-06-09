import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import GuideProfileSummary from "./GuideProfileSummary"
import { useToggleFavorite } from "../hooks/useToggleFavorite"

export default function GuideCard({ guide }) {
   
    const { isAuthenticated } = useContext(AuthContext)

    const {
        isFavorited,
        favoritesCount,
        loading,
        error,
        toggleFavorite,
    } = useToggleFavorite({
        guideId: guide.id,
        initialIsFavorited: guide.is_favorited,
        initialFavoritesCount: guide.favorites_count,
    })

    function handleToggleFavorite(e) {
        e.preventDefault() // Empêche la navigation vers la page du guide
        e.stopPropagation() // Empêche la propagation de l'événement au parent Link
        
        if (!isAuthenticated || loading) return

        toggleFavorite().catch(() => {})
    }
   
    // Affichage

    return (
        <Link
            to={`/guides/${guide.id}`}
            className="guide-card"
            style={{ display: "block", border: "solid", paddingLeft: "20px", textAlign:"justify", textDecoration: "none", color: "inherit"}}
        >

            {/* Carte récapitulative d'un guide dans les résultats de recherche. */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
                <h3>
                    {guide.user.first_name} {guide.user.last_name}
                </h3>

                {isAuthenticated && (
                    <button type="button" onClick={handleToggleFavorite} disabled={loading}>
                        {loading
                            ? "Updating..."
                            : isFavorited
                                ? `Remove favorite`
                                : `Add to favorites`}
                    </button>
                )}
            </div>

            <GuideProfileSummary guide={guide} />
            {isAuthenticated && error && (
                <p style={{ color: "red" }}>{error}</p>
            )}
        </Link>
    )
}