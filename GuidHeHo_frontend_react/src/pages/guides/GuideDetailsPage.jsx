import {
    FaArrowLeft,
    FaCalendarCheck,
    FaEnvelope,
    FaHeart,
    FaMapMarkedAlt,
    FaRegHeart,
    FaStar,
    FaRegStar,
} from "react-icons/fa"
import { useState, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useToggleFavorite } from "../../features/guides/details/hooks/useToggleFavorite"
import { useGuideDetails } from "../../features/guides/details/hooks/useGuideDetails"
import { useGuideReviews } from "../../features/guides/details/hooks/useGuideReviews"
import { useCanReviewGuide } from "../../features/guides/details/hooks/useCanReviewGuide"
import { AuthContext } from "../../context/auth-context"
import { api } from "../../services/api"
import GuideHeader from "../../features/guides/details/components/GuideHeader"
import GuideBookingForm from "../../features/guides/details/components/GuideBookingForm"
import ContactForm from "../../features/guides/details/components/ContactForm"
import GuideDetailMap from "../../features/guides/details/components/GuideDetailMap"
import ReviewList from "../../features/reviews/components/ReviewList"
import ReviewsPagination from "../../features/reviews/components/ReviewsPagination"
import ReviewForm from "../../features/guides/details/components/ReviewForm"

