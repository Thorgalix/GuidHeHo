import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export default function VerifyEmailPage() {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    function handleCodeChange(e) {
        const nextCode = e.target.value.replace(/\D/g, "").slice(0, 6);
        setCode(nextCode);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!code) {
            setError("Veuillez saisir le code de vérification envoyé par email.");
            return;
        }
        if (code.length !== 6) {
            setError("Le code doit contenir 6 chiffres.");
            return;
        }

        setLoading(true);

        try {
            const data = await api.post("/users/verify-email/", { code }, { skipAuthRefresh: true });
            setSuccess(data.detail || "Votre adresse email a été vérifiée. Redirection vers la connexion...");
            setCode("");

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 800);
        } catch (err) {
            setError(err.message || "Une erreur est survenue pendant la vérification de votre email.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex justify-center px-4 py-10">
            <section className="card w-full max-w-md bg-teal-50 dark:bg-teal-900 shadow-md border border-teal-600">
                <div className="card-body">
                    <h1 className="card-title text-2xl text-slate-900 dark:text-white">
                        Vérification de l’email
                    </h1>

                    <p className="text-sm text-slate-700 dark:text-teal-100">
                        Saisissez le code à 6 chiffres reçu par email après l’inscription.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text dark:text-white">Code de vérification</span>
                            </div>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                autoComplete="one-time-code"
                                placeholder="123456"
                                className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                                value={code}
                                onChange={handleCodeChange}
                            />
                        </label>

                        <button
                            type="submit"
                            className="btn bg-teal-500 hover:bg-teal-600 text-white dark:text-white border-none w-full"
                            disabled={loading}
                        >
                            {loading ? "Vérification..." : "Vérifier mon compte"}
                        </button>

                        {error && <p className="text-sm text-red-600 dark:text-red-300">{error}</p>}
                        {success && <p className="text-sm text-green-700 dark:text-green-300">{success}</p>}
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
