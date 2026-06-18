import { FaHeart, FaRegHeart } from "react-icons/fa"
import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../../../context/AuthContext"
import GuideProfileSummary from "../../details/components/GuideProfileSummary"
import { useToggleFavorite } from "../../details/hooks/useToggleFavorite"

export default function GuideCard({ guide }) {

    const { isAuthenticated } = useContext(AuthContext)

    const {
        isFavorited,
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

        toggleFavorite().catch(() => { })
    }

    // Affichage

    return (
        <article
            className="
                    card bg-teal-50 dark:bg-teal-900
                    w-full
                    border border-teal-600 
                    shadow-sm 
                    transition-all duration-300
                    hover:shadow-xl
                    hover:border-teal-300
                    hover:-translate-y-0.5
                    "
        >

            <div className="card-body">
                <div className="flex justify-between items-start w-full gap-2">
                    <h2 className="card-title flex-1 min-w-0">
                        {guide.user.first_name} {guide.user.last_name}
                    </h2>

                    {isAuthenticated && (
                        <button
                            type="button"
                            onClick={handleToggleFavorite}
                            disabled={loading}
                            className="btn btn-ghost btn-sm btn-circle cursor-pointer"
                            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                        >
                            {isFavorited ? (
                                <FaHeart className="text-xl text-red-500" />
                            ) : (
                                <FaRegHeart className="text-xl text-red-500" />
                            )}
                        </button>
                    )}
                </div>

                <GuideProfileSummary guide={guide} />

                {error && (
                    <p className="text-error text-sm">
                        {error}
                    </p>
                )}

                <div className="card-actions justify-end">
                    <Link
                        to={`/guides/${guide.id}`}
                        className="btn bg-teal-500 hover:bg-teal-600 text-white border-none"
                    >
                        View More
                    </Link>
                </div>
            </div>
        </article>
    )
}
