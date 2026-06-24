import { useState, useContext } from "react"
import { useParams } from "react-router-dom"
import { useToggleFavorite } from "../../features/guides/details/hooks/useToggleFavorite"
import { useGuideDetails } from "../../features/guides/details/hooks/useGuideDetails"
import { useGuideReviews } from "../../features/guides/details/hooks/useGuideReviews"
import { useCanReviewGuide } from "../../features/guides/details/hooks/useCanReviewGuide"
import { AuthContext } from "../../context/auth-context"
import { api } from "../../services/api"
import GuideHeader from "../../features/guides/details/components/GuideHeader"
import GuideBookingForm from "../../features/guides/details/components/GuideBookingForm"
import GuideDetailMap from "../../features/guides/details/components/GuideDetailMap"
import ReviewList from "../../features/reviews/components/ReviewList"
import ReviewsPagination from "../../features/reviews/components/ReviewsPagination"
import ReviewForm from "../../features/guides/details/components/ReviewForm"





export default function GuideDetailsPage() {

    // States

    const { id } = useParams()

    const { isAuthenticated, user } = useContext(AuthContext)
    const [showBooking, setShowBooking] = useState(false)
    const [status, setStatus] = useState("")

    const {
        guide,
        loading,
        error,
        availabilities,
    } = useGuideDetails(id)

    const {
        isFavorited,
        loading: favoriteLoading,
        error: favoriteError,
        toggleFavorite,
    } = useToggleFavorite({
        guideId: id,
        initialIsFavorited: guide?.is_favorited,
        initialFavoritesCount: guide?.favorites_count,
    })

    const {
        reviews,
        loading: reviewsLoading,
        error: reviewsError,
        reload: reloadReviews,
        page: reviewsPage,
        totalPages: reviewsTotalPages,
        next: reviewsNext,
        previous: reviewsPrevious,
        setPage: setReviewsPage,
    } = useGuideReviews(id)

    const {
        canReview,
        loading: canReviewLoading,
    } = useCanReviewGuide({
        guideId: guide?.id,
        enabled: isAuthenticated && user?.role === "traveler",
    })

    async function handleBookingSubmit(payload) {
        try {
            setStatus("Envoi...")

            await api.post("/bookings/", {
                guide: guide.id,
                ...payload,
            })

            setStatus("Demande de réservation envoyée !")
            setShowBooking(false)
        } catch (err) {
            setStatus(err.message)
        }
    }

    if (loading) return <p>Chargement...</p>
    if (error) return <p style={{ color: "red" }}>{error}</p>
    if (!guide) return <p>Aucun guide trouvé</p>

    // Affichage

    return (
        <main style={{ padding: "20px" }}>
            <GuideHeader guide={guide} />
            {isAuthenticated && (
                <button onClick={() => setShowBooking(true)} disabled={availabilities.length === 0}>
                    Réserver ce guide
                </button>
            )}
            {isAuthenticated && (
                <button type="button" onClick={toggleFavorite} disabled={favoriteLoading}>
                    {favoriteLoading
                        ? "Mise à jour..."
                        : isFavorited
                            ? `Retirer des favoris`
                            : `Ajouter aux favoris`}
                </button>
            )}
            {isAuthenticated && favoriteError && (
                <p style={{ color: "red" }}>{favoriteError}</p>
            )}


            {showBooking && (
                <GuideBookingForm
                    availabilities={availabilities}
                    onSubmit={handleBookingSubmit}
                    status={status}
                />
            )}

            {isAuthenticated && (
                <ReviewForm
                    guideId={guide.id}
                    onCreated={reloadReviews}
                    canReview={!canReviewLoading && canReview}
                />
            )}

            <ReviewList
                title="Avis"
                reviews={reviews ?? []}
                loading={reviewsLoading}
                error={reviewsError}
                emptyMessage="Aucun avis pour le moment."
                getAuthorLabel={(review) =>
                    review.traveler
                        ? `${review.traveler.first_name} ${review.traveler.last_name}`
                        : "Voyageur"
                }
            />

            <ReviewsPagination
                page={reviewsPage}
                totalPages={reviewsTotalPages}
                previous={reviewsPrevious}
                next={reviewsNext}
                onPageChange={setReviewsPage}
            />

            <GuideDetailMap guide={guide} />
        </main>
    )
}
