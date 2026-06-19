
export default function ProfileTravelerReviewsTab({ reviews, loading, error }) {

    if (loading) {
        return <p>Loading traveler profile...</p>
    }

    if (error) {
        return <p>{error || "Unable to load traveler profile for now."}</p>
    }

    return (
        <div>
            <h2>Traveler Reviews</h2>

            {reviews && reviews.length > 0 ? (
                <ul>
                    {reviews.map((review) => {
                        const guideName =
                            review.guide?.user
                                ? `${review.guide.user.first_name} ${review.guide.user.last_name}`
                                : review.guide_name || "Guide"

                        return (
                            <li key={review.id}>
                                <strong>{guideName}</strong>
                                : {review.comment} — Rating: {review.rating}
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <p>No reviews available.</p>
            )}
        </div>
    )
}