import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

export default function ForgotPasswordPage() {
    // States
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()

        setError("")
        setSuccess("")

        if (!email) {
            setError("Veuillez saisir votre adresse email.")
            return
        }

        setLoading(true)

        try {
            // Appel Backend : demande d'envoi du lien de réinitialisation
            const data = await api.post(
                "/users/password-reset/",
                { email },
                { skipAuthRefresh: true }
            )
            setSuccess(data.detail || "Si un compte existe avec cette adresse email, un lien de réinitialisation a été envoyé.")
            setEmail("")
        } catch (err) {
            setError(err.message || "Une erreur est survenue pendant la demande de réinitialisation.")
        } finally {
            setLoading(false)
        }

    }

    return (
        <main className="flex justify-center px-4 py-10">
            <section className="card w-full max-w-md bg-teal-50 dark:bg-teal-900 shadow-md border border-teal-600">
                <div className="card-body">
                    <h1 className="card-title text-2xl text-slate-900 dark:text-white">
                        Mot de passe oublié
                    </h1>

                    <p className="text-sm text-slate-700 dark:text-teal-100">
                        Entre ton adresse email. Si un compte existe, tu recevras un lien pour choisir un nouveau mot de passe.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text dark:text-white">
                                    Adresse email
                                </span>
                            </div>

                            <input
                                type="email"
                                placeholder="exemple@email.com"
                                className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>

                        <button
                            type="submit"
                            className="btn bg-teal-500 hover:bg-teal-600 text-white dark:text-white border-none w-full"
                            disabled={loading}
                        >
                            {loading ? "Envoi en cours..." : "Envoyer le lien"}
                        </button>

                        {error && (
                            <p className="text-sm text-red-600 dark:text-red-300">
                                {error}
                            </p>
                        )}

                        {success && (
                            <p className="text-sm text-green-700 dark:text-green-300">
                                {success}
                            </p>
                        )}
                    </form>

                    <div className="mt-4 text-center">
                        <Link
                            to="/login"
                            className="link text-teal-700 hover:text-teal-900 dark:text-teal-200 dark:hover:text-white text-sm"
                        >
                            Retour à la connexion
                        </Link>
                    </div>
                </div>
            </section>
        </main>

    )
}
