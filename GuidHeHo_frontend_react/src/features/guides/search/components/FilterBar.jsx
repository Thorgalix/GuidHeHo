import { useState, useEffect } from "react"
import { api } from "../../../../services/api"

export default function FilterBar({ onSearch }) {

    // States

    const [city, setCity] = useState("")
    const [theme, setTheme] = useState("")
    const [language, setLanguage] = useState("")
    const [priceMax, setPriceMax] = useState("")

    const [themes, setThemes] = useState([])
    const [languages, setLanguages] = useState([])

    const [availabilityDate, setAvailabilityDate] = useState("")
    const [numberOfPeople, setNumberOfPeople] = useState("")

    // Comportements

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

        // On transmet les filtres saisis au composant parent.
        onSearch({
            city,
            date: availabilityDate,
            theme,
            language,
            max_price: priceMax,
            number_of_people: numberOfPeople,
        })
    }

    // Affichage

    return (
        <form
            onSubmit={handleSubmit}
            className="card bg-teal-50 dark:bg-teal-900 shadow-md border border-teal-600 mt-4"
        >
            <div className="card-body">
                <h2 id="search-title" className="card-title dark:text-white">
                    Find your guide
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">

                    <label className="form-control">
                        <div className="label">
                            <span className="label-text dark:text-white mb-1">City</span>
                        </div>
                        <input
                            name="city"
                            type="text"
                            placeholder="ex: Paris ..."
                            className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
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
                            className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                            value={availabilityDate}
                            onChange={(e) => setAvailabilityDate(e.target.value)}
                        />
                    </label>

                    <label className="form-control">
                        <div className="label mb-1">
                            <span className="label-text dark:text-white">Theme</span>
                        </div>
                        <select
                            name="theme"
                            className="select select-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                        >
                            <option value="">All themes</option>
                            {themes.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="form-control">
                        <div className="label mb-1">
                            <span className="label-text dark:text-white">Language</span>
                        </div>
                        <select
                            name="language"
                            className="select select-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option value="">All languages</option>
                            {languages.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="form-control">
                        <div className="label mb-1">
                            <span className="label-text dark:text-white">Number of people</span>
                        </div>
                        <input
                            type="number"
                            name="numberOfPeople"
                            placeholder="ex: 2"
                            className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                            value={numberOfPeople}
                            onChange={(e) => setNumberOfPeople(e.target.value)}
                        />
                    </label>

                    <label className="form-control">
                        <div className="label mb-1">
                            <span className="label-text dark:text-white">Max price (€)</span>
                        </div>
                        <input
                            type="number"
                            name="priceMax"
                            placeholder="ex: 100"
                            className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                            value={priceMax}
                            onChange={(e) => setPriceMax(e.target.value)}
                        />
                    </label>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="btn bg-teal-500 hover:bg-teal-600 text-white dark:text-white border-none w-full"
                        >
                            Search
                        </button>
                    </div>

                </div>
            </div>
        </form>
    )
}