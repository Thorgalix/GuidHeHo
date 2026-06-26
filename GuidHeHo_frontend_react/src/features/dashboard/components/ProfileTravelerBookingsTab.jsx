import { useEffect, useState } from "react";
import { api } from "../../../services/api";
import { FaCalendarCheck, FaMapMarkerAlt, FaTrash } from "react-icons/fa";

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

export default function ProfileTravelerBookingsTab() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [actionSuccess, setActionSuccess] = useState("");


    useEffect(() => {
        if (!actionError && !actionSuccess) return

        const timeoutId = window.setTimeout(() => {
            setActionError("")
            setActionSuccess("")
        }, 3500)

        return () => window.clearTimeout(timeoutId)
    }, [actionError, actionSuccess])

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
        setActionError("");
        setActionSuccess("");
        try {
            await api.delete(`/bookings/${bookingId}/`);
            setBookings((prev) => prev.filter((b) => b.id !== bookingId));
            setActionSuccess("Réservation annulée avec succès !");
        } catch (err) {
            setActionError(err.message || "Impossible d’annuler la réservation.");
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
            <section className="card border border-red-400 bg-red-50 shadow-sm dark:bg-red-950">
                <div className="card-body">
                    <p className="text-red-600 dark:text-red-300">
                        {error}
                    </p>
                </div>
            </section>
        )
    }

    if (!loading && error === "" && bookings.length === 0) {
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
                            Retrouvez ici toutes vos réservations passées et à venir.
                        </p>
                    </div>
                </header>

                <div className="my-2 border-t border-teal-200 dark:border-teal-700" />

                <div className="grid gap-4">
                    {bookings.map((b) => {
                        const canCancel = b.status === "pending" || b.status === "accepted";
                        return (
                            <article
                                key={b.id}
                                className="rounded-lg border border-teal-200 bg-white/70 p-4 shadow-sm dark:border-teal-700 dark:bg-teal-950/40"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                            {b.guide.user.first_name} {b.guide.user.last_name}
                                        </h3>

                                        <p className="mt-1 flex items-center gap-2 text-sm text-slate-700 dark:text-teal-50">
                                            <FaMapMarkerAlt className="text-teal-700 dark:text-teal-100" aria-hidden="true" />
                                            {b.guide.city}
                                        </p>
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

                                {canCancel && (
                                    <div className="mt-4 flex flex-wrap justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleCancelBooking(b.id)}
                                            className="btn btn-sm border-none bg-red-600 text-white hover:bg-red-700"
                                        >
                                            <FaTrash aria-hidden="true" />
                                            Annuler la réservation
                                        </button>
                                    </div>
                                )}
                            </article>
                        )
                    })}

                </div>
                {(actionError || actionSuccess) && (
                    <div className="toast toast-start z-50">
                        <div
                            className={
                                actionError
                                    ? "alert border-red-400 bg-red-50 text-red-700 shadow-lg dark:bg-red-950 dark:text-red-200"
                                    : "alert border-teal-600 bg-teal-50 text-teal-700 shadow-lg dark:bg-teal-950 dark:text-teal-100"
                            }
                        >
                            <span>{actionError || actionSuccess}</span>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
