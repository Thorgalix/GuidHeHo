import { useState, useContext } from "react"
import { useParams } from "react-router-dom"
import { useToggleFavorite } from "../hooks/useToggleFavorite"
import { useGuideDetails } from "../hooks/useGuideDetails"
import { useGuideReviews } from "../hooks/useGuideReviews"
import { AuthContext } from "../context/AuthContext"
import { api } from "../services/api"
import GuideHeader from "../components/GuideHeader"
import GuideBookingForm from "../components/GuideBookingForm"
import GuideDetailMap from "../components/GuideDetailMap"
import ReviewList from "../components/ReviewList"
import ReviewForm from "../components/ReviewForm"





export default function GuideDetails() {

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
    } = useGuideReviews(id)

    async function handleBookingSubmit(payload) {
        try {
            setStatus("Sending...")

            await api.post("/bookings/", {
                guide: guide.id,
                ...payload,
            })

            setStatus("Booking sent!")
            setShowBooking(false)
        } catch (err) {
            setStatus(err.message)
        }
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p style={{ color: "red" }}>{error}</p>
    if (!guide) return <p>No guide found</p>

    // Affichage

    return (
        <div style={{ padding: "20px" }}>
            <GuideHeader guide={guide} />
            {isAuthenticated && (
                <button onClick={() => setShowBooking(true)} disabled={availabilities.length === 0}>
                    Book this guide
                </button>
            )}
            {isAuthenticated && (
                <button type="button" onClick={toggleFavorite} disabled={favoriteLoading}>
                    {favoriteLoading
                        ? "Updating..."
                        : isFavorited
                            ? `Remove favorite`
                            : `Add to favorites`}
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
            
            <ReviewForm
                guideId={guide.id}
                onCreated={reloadReviews}
                canReview={isAuthenticated && user?.role === "traveler"}
            />

            <ReviewList reviews={reviews ?? []} loading={reviewsLoading} error={reviewsError} />

            <GuideDetailMap guide={guide} />
        </div>
    )
}

