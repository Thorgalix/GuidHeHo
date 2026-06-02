import { useEffect, useState } from "react"
import { api } from "../services/api"

export default function MyBookings() {
    const [bookings, setBookings] = useState([])

    useEffect(() => {
        async function load() {
            try {
                const data = await api.get("/bookings/my/")
                setBookings(data)
            } catch (err) {
                console.error(err)
            }
        }

        load()
    }, [])

    return (
        <div>
            <h2>My Bookings</h2>

            {bookings.map((b) => (
                <div key={b.id}>
                    <p>Guide: {b.guide}</p>
                    <p>Date: {b.booking_date}</p>
                    <p>Status: {b.status}</p>
                </div>
            ))}
        </div>
    )
}