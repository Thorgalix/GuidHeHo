import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function TravelerBookingsTab() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadBookings() {
            try {
                setLoading(true);
                setError("");
                const data = await api.get("/bookings/my/");
                setBookings(data);
            } catch (err) {
                setError("Failed to load bookings.");
            } finally {
                setLoading(false);
            }
        }

        loadBookings();
    }, []);

    if (loading) {
        return <p>Loading your bookings...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!loading && error === "" && bookings.length === 0) {
        return <p>You have no bookings requests yet.</p>;
    }

    return (
        <div>
            <h2>My Bookings Requests</h2>
            {bookings.map((b) => (
                <div key={b.id}>
                    <p>Guide : {b.guide.user.first_name} {b.guide.user.last_name}</p>
                    <p>City : {b.guide.city}</p>
                    <p>Date : {b.booking_date}</p>
                    <p>Status : {b.status}</p>
                </div>
            ))}
        </div>
    )
}