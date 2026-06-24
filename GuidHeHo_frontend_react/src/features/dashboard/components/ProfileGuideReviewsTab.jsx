
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
        <div>
            <ReviewList
                title="Avis reçus comme guide"
                reviews={reviews}
                loading={loading}
                error={error}
                emptyMessage="Aucun avis disponible."
                getAuthorLabel={(review) =>
                    review.traveler
                        ? `${review.traveler.first_name} ${review.traveler.last_name}`
                        : "Voyageur"
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
    )
}
