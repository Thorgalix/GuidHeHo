import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../../services/api"
import { saveAuth } from "../../services/auth"
import { AuthContext } from "../../context/AuthContext"

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

            // On sauvegarde d'abord les tokens en localStorage.
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
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Connexion..." : "Login"}
                </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            </form>
        </div>
    )
}