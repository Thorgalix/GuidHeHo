import GuideCard from "../../features/guides/search/components/GuideCard";
import { useFavoriteGuides } from "../../features/guides/favorites/hooks/useFavoriteGuides";

export default function FavoriteGuidesPage() {
    const {
        favoriteGuides,
        loading,
        error,
        removeFavoriteGuide,
        next,
        previous,
        count,
        currentPage,
        pageSize,
        fetchFavoriteGuides,
    } = useFavoriteGuides();

    return (
        <main className="px-5 py-5">
            <section className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-teal-100">
                        Mes favoris
                    </h1>

                    <p className="mt-2 text-slate-700 dark:text-teal-100">
                        Retrouvez ici les guides que vous avez ajoutés à vos favoris.
                    </p>
                </header>

                {loading && (
                    <p className="text-slate-700 dark:text-teal-100">
                        Chargement de vos favoris...
                    </p>
                )}

                {error && (
                    <p className="text-red-600 dark:text-red-300">
                        {error}
                    </p>
                )}

                {!loading && !error && favoriteGuides.length === 0 && (
                    <div className="card bg-teal-50 dark:bg-teal-900 border border-teal-600">
                        <div className="card-body">
                            <h2 className="card-title text-slate-800 dark:text-teal-100">
                                Aucun favori pour le moment
                            </h2>

                            <p className="text-slate-700 dark:text-teal-100">
                                Vous pouvez ajouter des guides à vos favoris depuis la page de recherche.
                            </p>
                        </div>
                    </div>
                )}

                {favoriteGuides.length > 0 && (
                    <div className="my-10 grid gap-6 grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
                        {favoriteGuides.map((guide) => (
                            <GuideCard
                                key={guide.id}
                                guide={guide}
                                onFavoriteRemoved={removeFavoriteGuide}
                            />
                        ))}
                    </div>
                )}

                {(previous || next) && (
                    <nav
                        className="join flex justify-center mb-10"
                        aria-label="Favorite Guides Pagination"
                    >
                        <button
                            type="button"
                            className="join-item btn"
                            disabled={!previous}
                            onClick={() => fetchFavoriteGuides(previous)}
                        >
                            <span aria-hidden="true">«</span>
                            <span className="sr-only">Page précédente</span>
                        </button>
                        <span className="join-item btn btn-disabled">
                            Page {currentPage} sur {Math.ceil(count / pageSize)}
                        </span>
                        <button
                            type="button"
                            className="join-item btn"
                            disabled={!next}
                            onClick={() => fetchFavoriteGuides(next)}
                        >
                            <span aria-hidden="true">»</span>
                            <span className="sr-only">Page suivante</span>
                        </button>
                    </nav>
                )}
            </section>
        </main>
    );
}

