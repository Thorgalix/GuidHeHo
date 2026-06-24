
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
        <div>
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
    )
}
