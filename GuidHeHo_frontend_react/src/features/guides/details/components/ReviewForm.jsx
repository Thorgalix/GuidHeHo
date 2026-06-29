import { useState } from "react";
import { createReview } from "../../../../services/reviews";

export default function ReviewForm({ guideId, onCreated, canReview }) {
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")


    if (!canReview) {
        return null
    }

    async function handleEnvoyer(e) {
        e.preventDefault()
        setError("")
        setSuccess("")
        const normalizedRating = Math.min(Math.max(rating, 1), 5)
        const trimmedComment = comment.trim()
        setLoading(true)

        if (normalizedRating < 1 || normalizedRating > 5 || !trimmedComment) {
            setError("Veuillez saisir une note valide et un commentaire.")
            setLoading(false)
            return
        }
        try {
            await createReview(guideId, normalizedRating, trimmedComment)
            setSuccess("Avis envoyé avec succès !")
            setRating(5)
            setComment("")
            if (onCreated) {
                await onCreated()
            }
        } catch (err) {
            setError(err.message || "Impossible d’envoyer l’avis.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleEnvoyer} className="space-y-5">
            <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Laisser un avis
                </h3>

                <p className="mt-1 text-sm text-slate-700 dark:text-teal-50">
                    Notez votre expérience et partagez un commentaire avec les autres voyageurs.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                <div className="form-control">
                    <label htmlFor="rating" className="label">
                        <span className="label-text font-semibold text-slate-800 dark:text-teal-50">
                            Note
                        </span>
                    </label>

                    <select
                        name="rating"
                        id="rating"
                        value={rating}
                        disabled={loading}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="
                        select select-bordered w-full
                        border-teal-600 bg-white text-slate-900
                        focus:border-teal-500 focus:outline-none
                        dark:bg-teal-950 dark:text-teal-50 dark:border-teal-700
                    "
                    >
                        <option value={1}>1 étoile</option>
                        <option value={2}>2 étoiles</option>
                        <option value={3}>3 étoiles</option>
                        <option value={4}>4 étoiles</option>
                        <option value={5}>5 étoiles</option>
                    </select>
                </div>

                <div className="form-control">
                    <label htmlFor="comment" className="label">
                        <span className="label-text font-semibold text-slate-800 dark:text-teal-50">
                            Commentaire
                        </span>
                    </label>

                    <textarea
                        name="comment"
                        id="comment"
                        required
                        value={comment}
                        disabled={loading}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Décrivez votre expérience avec ce guide..."
                        className="
                        textarea textarea-bordered min-h-32 w-full
                        border-teal-600 bg-white text-slate-900
                        placeholder:text-slate-400
                        focus:border-teal-500 focus:outline-none
                        dark:bg-teal-950 dark:text-teal-50 dark:border-teal-700
                        dark:placeholder:text-teal-200/60
                    "
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="btn border-none bg-teal-500 text-white hover:bg-teal-600 disabled:bg-slate-300 disabled:text-slate-500"
                >
                    {loading ? "Envoi..." : "Envoyer l’avis"}
                </button>

                {error && (
                    <p className="text-sm font-medium text-red-600 dark:text-red-300">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="text-sm font-medium text-teal-700 dark:text-teal-100">
                        {success}
                    </p>
                )}
            </div>
        </form>
    )
}
