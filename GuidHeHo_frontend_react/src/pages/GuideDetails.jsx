import { useEffect, useState, useRef, useContext } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { api } from "../services/api"


export default function GuideDetails() {
    const { id } = useParams()

    const { isAuthenticated } = useContext(AuthContext)
    const [guide, setGuide] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const mapRef = useRef(null)

    const [showBooking, setShowBooking] = useState(false)
    const [date, setDate] = useState("")
    const [people, setPeople] = useState("")
    const [message, setMessage] = useState("")
    const [status, setStatus] = useState("")


    useEffect(() => {
        if (!guide || !window.mapboxgl) return

        window.mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

        const map = new window.mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [guide.longitude, guide.latitude],
            zoom: 11
        })

        new window.mapboxgl.Marker()
            .setLngLat([guide.longitude, guide.latitude])
            .addTo(map)

        return () => map.remove()
    }, [guide])

    useEffect(() => {
        async function fetchGuide() {
            try {
                const data = await api.get(`/guides/${id}/`)
                setGuide(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchGuide()
    }, [id])

    if (loading) return <p>Loading...</p>
    if (error) return <p style={{ color: "red" }}>{error}</p>
    if (!guide) return <p>No guide found</p>

    return (
        <div style={{ padding: "20px" }}>
            <h2>
                {guide.user.first_name} {guide.user.last_name}
            </h2>

            <p>{guide.city}</p>
            <p>{guide.price_per_hour}€/hour</p>
            <p>{guide.bio}</p>

            <p>{guide.languages?.join(", ")}</p>
            <p>{guide.themes?.join(", ")}</p>
            {isAuthenticated && (
                <button onClick={() => setShowBooking(true)}>
                    Book this guide
                </button>
            )}
            {showBooking && (
                <div>
                    <h3>Book this guide</h3>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <input
                        type="number"
                        value={people}
                        min="1"
                        onChange={(e) => setPeople(e.target.value)}
                    />

                    <textarea
                        placeholder="Message (optional)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <button onClick={async () => {
                        try {
                            setStatus("Sending...")

                            await api.post("/bookings/", {
                                guide: guide.id,
                                booking_date: date,
                                number_of_people: Number(people),
                                message
                            })

                            setStatus("Booking sent!")
                            setShowBooking(false)

                        } catch (err) {
                            setStatus(err.message)
                        }
                    }}>
                        Confirm booking
                    </button>

                    <p>{status}</p>
                </div>
            )}

            <div
                id="map"
                style={{ width: "100%", height: "400px", marginTop: "20px" }}
            />
        </div>
    )
}