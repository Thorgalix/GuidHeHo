import { useState } from "react"
import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api } from "../../services/api"
import { AuthContext } from "../../context/auth-context"

export default function RegisterPage() {

    // States

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const { logout } = useContext(AuthContext)
    const navigate = useNavigate()

    // Comportements

    async function handleSubmit(e) {
        e.preventDefault()
        setMessage("")

        if (!email || !password || !firstName || !lastName) {
            setMessage("Tous les champs sont requis.")
            return
        }

        setLoading(true)

        // On envoie les informations nécessaires à la création du compte.
        try {
            await api.post("/users/register/", {
                email,
                password,
                first_name: firstName,
                last_name: lastName
            })

            // On évite de conserver une session précédente dans l’interface.
            await logout()
            navigate("/verify-email", { replace: true })
        } catch (err) {
            setMessage(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Affichage

    return (
        <main className="flex justify-center px-4 py-10">
            <section className="card w-full max-w-md bg-teal-50 dark:bg-teal-900 shadow-md border border-teal-600">
                <div className="card-body">
                    <h1 className="card-title text-2xl text-slate-900 dark:text-white">
                        Inscription
                    </h1>

                    <p className="text-sm text-slate-700 dark:text-teal-100">
                        Créez votre compte, puis vérifiez votre adresse email avec le code reçu.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text dark:text-white">Prénom</span>
                            </div>
                            <input
                                className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                                placeholder="Prénom"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />

                        </label>

                        <label className="form-control">
                            <div className="label">
                                <span className="label-text dark:text-white">Nom</span>
                            </div>
                            <input
                                className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                                placeholder="Nom"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />

                        </label>

                        <label className="form-control">
                            <div className="label">
                                <span className="label-text dark:text-white">Email</span>
                            </div>
                            <input
                                type="email"
                                autoComplete="email"
                                className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                        </label>

                        <label className="form-control">
                            <div className="label">
                                <span className="label-text dark:text-white">Mot de passe</span>
                            </div>
                            <input
                                type="password"
                                autoComplete="new-password"
                                className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                        </label>

                        <button
                            type="submit"
                            className="btn bg-teal-500 hover:bg-teal-600 text-white dark:text-white border-none w-full"
                            disabled={loading}
                        >
                            {loading ? "Inscription..." : "Créer mon compte"}
                        </button>

                        {message && <p className="text-sm text-red-600 dark:text-red-300">{message}</p>}
                    </form>

                    <div className="mt-4 text-center">
                        <Link
                            to="/login"
                            className="link text-teal-700 hover:text-teal-900 dark:text-teal-200 dark:hover:text-white text-sm"
                        >
                            J’ai déjà un compte
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}
