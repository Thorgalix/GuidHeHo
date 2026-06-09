import { useState, useEffect, useRef } from "react"
import { fetchGuideReviews } from "../services/reviews"

export function useGuideReviews(guideId) {

    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const isMountedRef = useRef(true)

    const loadReviews = async () => {
        try {
            if (!guideId) {
                if (isMountedRef.current) {
                    setReviews([])
                    setLoading(false)
                    setError("")
                }
                return
            }

            if (isMountedRef.current) {
                setLoading(true)
                setError("")
            }

            const data = await fetchGuideReviews(guideId)

            if (Array.isArray(data)) {
                if (isMountedRef.current) {
                    setReviews(data)
                    setError("")
                }
            } else if (Array.isArray(data?.results)) {
                if (isMountedRef.current) {
                    setReviews(data.results)
                    setError("")
                }
            } else {
                if (isMountedRef.current) {
                    setReviews([])
                    setError("Invalid response format")
                }
            }

        } catch (err) {
            if (isMountedRef.current) {
                setError(err?.message || "Failed to load reviews")
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        isMountedRef.current = true
        const cleanup = () => {
            isMountedRef.current = false
        }
        loadReviews()
        return cleanup
    }, [guideId])


    const reload = () => {
        loadReviews()
    }

    return {
        reviews,
        loading,
        error,
        reload
    }
}