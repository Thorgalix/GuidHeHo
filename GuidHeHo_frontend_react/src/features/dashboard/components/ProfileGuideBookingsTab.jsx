import { useEffect, useState } from "react";
import { api } from "../../../services/api";

export default function ProfileGuideBookingsTab() {
    const [bookingsData, setBookingsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadBookings() {
            try {
                setLoading(true);
                setError("");
                const data = await api.get("/bookings/guide/");

                setBookingsData(data);
            } catch (err) {
                setError(err.message ||"Failed to load bookings.");
            } finally {
                setLoading(false);
            }
        }

        loadBookings();
    }, []);

    async function handleStatusChange(bookingId, newStatus) {
        try {
            await api.patch(`/bookings/${bookingId}/`, { status: newStatus });
            setBookingsData((prev) =>
                prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
            );
        } catch (err) {
            setError(err.message || "Failed to update booking status.");
        }
    }

    if (loading) {
        return <p>Loading your bookings...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!loading && error === "" && bookingsData.length === 0) {
        return <p>You have no bookings yet.</p>;
    }

    return (
        <div>
            <h2>My Bookings Requests</h2>
            {bookingsData.map((b) => (
                <div className="card border" key={b.id}>
                    <p>Traveler : {b.traveler.first_name} {b.traveler.last_name}</p>
                    <p>Date : {b.booking_date}</p>
                    <p>Status : {b.status}</p>
                    <p>Message : {b.message}</p>
                    {b.status === "pending" && (
                        <div>
                            <button
                                className="btn btn-sm mr-2"
                                onClick={() => handleStatusChange(b.id, "accepted")}
                            >
                                Accept
                            </button>
                            <button
                                className="btn btn-sm btn-error"
                                onClick={() => handleStatusChange(b.id, "rejected")}
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}


