import { useContext, useEffect } from "react"
import GuideCard from "../components/GuideCard"
import FilterBar from "../components/FilterBar"
import GuideMap from "../components/GuideMap"
import { AuthContext } from "../context/AuthContext"
import { useSearchGuides } from "../hooks/useSearchGuides"


export default function Search() {
    // States
    const { isAuthenticated } = useContext(AuthContext)

    const {
        guides,
        loading,
        error,
        hasSearched,
        next,
        previous,
        count,
        fetchGuides,
    } = useSearchGuides()

    useEffect(() => {
        // Après restauration de session (token en localStorage), on refait un fetch
        // pour obtenir un is_favorited cohérent côté serveur.
        if (isAuthenticated) {
            fetchGuides()
        }
    }, [isAuthenticated])

    // Affichage

    return (
        <div style={{ padding: "20px" }}>
            <h2>Search Guides</h2>

            <FilterBar onSearch={fetchGuides} />

            {loading && <p>Loading guides...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && hasSearched && guides.length === 0 && (
                <p>No guides found for these filters</p>
            )}

            <div style={{ display:"grid", gap: "16px", padding:"16px", marginTop: "20px"}}>
                {guides.map((guide) => (
                    <GuideCard key={guide.id} guide={guide} />
                ))}
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <button
                    disabled={!previous}
                    onClick={() => fetchGuides({}, previous)}
                >
                    Previous
                </button>

                <button
                    disabled={!next}
                    onClick={() => fetchGuides({}, next)}
                >
                    Next
                </button>

                <span>Total: {count}</span>
            </div>
            <GuideMap guides={guides} />
        </div>
    )
}