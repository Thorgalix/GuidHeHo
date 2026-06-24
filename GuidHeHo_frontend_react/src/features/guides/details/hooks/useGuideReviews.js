import { useCallback } from "react"
import { fetchGuideReviews } from "../../../../services/reviews"
import { usePaginatedReviews } from "../../../reviews/hooks/usePaginatedReviews"

export function useGuideReviews(guideId) {
    const fetchReviews = useCallback(
        (page) => fetchGuideReviews(guideId, page),
        [guideId]
    )

    return usePaginatedReviews({
        enabled: Boolean(guideId),
        fetchReviews,
        resetKey: guideId,
    })
}