export default function GuideDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { isAuthenticated, user } = useContext(AuthContext)

    const [showBooking, setShowBooking] = useState(false)
    const [showContact, setShowContact] = useState(false)
    const [status, setStatus] = useState("")

    const {
        guide,
        loading,
        error,
        availabilities,
        averageRating,
    } = useGuideDetails(id)

    const {
        isFavorited,
        loading: favoriteLoading,
        error: favoriteError,
        toggleFavorite,
    } = useToggleFavorite({
        guideId: id,
        initialIsFavorited: guide?.is_favorited,
        initialFavoritesCount: guide?.favorites_count,
    })

    const {
        reviews,
        loading: reviewsLoading,
        error: reviewsError,
        reload: reloadReviews,
        page: reviewsPage,
        totalPages: reviewsTotalPages,
        next: reviewsNext,
        previous: reviewsPrevious,
        setPage: setReviewsPage,
    } = useGuideReviews(id)

    const {
        canReview,
        loading: canReviewLoading,
    } = useCanReviewGuide({
        guideId: guide?.id,
        enabled: isAuthenticated && user?.role === "traveler",
    })

    async function handleBookingSubmit(payload) {
        try {
            setStatus("Envoi...")

            await api.post("/bookings/", {
                guide: guide.id,
                ...payload,
            })

            setStatus("Demande de réservation envoyée !")
            setShowBooking(false)
        } catch (err) {
            setStatus(err.message)
        }
    }

    function handleBackToSearch() {
        if (window.history.length > 1) {
            navigate(-1)
            return
        }

        navigate("/")
    }

    if (loading) {
        return (
            <main className="px-5 py-8">
                <section className="mx-auto max-w-6xl">
                    <p className="rounded-lg border border-teal-600 bg-teal-50 p-5 text-slate-700 shadow-sm dark:bg-teal-700/70 dark:text-teal-100">
                        Chargement du profil...
                    </p>
                </section>
            </main>
        )
    }

    if (error) {
        return (
            <main className="px-5 py-8">
                <section className="mx-auto max-w-6xl">
                    <p className="rounded-lg border border-red-400 bg-red-50 p-5 text-red-700 shadow-sm dark:bg-red-950 dark:text-red-200">
                        {error}
                    </p>
                </section>
            </main>
        )
    }

    if (!guide) {
        return (
            <main className="px-5 py-8">
                <section className="mx-auto max-w-6xl">
                    <p className="rounded-lg border border-teal-600 bg-teal-50 p-5 text-slate-700 shadow-sm dark:bg-teal-700/70 dark:text-teal-100">
                        Aucun guide trouvé.
                    </p>
                </section>
            </main>
        )
    }

    const hasAvailabilities = availabilities.length > 0
    const isOwnGuide = user?.id === guide.user?.id
    const canContactGuide = isAuthenticated && !isOwnGuide

    return (
        <main className="px-5 py-8">
            <section className="mx-auto max-w-6xl space-y-8">
                <div>
                    <button
                        type="button"
                        onClick={handleBackToSearch}
                        className="btn btn-sm border-teal-600 bg-white text-teal-700 hover:border-teal-500 hover:bg-teal-100 dark:bg-teal-700/70 dark:text-teal-100 dark:hover:bg-teal-800"
                    >
                        <FaArrowLeft aria-hidden="true" />
                        Retour à la recherche
                    </button>

                    <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-200">
                        Profil guide
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
                        Découvrez ce guide local
                    </h1>

                    <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700 dark:text-teal-50">
                        Consultez son profil, ses disponibilités, sa localisation et les avis des voyageurs avant de réserver.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="space-y-6">
                        <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
                            <div className="card-body">
                                <GuideHeader guide={guide} />

                                <div className="my-2 border-t border-teal-200 dark:border-teal-700" />

                                <div className="flex flex-wrap items-center gap-3">
                                    {isAuthenticated && (
                                        <button
                                            type="button"
                                            onClick={() => setShowBooking((current) => !current)}
                                            disabled={!hasAvailabilities}
                                            className="btn border-none bg-teal-500 text-white hover:bg-teal-600 disabled:bg-slate-300 disabled:text-slate-500"
                                        >
                                            <FaCalendarCheck aria-hidden="true" />
                                            Réserver ce guide
                                        </button>
                                    )}

                                    {canContactGuide && (
                                        <button
                                            type="button"
                                            onClick={() => setShowContact((current) => !current)}
                                            className="btn border-teal-600 bg-white text-teal-700 hover:border-teal-500 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-100 dark:hover:bg-teal-800"
                                        >
                                            <FaEnvelope aria-hidden="true" />
                                            Contacter ce guide
                                        </button>
                                    )}

                                    {isAuthenticated && (
                                        <button
                                            type="button"
                                            onClick={toggleFavorite}
                                            disabled={favoriteLoading}
                                            className="btn btn-ghost btn-circle shrink-0"
                                            aria-label={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
                                        >
                                            {isFavorited ? (
                                                <FaHeart className="text-xl text-red-500" />
                                            ) : (
                                                <FaRegHeart className="text-xl text-red-500" />
                                            )}
                                        </button>
                                    )}
                                </div>

                                {!hasAvailabilities && isAuthenticated && (
                                    <p className="mt-3 text-sm text-slate-600 dark:text-teal-100">
                                        Ce guide n’a pas encore de disponibilité ouverte.
                                    </p>
                                )}

                                {favoriteError && (
                                    <p className="mt-3 text-sm text-red-600 dark:text-red-300">
                                        {favoriteError}
                                    </p>
                                )}

                                {status && (
                                    <p className="mt-3 text-sm font-medium text-teal-700 dark:text-teal-100">
                                        {status}
                                    </p>
                                )}
                            </div>
                        </section>

                        {showBooking && (
                            <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
                                <div className="card-body">
                                    <h2 className="card-title text-slate-900 dark:text-white">
                                        Réservation
                                    </h2>

                                    <GuideBookingForm
                                        availabilities={availabilities}
                                        onSubmit={handleBookingSubmit}
                                        status={status}
                                    />
                                </div>
                            </section>
                        )}

                        {showContact && (
                            <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
                                <div className="card-body">
                                    <h2 className="card-title text-slate-900 dark:text-white">
                                        Contacter le guide
                                    </h2>

                                    <ContactForm guide={guide} />
                                </div>
                            </section>
                        )}

                        {isAuthenticated && (
                            <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
                                <div className="card-body">
                                    <div className="flex items-center gap-3">
                                        <span className="flex size-10 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-100">
                                            <FaStar aria-hidden="true" />
                                        </span>

                                        <div>
                                            <h2 className="card-title text-slate-900 dark:text-white">
                                                Laisser un avis
                                            </h2>
                                            <p className="text-sm text-slate-700 dark:text-teal-50">
                                                Partagez votre expérience après une réservation acceptée.
                                            </p>
                                        </div>
                                    </div>

                                    <ReviewForm
                                        guideId={guide.id}
                                        onCreated={reloadReviews}
                                        canReview={!canReviewLoading && canReview}
                                    />
                                </div>
                            </section>
                        )}

                        <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
                            <div className="card-body">
                                <ReviewList
                                    title="Avis"
                                    reviews={reviews ?? []}
                                    loading={reviewsLoading}
                                    error={reviewsError}
                                    emptyMessage="Aucun avis pour le moment."
                                    getAuthorLabel={(review) =>
                                        review.traveler
                                            ? `${review.traveler.first_name} ${review.traveler.last_name}`
                                            : "Voyageur"
                                    }
                                />

                                <ReviewsPagination
                                    page={reviewsPage}
                                    totalPages={reviewsTotalPages}
                                    previous={reviewsPrevious}
                                    next={reviewsNext}
                                    onPageChange={setReviewsPage}
                                />
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
                            <div className="card-body">
                                <div className="mb-3 flex items-center gap-3">
                                    <span className="flex size-10 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-100">
                                        <FaMapMarkedAlt className="text-xl" aria-hidden="true" />
                                    </span>

                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                            Localisation
                                        </h2>

                                        <p className="text-sm text-slate-700 dark:text-teal-50">
                                            Retrouvez la zone d’activité de ce guide.
                                        </p>
                                    </div>
                                </div>

                                <GuideDetailMap guide={guide} />
                            </div>
                        </section>

                        <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
                            <div className="card-body">
                                <h2 className="card-title text-slate-900 dark:text-white">
                                    Informations rapides
                                </h2>

                                <dl className="space-y-3 text-sm text-slate-700 dark:text-teal-50">
                                    <div className="flex justify-between gap-4">
                                        <dt className="font-semibold">Note moyenne</dt>
                                        <dd className="mt-1 flex items-center gap-1 text-teal-700 dark:text-teal-100">{Array.from({ length: 5 }, (_, index) => {
                                            const Icon = index < averageRating ? FaStar : FaRegStar

                                            return <Icon key={index} aria-hidden="true" />
                                        })}</dd>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <dt className="font-semibold">Disponibilités</dt>
                                        <dd>{availabilities.length}</dd>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <dt className="font-semibold">Avis affichés</dt>
                                        <dd>{reviews?.length ?? 0}</dd>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <dt className="font-semibold">Tarif</dt>
                                        <dd>
                                            {guide.price_per_hour
                                                ? `${guide.price_per_hour} € / heure`
                                                : "Non renseigné"}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </section>
                    </aside>
                </div>
            </section>
        </main>
    )
}
