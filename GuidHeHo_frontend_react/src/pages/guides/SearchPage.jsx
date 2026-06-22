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
        currentPage,
        pageSize,
        fetchGuides,
    } = useSearchGuides()
    const totalPages = Math.ceil(count / pageSize)
    // Affichage

    return (
        <main className="px-5 py-5">
            <h1 className="sr-only">
                Recherche de guides touristiques
            </h1>

            <section aria-labelledby="search-title">
                <FilterBar onSearch={fetchGuides} />
            </section>

            <section aria-labelledby="results-title" className="mt-10">
                <h2 id="results-title" className="sr-only">
                    Résultats de recherche
                </h2>

                {loading && (
                    <p className="text-slate-700 dark:text-teal-100">
                        Chargement des guides...
                    </p>
                )}

                {error && (
                    <p className="text-red-600 dark:text-red-300">
                        {error}
                    </p>
                )}

                {!loading && hasSearched && guides.length === 0 && (
                    <p className="text-slate-700 dark:text-teal-100">
                        Aucun guide trouvé pour ces filtres.
                    </p>
                )}

                <div className="my-10 grid gap-6 grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
                    {guides.map((guide) => (
                        <GuideCard key={guide.id} guide={guide} />
                    ))}
                </div>

                {(previous || next) && (
                    <nav
                        className="join flex justify-center mb-10"
                        aria-label="Guides pagination"
                    >
                        <button
                            type="button"
                            className="join-item btn"
                            disabled={!previous}
                            onClick={() => fetchGuides({}, previous)}
                        >
                            <span aria-hidden="true">«</span>
                            <span className="sr-only">Previous page</span>
                        </button>

                        <button
                            type="button"
                            className="join-item btn"
                            disabled
                        >
                            Page {currentPage} on {totalPages}
                        </button>

                        <button
                            type="button"
                            className="join-item btn"
                            disabled={!next}
                            onClick={() => fetchGuides({}, next)}
                        >
                            <span aria-hidden="true">»</span>
                            <span className="sr-only">Next page</span>
                        </button>
                    </nav>
                )}
            </section>

            <section aria-labelledby="map-title">
                <h2 id="map-title" className="sr-only">
                    Guide map
                </h2>

                <GuideMap guides={guides} />
            </section>
        </main>
    )
}