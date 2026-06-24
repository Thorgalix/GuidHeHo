import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../services/api";


export default function ResetPasswordPage() {
    // Pour lire les paramètres URL (ex /reset-password?uid=xxx&token=yyy)
    const [searchParams] = useSearchParams();

    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    const navigate = useNavigate();

    // States
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!uid || !token) {
            setError("Lien de réinitialisation invalide.")
            return
        }

        if (!newPassword || !confirmPassword) {
            setError("Veuillez remplir tous les champs.")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.")
            return
        }

        setLoading(true);

        try {
            // Appel Backend : réinitialisation du mot de passe
            const data = await api.post(
                "/users/password-reset-confirm/",
                {
                    uid,
                    token,
                    new_password: newPassword,
                    new_password2: confirmPassword,
                },
                { skipAuthRefresh: true }
            )
            setSuccess(data.detail || "Votre mot de passe a bien été réinitialisé. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.")
            setNewPassword("");
            setConfirmPassword("");

            // Rediriger vers la page de login après un court délai
            setTimeout(() => {
                navigate("/login")
            }, 800)
        } catch (err) {
            setError(err.message || "Une erreur est survenue pendant la réinitialisation du mot de passe.")
        } finally {
            setLoading(false);
        }
    }


    return (
        <main className="flex justify-center px-4 py-10">
            <section className="card w-full max-w-md bg-teal-50 dark:bg-teal-900 shadow-md border border-teal-600">
                <div className="card-body">
                    <h1 className="card-title text-2xl text-slate-900 dark:text-white">
                        Nouveau mot de passe
                    </h1>

                    <p className="text-sm text-slate-700 dark:text-teal-100">
                        Choisis un nouveau mot de passe pour ton compte Guidhého.
                    </p>

                    {!uid || !token ? (
                        <div className="mt-4 space-y-4">
                            <p className="text-sm text-red-600 dark:text-red-300">
                                Ce lien est invalide ou incomplet.
                            </p>

                            <Link
                                to="/forgot-password"
                                className="btn bg-teal-500 hover:bg-teal-600 text-white dark:text-white border-none w-full"
                            >
                                Redemander un lien
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <label className="form-control">
                                <div className="label">
                                    <span className="label-text dark:text-white">
                                        Nouveau mot de passe
                                    </span>
                                </div>

                                <input
                                    type="password"
                                    placeholder="Nouveau mot de passe"
                                    className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </label>

                            <label className="form-control">
                                <div className="label">
                                    <span className="label-text dark:text-white">
                                        Confirmer le mot de passe
                                    </span>
                                </div>

                                <input
                                    type="password"
                                    placeholder="Confirme le mot de passe"
                                    className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </label>

                            <button
                                type="submit"
                                className="btn bg-teal-500 hover:bg-teal-600 text-white dark:text-white border-none w-full"
                                disabled={loading}
                            >
                                {loading ? "Modification..." : "Modifier le mot de passe"}
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
                    )}

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

