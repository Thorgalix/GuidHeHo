import { useEffect, useState } from "react"
import { api } from "../../../../services/api"

export function useCanReviewGuide({ guideId, enabled }) {
    const [canReview, setCanReview] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let isMounted = true

        async function loadBookings() {
            if (!enabled || !guideId) {
                if (isMounted) {
                    setCanReview(false)
                    setLoading(false)
                }
                return
            }

            if (isMounted) {
                setLoading(true)
            }

            try {
                const bookings = await api.get("/bookings/my/")
                const hasAcceptedBooking = Array.isArray(bookings) && bookings.some((booking) =>
                    String(booking.guide?.id) === String(guideId) &&
                    booking.status === "accepted"
                )

                if (isMounted) {
                    setCanReview(hasAcceptedBooking)
                }
            } catch {
                if (isMounted) {
                    setCanReview(false)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        Promise.resolve().then(loadBookings)

        return () => {
            isMounted = false
        }
    }, [enabled, guideId])

    return {
        canReview,
        loading,
    }
}
