import { useEffect, useState } from "react";
import { api } from "../../../services/api";

const STATUS_LABELS = {
    pending: "En attente",
    accepted: "Acceptée",
    rejected: "Refusée",
    cancelled: "Annulée",
}

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
                setError(err.message ||"Impossible de charger les réservations.");
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
            setError(err.message || "Impossible de mettre à jour le statut de la réservation.");
        }
    }

    if (loading) {
        return <p>Chargement de vos réservations...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!loading && error === "" && bookingsData.length === 0) {
        return <p>Vous n’avez pas encore de demande de réservation.</p>;
    }

    return (
        <div>
            <h2>Mes demandes de réservation</h2>
            {bookingsData.map((b) => (
                <div className="card border" key={b.id}>
                    <p>Voyageur : {b.traveler.first_name} {b.traveler.last_name}</p>
                    <p>Date : {b.booking_date}</p>
                    <p>Statut : {STATUS_LABELS[b.status] || b.status}</p>
                    <p>Message : {b.message}</p>
                    {b.status === "pending" && (
                        <div>
                            <button
                                className="btn btn-sm mr-2"
                                onClick={() => handleStatusChange(b.id, "accepted")}
                            >
                                Accepter
                            </button>
                            <button
                                className="btn btn-sm btn-error"
                                onClick={() => handleStatusChange(b.id, "rejected")}
                            >
                                Refuser
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

