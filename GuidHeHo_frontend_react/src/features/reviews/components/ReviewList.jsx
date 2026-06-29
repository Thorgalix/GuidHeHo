import { FaRegStar, FaStar } from "react-icons/fa"

export default function ReviewList({
    reviews,
    loading,
    error,
    title,
    emptyMessage = "Aucun avis pour le moment.",
    getAuthorLabel,
}) {
    if (loading) {
        return (
            <p className="text-slate-700 dark:text-teal-100">
                Chargement des avis...
            </p>
        )
    }

    if (error) {
        return (
            <p className="text-red-600 dark:text-red-300">
                {error}
            </p>
        )
    }

    const safeReviews = Array.isArray(reviews) ? reviews : []

    return (
        <section className="space-y-5">
            {title && (
                <h2 className="card-title text-slate-900 dark:text-white">
                    {title}
                </h2>
            )}

            {safeReviews.length > 0 ? (
                <ul className="space-y-4">
                    {safeReviews.map((review) => (
                        <li
                            key={review.id}
                            className="rounded-lg border border-teal-200 bg-white/70 p-4 shadow-sm dark:border-teal-700 dark:bg-teal-950/40"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    {getAuthorLabel && (
                                        <p className="font-semibold text-slate-900 dark:text-white">
                                            {getAuthorLabel(review)}
                                        </p>
                                    )}

                                    <div
                                        className="mt-1 flex items-center gap-1 text-teal-700 dark:text-teal-100"
                                        aria-label={`Note : ${review.rating}/5`}
                                    >
                                        {Array.from({ length: 5 }, (_, index) => {
                                            const Icon = index < review.rating ? FaStar : FaRegStar

                                            return <Icon key={index} aria-hidden="true" />
                                        })}
                                    </div>
                                </div>

                                {review.created_at && (
                                    <p className="text-sm text-slate-600 dark:text-teal-100">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </p>
                                )}
                            </div>

                            <p className="mt-3 leading-7 text-slate-700 dark:text-teal-50">
                                {review.comment}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-slate-700 dark:text-teal-100">
                    {emptyMessage}
                </p>
            )}
        </section>
    )
}
