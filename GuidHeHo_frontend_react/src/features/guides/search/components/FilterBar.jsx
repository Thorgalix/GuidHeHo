import { useState, useEffect } from "react"
import { api } from "../../../../services/api"

export default function FilterBar({ onSearch, initialFilters = {} }) {

    // States

    const [city, setCity] = useState(initialFilters.city || "")
    const [theme, setTheme] = useState(initialFilters.theme || "")
    const [language, setLanguage] = useState(initialFilters.language || "")
    const [priceMax, setPriceMax] = useState(initialFilters.max_price || "")

    const [themes, setThemes] = useState([])
    const [languages, setLanguages] = useState([])

    const [availabilityDate, setAvailabilityDate] = useState(initialFilters.date || "")
    const [numberOfPeople, setNumberOfPeople] = useState(initialFilters.number_of_people || "")

    // Comportements

    function blockInvalidNumberKeys(e, allowDecimal = false) {
        const blockedKeys = allowDecimal ? ["e", "E", "+", "-"] : ["e", "E", "+", "-", ".", ","]

        if (blockedKeys.includes(e.key)) {
            e.preventDefault()
        }
    }

    function sanitizePositiveInteger(value) {
        const digits = value.replace(/\D/g, "")

        if (!digits) return ""

        return String(Math.max(Number(digits), 1))
    }

    function sanitizePositiveDecimal(value, allowTrailingDecimal = true) {
        const normalizedValue = value.replace(",", ".").replace(/[^\d.]/g, "")
        const [integerPart, ...decimalParts] = normalizedValue.split(".")

        if (!integerPart && decimalParts.length === 0) return ""

        const decimalPart = decimalParts.join("").slice(0, 2)
        const normalizedNumber = decimalPart ? `${integerPart || "0"}.${decimalPart}` : integerPart
        const number = Number(normalizedNumber)

        if (!Number.isFinite(number)) return ""
        if (allowTrailingDecimal && normalizedValue.endsWith(".") && decimalParts.length > 0) {
            return `${Math.max(Math.trunc(number), 1)}.`
        }

        return decimalPart ? String(Math.max(number, 1)) : String(Math.max(Math.trunc(number), 1))
    }

    useEffect(() => {
        // On charge les options de filtres themes et languages depuis l'API au montage.
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

        const sanitizedNumberOfPeople = sanitizePositiveInteger(numberOfPeople)
        const sanitizedPriceMax = sanitizePositiveDecimal(priceMax, false)

        // On transmet les filtres saisis au composant parent.
        onSearch({
            city: city.trim(),
            date: availabilityDate,
            theme,
            language,
            max_price: sanitizedPriceMax,
            number_of_people: sanitizedNumberOfPeople,
        })
    }

    // Affichage

    return (
        <form
            onSubmit={handleSubmit}
            className="card bg-teal-50 dark:bg-teal-700/70 shadow-md border border-teal-500 mt-4"
        >
            <div className="card-body">
                <h2 id="search-title" className="card-title dark:text-white">
                    Trouvez votre guide
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">

                    <label className="form-control">
                        <div className="label">
                            <span className="label-text dark:text-white mb-1">Ville</span>
                        </div>
                        <input
                            name="city"
                            type="text"
                            placeholder="ex: Paris ..."
                            maxLength={80}
                            className="input input-bordered dark:bg-teal-900 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </label>

                    <label className="form-control">
                        <div className="label mb-1">
                            <span className="label-text dark:text-white">Date</span>
                        </div>

                        <input
                            name="date"
                            type="date"
                            className="input input-bordered dark:bg-teal-900 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                            value={availabilityDate}
                            onChange={(e) => setAvailabilityDate(e.target.value)}
                        />
                    </label>

                    <label className="form-control">
                        <div className="label mb-1">
                            <span className="label-text dark:text-white">Thème</span>
                        </div>
                        <select
                            name="theme"
                            className="select select-bordered dark:bg-teal-900 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                        >
                            <option value="">Tous les thèmes</option>
                            {themes.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="form-control">
                        <div className="label mb-1">
                            <span className="label-text dark:text-white">Langue</span>
                        </div>
                        <select
                            name="language"
                            className="select select-bordered dark:bg-teal-900 border-teal-500 w-full focus:outline-none focus:border-teal-300"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option value="">Toutes les langues</option>
                            {languages.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="form-control">
                        <div className="label mb-1">
                            <span className="label-text dark:text-white">Nombre de personnes</span>
                        </div>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            name="numberOfPeople"
                            placeholder="ex: 2"
                            className="input input-bordered dark:bg-teal-900 border-teal-500 w-full focus:outline-none focus:border-teal-300"
                            value={numberOfPeople}
                            onChange={(e) => setNumberOfPeople(sanitizePositiveInteger(e.target.value))}
                            onKeyDown={blockInvalidNumberKeys}
                        />
                    </label>

                    <label className="form-control">
                        <div className="label mb-1">
                            <span className="label-text dark:text-white">Prix maximum (€)</span>
                        </div>
                        <input
                            type="text"
                            inputMode="decimal"
                            name="priceMax"
                            placeholder="ex: 100"
                            className="input input-bordered dark:bg-teal-900 border-teal-500 w-full focus:outline-none focus:border-teal-300"
                            value={priceMax}
                            onChange={(e) => setPriceMax(sanitizePositiveDecimal(e.target.value))}
                            onKeyDown={(e) => blockInvalidNumberKeys(e, true)}
                        />
                    </label>

                    <div className="md:col-span-2 lg:col-span-1 lg:col-start-6">
                        <button
                            type="submit"
                            className="btn bg-teal-500 hover:bg-teal-600 text-white dark:text-white border-none w-full"
                        >
                            Rechercher
                        </button>
                    </div>

                </div>
            </div>
        </form>
    )
}
