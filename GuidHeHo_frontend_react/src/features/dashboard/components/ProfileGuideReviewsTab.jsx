
export default function ProfileGuideReviewsTab({ reviews, loading, error }) {

    if (loading) {
        return <p>Chargement des avis guide...</p>
    }

    if (error) {
        return <p>{error || "Impossible de charger les avis guide pour le moment."}</p>
    }

    return (
        <div>
            <h2>Avis reçus comme guide</h2>

            {reviews && reviews.length > 0 ? (
                <ul>
                    {reviews.map((review) => {
                        const travelerName = review.traveler
                            ? `${review.traveler.first_name} ${review.traveler.last_name}`
                            : "Voyageur"

                        return (
                            <li key={review.id}>
                                <strong>{travelerName}</strong>
                                : {review.comment} — Note : {review.rating}
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <p>Aucun avis disponible.</p>
            )}
        </div>
    )
}