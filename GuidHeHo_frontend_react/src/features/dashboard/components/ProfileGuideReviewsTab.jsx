
export default function ProfileGuideReviewsTab({ reviews, loading, error }) {

    if (loading) {
        return <p>Loading guide reviews...</p>
    }

    if (error) {
        return <p>{error || "Unable to load guide reviews for now."}</p>
    }

    return (
        <div>
            <h2>Guide Reviews</h2>

            {reviews && reviews.length > 0 ? (
                <ul>
                    {reviews.map((review) => {
                        const travelerName = review.traveler
                            ? `${review.traveler.first_name} ${review.traveler.last_name}`
                            : "Traveler"

                        return (
                            <li key={review.id}>
                                <strong>{travelerName}</strong>
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