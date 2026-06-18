import { useState, useContext } from "react"
import { api } from "../../services/api"
import { saveAuth } from "../../services/auth"
import { AuthContext } from "../../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"

export default function LoginPage() {

    // States

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    // Comportements

    async function handleSubmit(e) {
        e.preventDefault()


        setError("")
        setSuccess("")

        // On évite d'envoyer une connexion incomplète.
        if (!email || !password) {
            setError("Tous les champs sont requis")
            return
        }

        setLoading(true)

        try {
            const data = await api.post("/users/login/", {
                email,
                password,
            }, { skipAuthRefresh: true })

            // On sauvegarde la session en mémoire (pas de stockage navigateur).
            saveAuth(data)

            // Puis on met à jour le contexte React pour rafraîchir l'UI.
            login(data)

            setSuccess("Connexion réussie")

            setTimeout(() => {
                navigate("/")
            }, 500)

            setEmail("")
            setPassword("")
        } catch (err) {
            setError(err.message)
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
                        Login
                    </h1>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text dark:text-white">
                                    Email
                                </span>
                            </div>

                            <input
                                name="email"
                                type="email"
                                autoComplete="email"
                                className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>

                        <label className="form-control">
                            <div className="label">
                                <span className="label-text dark:text-white">
                                    Password
                                </span>
                            </div>

                            <input
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>

                        <div className="text-right">
                            <Link to="/forgot-password" className="link link-primary text-sm">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="btn bg-teal-500 hover:bg-teal-600 text-white dark:text-white border-none w-full"
                            disabled={loading}
                        >
                            {loading ? "Login..." : "Login"}
                        </button>

                        {error && (
                            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
                        )}
                        {success && (
                            <p className="text-sm text-green-600 dark:text-green-300">{success}</p>
                        )}
                    </form>
                </div>
            </section>
        </main>
    )
}