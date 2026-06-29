import { useCallback, useState } from "react"
import { api } from "../../../../services/api"

export function useSearchGuides() {
    // States
    const [guides, setGuides] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [hasSearched, setHasSearched] = useState(false)
    const [next, setNext] = useState(null)
    const [previous, setPrevious] = useState(null)
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 6
    

    // Comportements

    const fetchGuides = useCallback(async function fetchGuides(filters = {}, urlOverride = null, isActive = () => true) {
        // Cette fonction récupère les guides, soit avec des filtres, soit avec une URL de pagination.
        setLoading(true)
        setError("")

        try {
            let url = urlOverride || "/api/guides/"

            if (!urlOverride) {
                const params = new URLSearchParams()

                // On ne rajoute au query string que les filtres réellement renseignés.
                if (filters.city) params.append("city", filters.city)
                if (filters.date) params.append("date", filters.date)
                if (filters.theme) params.append("theme", filters.theme)
                if (filters.language) params.append("language", filters.language)
                if (filters.max_price) params.append("max_price", filters.max_price)
                if (filters.number_of_people) params.append("number_of_people", filters.number_of_people)
                if (filters.page) params.append("page", filters.page)

                const query = params.toString()
                if (query) url += `?${query}`
            }

            const data = await api.get(url)

            if (!isActive()) return

            // On normalise la réponse pour gérer à la fois une liste simple et une réponse paginée DRF.
            setGuides(data.results ?? data)
            setNext(data.next ?? null)
            setPrevious(data.previous ?? null)
            setCount(data.count ?? data.length ?? 0)
            let nextCurrentPage = Number(filters.page || 1)
            if (urlOverride) {
                const parsedUrl = new URL(urlOverride)
                nextCurrentPage = Number(parsedUrl.searchParams.get("page") || 1)
            }

            setCurrentPage(nextCurrentPage)
            setHasSearched(true)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        guides,
        loading,
        error,
        hasSearched,
        next,
        previous,
        count,
        currentPage,
        pageSize,
        fetchGuides,
    }
}
