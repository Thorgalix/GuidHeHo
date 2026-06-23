

export default function ReviewList({ reviews, loading, error }) {
    if (loading) {
        return <p>Chargement des avis...</p>
    }
    if (error) {
        return <p style={{ color: "red" }}>{error}</p>
    }
    const safeReviews = Array.isArray(reviews) ? reviews : []
    if (safeReviews.length === 0) {
        return <p>Aucun avis pour le moment.</p>
    }
    
    return (
        <ul>
            {safeReviews.map((review) => (
                <li key={review.id}>
                    <p>Note : {review.rating}/5</p>
                    <p>{review.comment}</p>
                    <p>Voyageur : {review.traveler?.first_name} {review.traveler?.last_name}</p>
                    <p>Date : {new Date(review.created_at).toLocaleDateString()}</p>
                </li>
            ))}
        </ul>
    )
}


