import { useEffect, useState } from "react";
import { api } from "../../../services/api";

export default function ProfileTravelerBookingsTab() {
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

    async function handleCancelBooking(bookingId) {
        if (!window.confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        try {
            await api.delete(`/bookings/${bookingId}/`);
            setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        } catch (err) {
            alert("Failed to cancel booking.");
        }
    }

    if (loading) {
        return <p>Loading your bookings...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!loading && error === "" && bookings.length === 0) {
        return <p>You have no bookings yet.</p>;
    }

    return (
        <div>
            <h2>My Bookings</h2>
            {bookings.map((b) => (
                <div className="card border" key={b.id}>
                    <p>Guide : {b.guide.user.first_name} {b.guide.user.last_name}</p>
                    <p>City : {b.guide.city}</p>
                    <p>Date : {b.booking_date}</p>
                    <p>Status : {b.status}</p>
                    <p>Message : {b.message}</p>
                    <button type="button" onClick={() => handleCancelBooking(b.id)}>Cancel Booking</button>
                </div>
            ))}
        </div>
    )
}