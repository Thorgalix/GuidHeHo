import { FaStar } from "react-icons/fa"
import ReviewList from "../../reviews/components/ReviewList"
import ReviewsPagination from "../../reviews/components/ReviewsPagination"
import { useGuideReviews } from "../../guides/details/hooks/useGuideReviews"

export default function ProfileGuideReviewsTab({ guideId }) {
    const {
        reviews,
        loading,
        error,
        page,
        totalPages,
        next,
        previous,
        setPage,
    } = useGuideReviews(guideId)

    return (
        <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
            <div className="card-body">
                <header className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-100">
                        <FaStar aria-hidden="true" />
                    </span>

                    <div>
                        <h2 className="card-title text-slate-900 dark:text-white">
                            Avis reçus
                        </h2>
                        <p className="text-sm text-slate-700 dark:text-teal-50">
                            Retrouvez les avis que vous avez reçus en tant que guide.
                        </p>
                    </div>
                </header>

                <div className="my-2 border-t border-teal-200 dark:border-teal-700" />

                <ReviewList
                    title="Avis reçus comme guide"
                    reviews={reviews}
                    loading={loading}
                    error={error}
                    emptyMessage="Aucun avis reçu."
                    getAuthorLabel={(review) =>
                        review.traveler
                            ? `${review.traveler.first_name} ${review.traveler.last_name}`
                            :  review.traveler_name || "Voyageur"
                    }
                />

                <ReviewsPagination
                    page={page}
                    totalPages={totalPages}
                    previous={previous}
                    next={next}
                    onPageChange={setPage}
                />
            </div>
        </section>
    )
}
