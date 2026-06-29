import { FaStar } from "react-icons/fa"
import ReviewList from "../../reviews/components/ReviewList"
import ReviewsPagination from "../../reviews/components/ReviewsPagination"
import { useTravelerReviews } from "../../reviews/hooks/useTravelerReviews"

export default function ProfileTravelerReviewsTab({ travelerId }) {
    const {
        reviews,
        loading,
        error,
        page,
        totalPages,
        next,
        previous,
        setPage,
    } = useTravelerReviews(travelerId)

    return (
        <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
            <div className="card-body">
                <header className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-100">
                        <FaStar aria-hidden="true" />
                    </span>

                    <div>
                        <h2 className="card-title text-slate-900 dark:text-white">
                            Mes avis
                        </h2>
                        <p className="text-sm text-slate-700 dark:text-teal-50">
                            Retrouvez les avis que vous avez laissés aux guides.
                        </p>
                    </div>
                </header>

                <div className="my-2 border-t border-teal-200 dark:border-teal-700" />

                <ReviewList
                    title="Avis émis."
                    reviews={reviews}
                    loading={loading}
                    error={error}
                    emptyMessage="Aucun avis émis."
                    getAuthorLabel={(review) =>
                        review.guide?.user
                            ? `${review.guide.user.first_name} ${review.guide.user.last_name}`
                            : review.guide_name || "Guide"
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
