import { useState, useEffect } from "react"
import { api } from "../services/api"

export default function FilterBar({ onSearch }) {
    
    // States
    
    const [city, setCity] = useState("")
    const [theme, setTheme] = useState("")
    const [language, setLanguage] = useState("")
    const [priceMax, setPriceMax] = useState("")

    const [themes, setThemes] = useState([])
    const [languages, setLanguages] = useState([])

    // Comportements

    useEffect(() => {
        // On charge les options de filtres depuis l'API au montage.
        async function loadFilters() {
            try {
                const [t, l] = await Promise.all([
                    api.get("/api/guides/themes/"),
                    api.get("/api/guides/languages/")
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

        // On transmet les filtres saisis au composant parent.
        onSearch({
            city,
            theme,
            language,
            max_price: priceMax
        })
    }

    // Affichage

    return (
        <form onSubmit={handleSubmit}>
            <input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />

            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="">All themes</option>
                {(themes ?? []).map((t, index) => (
                    <option key={t.id ?? `theme-${index}`} value={t.id}>
                        {t.name}
                    </option>
                ))}
            </select>

            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="">All languages</option>
                {(languages ?? []).map((l, index) => (
                    <option key={l.id ?? `language-${index}`} value={l.id}>
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