import { useState } from "react"
import { useContext } from "react"
import { api } from "../services/api"
import { AuthContext } from "../context/AuthContext"

export default function Register() {

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
            setMessage("Inscription réussie. Vérifie ton email puis connecte-toi.")
        } catch (err) {
            setMessage(err.message)
        }
    }

    // Affichage

    return (
        <div>
            <h2>Register</h2>

            <form onSubmit={handleSubmit}>
                <input placeholder="First name" onChange={(e) => setFirstName(e.target.value)} />
                <input placeholder="Last name" onChange={(e) => setLastName(e.target.value)} />
                <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />

                <button type="submit">Register</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    )
}