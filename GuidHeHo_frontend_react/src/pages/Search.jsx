import { useEffect, useState, useRef } from "react"
import { api } from "../services/api"

import GuideCard from "../components/GuideCard"
import FilterBar from "../components/FilterBar"
import GuideMap from "../components/GuideMap"


export default function Search() {
    const [guides, setGuides] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [hasSearched, setHasSearched] = useState(false)


    async function fetchGuides(filters = {}) {
        setLoading(true)
        setError("")

        try {
            let url = "/guides/"


            const params = new URLSearchParams()

            if (filters.city) params.append("city", filters.city)
            if (filters.theme) params.append("theme", filters.theme)
            if (filters.language) params.append("language", filters.language)
            if (filters.price_max) params.append("price_max", filters.price_max)

            const query = params.toString()
            if (query) url += `?${query}`

            const data = await api.get(url)

            setGuides(data)
            setHasSearched(true)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchGuides()
    }, [])

    return (
        <div style={{ padding: "20px" }}>
            <h2>Search Guides</h2>

            <FilterBar onSearch={fetchGuides} />

            {loading && <p>Loading guides...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && hasSearched && guides.length === 0 && (
                <p>No guides found for these filters</p>
            )}

            <div style={{ display:"grid", gap: "16px", padding:"16px", marginTop: "20px"}}>
                {guides.map((guide) => (
                    <GuideCard key={guide.id} guide={guide} />
                ))}
            </div>
            <GuideMap guides={guides} />
        </div>
    )
}