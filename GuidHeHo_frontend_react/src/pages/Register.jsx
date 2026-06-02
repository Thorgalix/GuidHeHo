import { useState } from "react"
import { api } from "../services/api"

export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [message, setMessage] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            await api.post("/users/register/", {
                email,
                password,
                first_name: firstName,
                last_name: lastName
            })

            setMessage("Inscription réussie")
        } catch (err) {
            setMessage(err.message)
        }
    }

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