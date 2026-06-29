import { useContext, useState } from "react"
import { FaPaperPlane } from "react-icons/fa"
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
        <form onSubmit={handleSubmit} className="space-y-4">
            <label className="form-control">
                <div className="label">
                    <span className="label-text font-semibold text-slate-900 dark:text-white">
                        Message
                    </span>
                </div>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Bonjour, je voudrais vous poser une question sur une visite..."
                    className="textarea textarea-bordered min-h-32 w-full border-teal-600 bg-white placeholder:text-slate-400 focus:border-teal-300 focus:outline-none dark:bg-teal-950 dark:text-teal-50 dark:placeholder:text-teal-200/60"
                    disabled={submitting || isOwnGuideProfile}
                />
            </label>

            <button
                type="submit"
                disabled={submitting || isOwnGuideProfile || !message.trim()}
                className="btn border-none bg-teal-500 text-white hover:bg-teal-600 disabled:bg-teal-300 disabled:text-white"
            >
                <FaPaperPlane aria-hidden="true" />
                {submitting ? "Envoi..." : "Envoyer le message"}
            </button>

            {status && (
                <p className="text-sm font-medium text-teal-700 dark:text-teal-100">
                    {status}
                </p>
            )}
            {error && (
                <p className="text-sm font-medium text-red-600 dark:text-red-300">
                    {error}
                </p>
            )}
        </form>
    )
}
