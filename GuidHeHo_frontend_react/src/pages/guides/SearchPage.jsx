import { FaCalendarCheck, FaMapMarkedAlt, FaSearchLocation, FaStar } from "react-icons/fa"
import GuideCard from "../../features/guides/search/components/GuideCard"
import FilterBar from "../../features/guides/search/components/FilterBar"
import GuideMap from "../../features/guides/search/components/GuideMap"
import { useSearchGuides } from "../../features/guides/search/hooks/useSearchGuides"

const steps = [
    {
        title: "Search",
        text: "Indicate your city, a date, a theme, a language, or your budget.",
        Icon: FaSearchLocation,
    },
    {
        title: "Compare",
        text: "Check profiles, rates, availability, and traveler reviews.",
        Icon: FaStar,
    },
    {
        title: "Meet",
        text: "Choose the local guide that best matches your way of traveling.",
        Icon: FaCalendarCheck,
    },
]

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
    const shouldShowResults = loading || error || hasSearched
    // Affichage

    return (
        <main className="px-5 py-8">
            <section className="mx-auto max-w-6xl">
                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-200">
                            GuidHeHo
                        </p>
                        <h1 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
                            Find a local guide to discover the city differently.
                        </h1>
                        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700 dark:text-teal-50">
                            Search based on your destination, desires, and budget, then compare available guides before planning your visit.
                        </p>
                    </div>

                    <div className="rounded-lg border border-teal-600 bg-white/80 p-5 shadow-md dark:bg-teal-900/70">
                        <div className="flex items-center gap-3 text-teal-700 dark:text-teal-100">
                            <FaMapMarkedAlt className="text-3xl" aria-hidden="true" />
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                How it works?
                            </h2>
                        </div>

                        <div className="mt-5 space-y-4">
                            {steps.map(({ title, text, Icon }) => (
                                <article key={title} className="flex gap-4">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-100">
                                        <Icon aria-hidden="true" />
                                    </span>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                            {title}
                                        </h3>
                                        <p className="text-sm leading-6 text-slate-700 dark:text-teal-50">
                                            {text}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section aria-labelledby="search-title" className="mx-auto mt-8 max-w-6xl">
                <FilterBar onSearch={fetchGuides} />
            </section>

            {shouldShowResults ? (
                <>
                    <section aria-labelledby="results-title" className="mx-auto mt-10 max-w-6xl">
                        <h2 id="results-title" className="sr-only">
                            Search Results
                        </h2>

                        {loading && (
                            <p className="text-slate-700 dark:text-teal-100">
                                Loading guides...
                            </p>
                        )}

                        {error && (
                            <p className="text-red-600 dark:text-red-300">
                                {error}
                            </p>
                        )}

                        {!loading && hasSearched && guides.length === 0 && (
                            <p className="text-slate-700 dark:text-teal-100">
                                No guides found for these filters.
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
                                    Page {currentPage} of {totalPages}
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

                    {guides.length > 0 && (
                        <section aria-labelledby="map-title" className="mx-auto max-w-6xl">
                            <h2 id="map-title" className="sr-only">
                                Guides Map
                            </h2>

                            <GuideMap guides={guides} />
                        </section>
                    )}
                </>
            ) : (
                <p className="mx-auto mt-6 max-w-6xl text-sm text-slate-700 dark:text-teal-100">
                    Start a search to display available guides.
                </p>
            )}
        </main>
    )
}
