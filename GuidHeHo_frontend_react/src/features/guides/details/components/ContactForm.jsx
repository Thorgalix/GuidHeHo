import { useContext, useState } from "react"
import { AuthContext } from "../../../../context/auth-context"
import { api } from "../../../../services/api"

export default function ContactForm({ guide }) {
    const [message, setMessage] = useState("")
    const [status, setStatus] = useState("")
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const { isAuthenticated, user } = useContext(AuthContext)
    const isOwnGuideProfile = user?.id && guide?.user?.id && user.id === guide.user.id

    async function handleSubmit(e) {
        e.preventDefault()
        setStatus("")
        setError("")

        if (!isAuthenticated) {
            setError("Vous devez être connecté pour contacter ce guide.")
            return
        }

        if (isOwnGuideProfile) {
            setError("Vous ne pouvez pas vous contacter vous-même.")
            return
        }

        const trimmedMessage = message.trim()

        if (!trimmedMessage) {
            setError("Votre message ne peut pas être vide.")
            return
        }

        try {
            setSubmitting(true)

            await api.post("/contact/contact-guide/", {
                guide_id: guide.id,
                message: trimmedMessage,
            })

            setMessage("")
            setStatus("Votre message a bien été envoyé au guide.")
        } catch (err) {
            setError(err.message || "Impossible d'envoyer le message pour le moment.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block space-y-2">
                Message
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Bonjour, je voudrais vous poser une question sur une visite..."
                    className="h-28 w-full rounded-md border border-teal-700 px-3 py-2"
                    disabled={submitting || isOwnGuideProfile}
                />
            </label>

            <button
                type="submit"
                disabled={submitting || isOwnGuideProfile || !message.trim()}
                className="rounded-md bg-teal-700 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-teal-300"
            >
                {submitting ? "Envoi..." : "Envoyer le message"}
            </button>

            {status && <p>{status}</p>}
            {error && <p className="text-red-600">{error}</p>}
        </form>
    )
}
