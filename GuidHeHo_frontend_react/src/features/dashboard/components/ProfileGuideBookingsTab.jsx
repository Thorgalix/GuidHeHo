import { useEffect, useState } from "react";
import { api } from "../../../services/api";
import { FaCalendarCheck, FaMapMarkerAlt, FaTrash, FaCheck } from "react-icons/fa";


const STATUS_LABELS = {
    pending: "En attente",
    accepted: "Acceptée",
    rejected: "Refusée",
    cancelled: "Annulée",
}
const STATUS_BADGE_CLASSES = {
    pending: "border-amber-500 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
    accepted: "border-teal-600 bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-100",
    rejected: "border-red-500 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
    cancelled: "border-slate-400 bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-200",
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
                setError(err.message || "Impossible de charger les réservations.");
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
        return (
            <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
                <div className="card-body">
                    <p className="text-slate-700 dark:text-teal-100">
                        Chargement de vos réservations...
                    </p>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="card border border-red-600 bg-red-50 shadow-sm dark:bg-red-700/70">
                <div className="card-body">
                    <p className="text-red-500 dark:text-red-200">{error}</p>
                </div>
            </section>
        );
    }

    if (!loading && error === "" && bookingsData.length === 0) {
        return (
            <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
                <div className="card-body">
                    <h2 className="card-title text-slate-900 dark:text-white">
                        Mes réservations
                    </h2>
                    <p className="text-slate-700 dark:text-teal-100">
                        Vous n’avez pas encore de réservation.
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
            <div className="card-body">
                <header className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-100">
                        <FaCalendarCheck aria-hidden="true" />
                    </span>

                    <div>
                        <h2 className="card-title text-slate-900 dark:text-white">
                            Mes réservations
                        </h2>
                        <p className="text-sm text-slate-700 dark:text-teal-50">
                            Retrouvez ici toutes vos réservations traitées ou à traiter.
                        </p>
                    </div>
                </header>

                <div className="my-2 border-t border-teal-200 dark:border-teal-700" />

                <div className="grid gap-4">
                    {bookingsData.map((b) => (
                        <article
                            key={b.id}
                            className="rounded-lg border border-teal-200 bg-white/70 p-4 shadow-sm dark:border-teal-700 dark:bg-teal-950/40"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        {b.traveler.first_name} {b.traveler.last_name}
                                    </h3>
                                </div>

                                <span
                                    className={`badge border ${STATUS_BADGE_CLASSES[b.status] || "border-slate-400 bg-slate-100 text-slate-600"
                                        }`}
                                >
                                    {STATUS_LABELS[b.status] || b.status}
                                </span>
                            </div>

                            <dl className="mt-4 grid gap-3 text-sm text-slate-700 dark:text-teal-50 sm:grid-cols-2">
                                <div>
                                    <dt className="font-semibold text-slate-900 dark:text-white">Date</dt>
                                    <dd className="mt-1">
                                        {b.booking_date}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="font-semibold text-slate-900 dark:text-white">Message</dt>
                                    <dd className="mt-1">{b.message || "Aucun message ajouté."}</dd>
                                </div>
                            </dl>

                            {b.status === "pending" && (
                                <div className="mt-4 flex flex-wrap justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleStatusChange(b.id, "accepted")}
                                        className="btn btn-sm border-none bg-teal-500 text-white hover:bg-teal-600"
                                    >
                                        <FaCheck aria-hidden="true" />
                                        Accepter
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleStatusChange(b.id, "rejected")}
                                        className="btn btn-sm border-none bg-red-600 text-white hover:bg-red-700"
                                    >
                                        <FaTrash aria-hidden="true" />
                                        Refuser
                                    </button>

                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
