import { useCallback, useEffect, useRef, useState } from "react"

const REVIEWS_PAGE_SIZE = 10

export function usePaginatedReviews({ enabled = true, fetchReviews, resetKey }) {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [pageState, setPageState] = useState({ resetKey, page: 1 })
    const [count, setCount] = useState(0)
    const [next, setNext] = useState(null)
    const [previous, setPrevious] = useState(null)
    const requestIdRef = useRef(0)
    const page = pageState.resetKey === resetKey ? pageState.page : 1

    const loadReviews = useCallback(async () => {
        const requestId = requestIdRef.current + 1
        requestIdRef.current = requestId

        if (!enabled || !fetchReviews) {
            setReviews([])
            setCount(0)
            setNext(null)
            setPrevious(null)
            setError("")
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError("")

            const data = await fetchReviews(page)

            if (requestIdRef.current !== requestId) return

            setReviews(data?.results ?? [])
            setCount(data?.count ?? 0)
            setNext(data?.next ?? null)
            setPrevious(data?.previous ?? null)
        } catch (err) {
            if (requestIdRef.current !== requestId) return

            setReviews([])
            setCount(0)
            setNext(null)
            setPrevious(null)
            setError(err?.message || "Impossible de charger les avis")
        } finally {
            if (requestIdRef.current === requestId) {
                setLoading(false)
            }
        }
    }, [enabled, fetchReviews, page])

    useEffect(() => {
        Promise.resolve().then(loadReviews)
    }, [loadReviews])

    const totalPages = Math.ceil(count / REVIEWS_PAGE_SIZE)
    const setPage = (nextPage) => {
        setPageState({ resetKey, page: nextPage })
    }

    return {
        reviews,
        loading,
        error,
        page,
        count,
        next,
        previous,
        totalPages,
        setPage,
        reload: loadReviews,
    }
}
