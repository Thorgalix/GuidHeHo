import { useState, useEffect } from "react"
import { api } from "../services/api"

export default function FilterBar({ onSearch }) {
    const [city, setCity] = useState("")
    const [theme, setTheme] = useState("")
    const [language, setLanguage] = useState("")
    const [priceMax, setPriceMax] = useState("")

    const [themes, setThemes] = useState([])
    const [languages, setLanguages] = useState([])

    useEffect(() => {
        async function loadFilters() {
            try {
                const [t, l] = await Promise.all([
                    api.get("/guides/themes/"),
                    api.get("/guides/languages/")
                ])

                setThemes(t)
                setLanguages(l)
            } catch (err) {
                console.error(err)
            }
        }

        loadFilters()
    }, [])

    function handleSubmit(e) {
        e.preventDefault()

        onSearch({
            city,
            theme,
            language,
            price_max: priceMax
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />

            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="">All themes</option>
                {themes.map((t) => (
                    <option key={t.id} value={t.id}>
                        {t.name}
                    </option>
                ))}
            </select>

            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="">All languages</option>
                {languages.map((l) => (
                    <option key={l.id} value={l.id}>
                        {l.name}
                    </option>
                ))}
            </select>

            <input
                type="number"
                placeholder="Max price"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
            />

            <button type="submit">
                Search
            </button>
        </form>
    )
}