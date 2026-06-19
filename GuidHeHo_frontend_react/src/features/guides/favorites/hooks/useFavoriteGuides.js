import { useEffect, useState } from "react";
import { api } from "../../../../services/api";

export function useFavoriteGuides() {
    const [favoriteGuides, setFavoriteGuides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function fetchFavoriteGuides(isActive = () => true) {
        try {
            setLoading(true);
            setError("");
            const data = await api.get(`/api/guides/favorites`);
            
            if (!isActive()) return;

            setFavoriteGuides(data.results ?? data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    function removeFavoriteGuide(guideId) {
        setFavoriteGuides((currentGuides) =>
            currentGuides.filter((guide) => guide.id !== guideId)
        );
    }

    useEffect(() => {
        let isCancelled = false;

        fetchFavoriteGuides(() => !isCancelled);

        return () => {
            isCancelled = true;
        };
    }, []);

    return {
        favoriteGuides,
        loading,
        error,
        fetchFavoriteGuides,
        removeFavoriteGuide
    };
}

