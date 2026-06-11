import GuideCard from "../components/GuideCard"
import FilterBar from "../components/FilterBar"
import GuideMap from "../components/GuideMap"
import { useSearchGuides } from "../hooks/useSearchGuides"


export default function Search() {
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

    // Affichage

    return (
        <div style={{ padding: "20px" }}>

            <FilterBar onSearch={fetchGuides} />

            {loading && <p>Loading guides...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && hasSearched && guides.length === 0 && (
                <p>No guides found for these filters</p>
            )}

            <div className="my-10 grid gap-6 grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
                {guides.map((guide) => (
                    <GuideCard key={guide.id} guide={guide} />
                ))}
            </div>
            <div className="mt-5 flex gap-2">
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