import { useEffect, useState } from "react"
import { api } from "../../../services/api"

export function useGuideProfile(user) {
    const isGuide = user?.role === "guide"

    const [guide, setGuide] = useState(null)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(isGuide)
    const [reviewsLoading, setReviewsLoading] = useState(false)
    const [error, setError] = useState("")
    const [reviewsError, setReviewsError] = useState("")

    useEffect(() => {
        let isMounted = true

        async function loadGuideProfile() {
            if (!isGuide) {
                if (isMounted) {
                    setGuide(null)
                    setLoading(false)
                    setError("")
                }
                return
            }

            if (isMounted) {
                setLoading(true)
                setError("")
            }

            try {
                const guideProfile = await api.get("/api/guides/me/")

                if (isMounted) {
                    setGuide(guideProfile)
                }
            } catch {
                if (isMounted) {
                    setGuide(null)
                    setError("Impossible de charger le profil guide pour le moment.")
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        loadGuideProfile()

        return () => {
            isMounted = false
        }
    }, [isGuide])

    useEffect(() => {
        let isMounted = true

        async function loadGuideReviews() {
            if (!isGuide || !guide?.id) {
                if (isMounted) {
                    setReviews([])
                }
                return
            }

            if (isMounted) {
                setReviewsLoading(true)
                setReviewsError("")
            }

            try {
                const response = await api.get(`/reviews/${guide.id}/`)

                if (isMounted) {
                    setReviews(response.results ?? response ?? [])
                }
            } catch {
                if (isMounted) {
                    setReviews([])
                    setReviewsError("Impossible de charger les avis guide pour le moment.")
                }
            } finally {
                if (isMounted) {
                    setReviewsLoading(false)
                }
            }
        }

        loadGuideReviews()

        return () => {
            isMounted = false
        }
    }, [isGuide, guide?.id])

    return {
        isGuide,
        guide,
        setGuide,
        reviews,
        setReviews,
        loading,
        reviewsLoading,
        error,
        reviewsError,
    }
}
