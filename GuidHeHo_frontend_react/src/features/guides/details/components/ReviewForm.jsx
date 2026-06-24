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
        <form onSubmit={handleEnvoyer}>
            <h3>Laisser un avis</h3>

            <label htmlFor="rating">Note</label>
            <select name="rating" id="rating" value={rating} disabled={loading} onChange={(e) => setRating(Number(e.target.value))}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
            </select>
            <label htmlFor="comment">Commentaire</label>
            <textarea name="comment" id="comment" required value={comment} disabled={loading} onChange={(e) => setComment(e.target.value)}></textarea>
            <button type="submit" disabled={loading}>{loading ? "Envoi..." : "Envoyer"}</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
        </form>
    )
}
