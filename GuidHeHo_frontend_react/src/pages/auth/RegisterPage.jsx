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
            setMessage("All fields are required.")
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

            // Ensure the UI is not left authenticated as a previous account.
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
                        Register
                    </h1>

                    <p className="text-sm text-slate-700 dark:text-teal-100">
                        Create your account, then verify your email with the code you receive.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text dark:text-white">First Name</span>
                            </div>
                            <input
                                className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />

                        </label>

                        <label className="form-control">
                            <div className="label">
                                <span className="label-text dark:text-white">Last Name</span>
                            </div>
                            <input
                                className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                                placeholder="Last Name"
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
                                <span className="label-text dark:text-white">Password</span>
                            </div>
                            <input
                                type="password"
                                autoComplete="new-password"
                                className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                        </label>

                        <button
                            type="submit"
                            className="btn bg-teal-500 hover:bg-teal-600 text-white dark:text-white border-none w-full"
                            disabled={loading}
                        >
                            {loading ? "Registering..." : "Create my account"}
                        </button>

                        {message && <p className="text-sm text-red-600 dark:text-red-300">{message}</p>}
                    </form>

                    <div className="mt-4 text-center">
                        <Link
                            to="/login"
                            className="link text-teal-700 hover:text-teal-900 dark:text-teal-200 dark:hover:text-white text-sm"
                        >
                            I already have an account
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}
