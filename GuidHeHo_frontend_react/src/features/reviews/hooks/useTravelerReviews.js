import { useCallback } from "react"
import { fetchTravelerReviews } from "../../../services/reviews"
import { usePaginatedReviews } from "./usePaginatedReviews"

export function useTravelerReviews(travelerId) {
    const fetchReviews = useCallback(
        (page) => fetchTravelerReviews(travelerId, page),
        [travelerId]
    )

    return usePaginatedReviews({
        enabled: Boolean(travelerId),
        fetchReviews,
        resetKey: travelerId,
    })
}
