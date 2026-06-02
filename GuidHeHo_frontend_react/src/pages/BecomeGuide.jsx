import { useEffect, useState, useContext } from "react"
import { api } from "../services/api"
import { AuthContext } from "../context/AuthContext"

export default function BecomeGuide() {
    const { user, isAuthenticated } = useContext(AuthContext)

    const [bio, setBio] = useState("")
    const [city, setCity] = useState("")
    const [price, setPrice] = useState("")

    const [themes, setThemes] = useState([])
    const [languages, setLanguages] = useState([])

    const [selectedThemes, setSelectedThemes] = useState([])
    const [selectedLanguages, setSelectedLanguages] = useState([])

    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    // 🔽 load options
    useEffect(() => {
        async function load() {
            try {
                const [t, l] = await Promise.all([
                    api.get("/guides/themes/"),
                    api.get("/guides/languages/")
                ])

                setThemes(t)
                setLanguages(l)
            } catch (err) {
                setMessage(err.message)
            }
        }

        load()
    }, [])

    function toggle(setter, value) {
        setter((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        )
    }

    async function handleSubmit(e) {
        e.preventDefault()

        setMessage("")
        setLoading(true)

        if (!bio || !city || !price) {
            setMessage("Tous les champs sont requis")
            setLoading(false)
            return
        }

        try {
            await api.post("/guides/", {
                bio,
                city,
                price_per_hour: Number(price),
                themes: selectedThemes,
                languages: selectedLanguages
            })

            setMessage("Profil guide créé avec succès")

            setBio("")
            setCity("")
            setPrice("")
            setSelectedThemes([])
            setSelectedLanguages([])

        } catch (err) {
            setMessage(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!isAuthenticated) {
        return <p>Tu dois être connecté pour devenir guide.</p>
    }

    return (
        <div>
            <h2>Become a Guide</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />

                <input
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Price per hour"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                <h4>Themes</h4>
                {themes.map((t) => (
                    <label key={t.id}>
                        <input
                            type="checkbox"
                            checked={selectedThemes.includes(t.id)}
                            onChange={() => toggle(setSelectedThemes, t.id)}
                        />
                        {t.name}
                    </label>
                ))}

                <h4>Languages</h4>
                {languages.map((l) => (
                    <label key={l.id}>
                        <input
                            type="checkbox"
                            checked={selectedLanguages.includes(l.id)}
                            onChange={() => toggle(setSelectedLanguages, l.id)}
                        />
                        {l.name}
                    </label>
                ))}

                <button type="submit" disabled={loading}>
                    {loading ? "Création..." : "Become Guide"}
                </button>
            </form>

            {message && <p>{message}</p>}
        </div>
    )
}