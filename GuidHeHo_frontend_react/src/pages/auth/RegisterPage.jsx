import { useState } from "react"
import { useContext } from "react"
import { api } from "../../services/api"
import { AuthContext } from "../../context/AuthContext"

export default function RegisterPage() {

    // States

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [message, setMessage] = useState("")
    const { logout } = useContext(AuthContext)

    // Comportements

    async function handleSubmit(e) {
        e.preventDefault()

        // On envoie les informations nécessaires à la création du compte.
        try {
            await api.post("/users/register/", {
                email,
                password,
                first_name: firstName,
                last_name: lastName
            })

            // Ensure the UI is not left authenticated as a previous account.
            logout()
            setMessage("Registration successful. Please log in.")
        } catch (err) {
            setMessage(err.message)
        }
    }

    // Affichage

    return (
        <main>
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <label>
                    First name
                    <input placeholder="First name" onChange={(e) => setFirstName(e.target.value)} />

                </label>

                <label>
                    Last name
                    <input placeholder="Last name" onChange={(e) => setLastName(e.target.value)} />

                </label>

                <label>
                    Email
                    <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

                </label>

                <label>
                    Password
                    <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />

                </label>

                <button type="submit">Register</button>
            </form>

            {message && <p>{message}</p>}
        </main>
    )
}