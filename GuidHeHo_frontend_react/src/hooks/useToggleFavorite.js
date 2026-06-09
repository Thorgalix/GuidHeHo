import { useState, useEffect } from "react"
import { api } from "../services/api"

export function useToggleFavorite({
    guideId, 
    initialIsFavorited = false, 
    initialFavoritesCount = 0
}) {
    // States

    const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
    const [favoritesCount, setFavoritesCount] = useState(initialFavoritesCount)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Comportements

    useEffect(() => {
        setIsFavorited(Boolean(initialIsFavorited))
        setFavoritesCount(Number(initialFavoritesCount) || 0)
    }, [guideId, initialIsFavorited, initialFavoritesCount])

    async function toggleFavorite() {
        if (!guideId || loading) return null

        try {
            setLoading(true)
            setError("")
            
            const data = await api.post(`/api/guides/${guideId}/favorite/`, {})

            setIsFavorited(Boolean(data.is_favorited))
            setFavoritesCount(Number(data.favorites_count) || 0)

            return data
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { isFavorited, favoritesCount, loading, error, toggleFavorite }
}