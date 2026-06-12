import GuideCard from "../../features/guides/search/components/GuideCard"
import FilterBar from "../../features/guides/search/components/FilterBar"
import GuideMap from "../../features/guides/search/components/GuideMap"
import { useSearchGuides } from "../../features/guides/search/hooks/useSearchGuides"


export default function SearchPage() {
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

            {/* Pagination controls */}
            <div className="join flex justify-center mb-10">
                <button
                className="join-item btn"
                    disabled={!previous}
                    onClick={() => fetchGuides({}, previous)}
                >
                    «
                </button>

                <button 
                className="join-item btn"
                >
                    Page {Math.ceil(count / guides.length) === 0 ? 1 : Math.ceil(count / guides.length)}
                </button>

                <button
                className="join-item btn"
                    disabled={!next}
                    onClick={() => fetchGuides({}, next)}
                >
                    »
                </button>
            </div>

            <GuideMap guides={guides} />
        </div>
    )
}