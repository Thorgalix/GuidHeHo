import { useEffect, useState } from "react";
import { api } from "../../../services/api";

const STATUS_LABELS = {
    pending: "En attente",
    accepted: "Acceptée",
    rejected: "Refusée",
    cancelled: "Annulée",
}

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
                setError(err.message || "Impossible de charger les réservations.");
            } finally {
                setLoading(false);
            }
        }

        loadBookings();
    }, []);

    async function handleCancelBooking(bookingId) {
        if (!window.confirm("Voulez-vous vraiment annuler cette réservation ?")) {
            return;
        }

        try {
            await api.delete(`/bookings/${bookingId}/`);
            setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        } catch (err) {
            alert(err.message || "Impossible d’annuler la réservation.");
        }
    }

    if (loading) {
        return <p>Chargement de vos réservations...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!loading && error === "" && bookings.length === 0) {
        return <p>Vous n’avez pas encore de réservation.</p>;
    }

    return (
        <div>
            <h2>Mes réservations</h2>
            {bookings.map((b) => (
                <div className="card border" key={b.id}>
                    <p>Guide : {b.guide.user.first_name} {b.guide.user.last_name}</p>
                    <p>Ville : {b.guide.city}</p>
                    <p>Date : {b.booking_date}</p>
                    <p>Statut : {STATUS_LABELS[b.status] || b.status}</p>
                    <p>Message : {b.message}</p>
                    <button type="button" onClick={() => handleCancelBooking(b.id)}>Annuler la réservation</button>
                </div>
            ))}
        </div>
    )
}
