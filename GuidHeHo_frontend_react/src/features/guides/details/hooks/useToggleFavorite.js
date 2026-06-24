import { useState } from "react"
import { api } from "../../../../services/api"

export function useToggleFavorite({
    guideId, 
    initialIsFavorited = false, 
    initialFavoritesCount = 0
}) {
    // States

    const [favoriteState, setFavoriteState] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const hasLocalFavoriteState = favoriteState?.guideId === guideId
    const isFavorited = hasLocalFavoriteState
        ? favoriteState.isFavorited
        : Boolean(initialIsFavorited)
    const favoritesCount = hasLocalFavoriteState
        ? favoriteState.favoritesCount
        : Number(initialFavoritesCount) || 0

    // Comportements

    async function toggleFavorite() {
        if (!guideId || loading) return null

        try {
            setLoading(true)
            setError("")
            
            const data = await api.post(`/api/guides/${guideId}/favorite/`, {})

            setFavoriteState({
                guideId,
                isFavorited: Boolean(data.is_favorited),
                favoritesCount: Number(data.favorites_count) || 0
            })

            return data
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { isFavorited, favoritesCount, loading, error, toggleFavorite }
}
