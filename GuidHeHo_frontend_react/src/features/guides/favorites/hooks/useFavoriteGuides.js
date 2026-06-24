import { useEffect, useState } from "react";
import { api } from "../../../../services/api";

export function useFavoriteGuides() {
    const [favoriteGuides, setFavoriteGuides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    async function fetchFavoriteGuides(urlOverride = null, isActive = () => true) {
        const url = urlOverride || "/api/guides/favorites";
        try {
            setLoading(true);
            setError("");
            const data = await api.get(url);
            
            if (!isActive()) return;

            setFavoriteGuides(data.results ?? data);
            setNext(data.next ?? null);
            setPrevious(data.previous ?? null);
            setCount(data.count ?? data.length ?? 0);

            let nextCurrentPage = 1;
            if (data.next) {
                const parsedUrl = new URL(data.next);
                nextCurrentPage = Number(parsedUrl.searchParams.get("page") || 1) - 1;
            } else if (data.previous) {
                const parsedUrl = new URL(data.previous);
                nextCurrentPage = Number(parsedUrl.searchParams.get("page") || 1) + 1;
            }
            setCurrentPage(nextCurrentPage);
        } catch (err) {
            setError(err.message || "Impossible de charger les guides favoris.");
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

        Promise.resolve().then(() => fetchFavoriteGuides(null, () => !isCancelled));

        return () => {
            isCancelled = true;
        };
    }, []);

    return {
        favoriteGuides,
        loading,
        error,
        fetchFavoriteGuides,
        removeFavoriteGuide,
        next,
        previous,
        count,
        currentPage,
        pageSize,
    };
}
