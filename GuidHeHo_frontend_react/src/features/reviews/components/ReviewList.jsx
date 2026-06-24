export default function ReviewList({
    reviews,
    loading,
    error,
    title,
    emptyMessage = "Aucun avis pour le moment.",
    getAuthorLabel,
}) {
    if (loading) {
        return <p>Chargement des avis...</p>
    }

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>
    }

    const safeReviews = Array.isArray(reviews) ? reviews : []

    return (
        <section>
            {title && <h2>{title}</h2>}

            {safeReviews.length > 0 ? (
                <ul>
                    {safeReviews.map((review) => (
                        <li key={review.id}>
                            {getAuthorLabel && (
                                <p>
                                    <strong>{getAuthorLabel(review)}</strong>
                                </p>
                            )}
                            <p>Note : {review.rating}/5</p>
                            <p>{review.comment}</p>
                            {review.created_at && (
                                <p>Date : {new Date(review.created_at).toLocaleDateString()}</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>{emptyMessage}</p>
            )}
        </section>
    )
}
