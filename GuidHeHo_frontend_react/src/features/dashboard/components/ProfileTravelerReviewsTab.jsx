
export default function ProfileTravelerReviewsTab({ reviews, loading, error }) {

    if (loading) {
        return <p>Chargement du profil voyageur...</p>
    }

    if (error) {
        return <p>{error || "Impossible de charger le profil voyageur pour le moment."}</p>
    }

    return (
        <div>
            <h2>Avis émis.</h2>

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
                                : {review.comment} — Note : {review.rating}
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <p>Aucun avis émis.</p>
            )}
        </div>
    )
}