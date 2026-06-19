import { useTravelerProfile } from "../hooks/useTravelerProfile"

export default function ProfileTravelerReviewsTab({ user }) {
    const {
        traveler,
        loading,
        error,
        reviews,
    } = useTravelerProfile(user)

    if (!user) {
        return <p>Please login to access your traveler dashboard.</p>
    }

    if (loading) {
        return <p>Loading traveler profile...</p>
    }

    if (!traveler) {
        return <p>{error || "Unable to load traveler profile for now."}</p>
    }

    return (
        <div>
            <h2>Traveler Reviews</h2>
            {reviews && reviews.length > 0 ? (
                <ul>
                    {reviews.map((review) => (
                        <li key={review.id}>
                            <strong>{review.guide_name}</strong>: {review.comment} (Rating: {review.rating})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No reviews available.</p>
            )}
        </div>
    )
}