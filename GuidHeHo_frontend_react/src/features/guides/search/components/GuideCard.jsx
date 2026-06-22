import { FaHeart, FaRegHeart } from "react-icons/fa"
import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../../../context/auth-context"
import GuideProfileSummary from "../../details/components/GuideProfileSummary"
import { useToggleFavorite } from "../../details/hooks/useToggleFavorite"

export default function GuideCard({ guide, onFavoriteRemoved }) {

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

    const BACKEND_URL = "http://127.0.0.1:8000"

    const profilePictureUrl = guide?.user?.profile_picture
        ? guide.user.profile_picture.startsWith("http")
            ? guide.user.profile_picture
            : `${BACKEND_URL}${guide.user.profile_picture.startsWith("/") ? "" : "/"}${guide.user.profile_picture}`
        : null

    async function handleToggleFavorite(e) {
        e.preventDefault()
        e.stopPropagation()

        if (!isAuthenticated || loading) return

        const data = await toggleFavorite()

        if (data && data.is_favorited === false) {
            onFavoriteRemoved?.(guide.id)
        }
    }

    // Affichage

    return (
        <article
            className="
                card bg-teal-50 dark:bg-teal-900
                w-full h-full min-h-70
                border border-teal-600
                shadow-sm
                transition-all duration-300
                hover:shadow-xl
                hover:border-teal-300
                hover:-translate-y-0.5
            "
        >
            <div className="card-body flex flex-col h-full">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        {profilePictureUrl ? (
                            <img
                                src={profilePictureUrl}
                                alt={`${guide.user.first_name} ${guide.user.last_name}`}
                                className="h-16 w-16 rounded-full object-cover bg-base-300 shrink-0"
                            />
                        ) : (
                            <div className="avatar placeholder shrink-0">
                                <div className="w-16 h-16 rounded-full bg-base-300 text-base-content flex items-center justify-center">
                                    <span className="text-sm font-semibold leading-none">
                                        {guide.user.last_name?.[0]}
                                        {guide.user.first_name?.[0] || "?"}
                                    </span>
                                </div>
                            </div>
                        )}

                        <h2 className="card-title truncate">
                            {guide.user.first_name} {guide.user.last_name}
                        </h2>
                    </div>

                    {isAuthenticated && (
                        <button
                            type="button"
                            onClick={handleToggleFavorite}
                            disabled={loading}
                            className="btn btn-ghost btn-sm btn-circle cursor-pointer shrink-0"
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

                <div className="mt-4 flex-1 overflow-hidden">
                    <GuideProfileSummary guide={guide} />
                </div>

                {error && (
                    <p className="text-error text-sm mt-2">
                        {error}
                    </p>
                )}

                <div className="card-actions justify-end mt-auto pt-4">
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
