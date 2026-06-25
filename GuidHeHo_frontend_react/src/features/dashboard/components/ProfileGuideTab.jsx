import ProfileGuideBookingsTab from "./ProfileGuideBookingsTab"
import { useGuideAvailabilitiesManager } from "../hooks/useGuideAvailabilitiesManager"
import { useGuideProfile } from "../hooks/useGuideProfile"
import AvailabilitySelector from "../../guides/become-guide/components/AvailabilitySelector"
import WeeklyEditor from "../../guides/become-guide/components/WeeklyEditor"
import DayEditor from "../../guides/become-guide/components/DayEditor"
import CapacitySelector from "../../guides/become-guide/components/CapacitySelector"
import ProfileGuideEditForm from "./ProfileGuideEditForm"
import ProfileGuideReviewsTab from "./ProfileGuideReviewsTab"
import { useState, useContext } from "react"
import { AuthContext } from "../../../context/auth-context"
import { api } from "../../../services/api"
import { FaCompass, FaPen, FaTrash } from "react-icons/fa"

export default function ProfileGuideTab({ user }) {
    const { isGuide, guide, setGuide, loading, error } = useGuideProfile(user)
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState("")
    const [deleteSuccess, setDeleteSuccess] = useState("")
    const {
        message, submitting, submitSummary,
        maxPeople, setMaxPeople,
        availabilityMode, setAvailabilityMode,
        weekStartDate, setWeekStartDate,
        weekTemplate, updateWeekDay, addWeekInterval, updateWeekInterval, removeWeekInterval,
        singleDays, addSingleDay, removeSingleDay, updateSingleDay, addSingleDayInterval, updateSingleDayInterval, removeSingleDayInterval,
        handleSubmitAvailabilities
    } = useGuideAvailabilitiesManager()
    const { updateUser } = useContext(AuthContext)

    async function handleDeleteGuide() {
        const confirmed = window.confirm("Voulez-vous vraiment supprimer votre profil guide ? Cette action est irréversible.")
        if (!confirmed || !guide?.id || isDeleting) return

        setIsDeleting(true)
        setDeleteError("")
        setDeleteSuccess("")

        try {
            await api.delete(`/api/guides/${guide.id}/`)
            setDeleteSuccess("Profil guide supprimé avec succès.")
            setGuide(null)
            updateUser({ ...user, role: "traveler" })
            setIsEditing(false)
        } catch (error) {
            setDeleteError(error.message || "Impossible de supprimer le profil guide. Veuillez réessayer plus tard.")
        } finally {
            setIsDeleting(false)
        }
    }

    if (!isGuide) {
        return (
            <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
                <div className="card-body">
                    <p className="text-slate-700 dark:text-teal-100">
                        Vous n’êtes pas encore guide. Devenez guide pour accéder à cet espace.
                    </p>
                </div>
            </section>
        )
    }

    if (loading) {
        return (
            <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
                <div className="card-body">
                    <p className="text-slate-700 dark:text-teal-100">
                        Chargement du profil guide...
                    </p>
                </div>
            </section>
        )
    }

    if (!guide) {
        return (
            <section className="card border border-red-400 bg-red-50 shadow-sm dark:bg-red-950">
                <div className="card-body">
                    <p className="text-red-600 dark:text-red-300">
                        {error || "Impossible de charger le profil guide pour le moment."}
                    </p>
                </div>
            </section>
        )
    }


    return (
        <div className="space-y-6">
            <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
                <div className="card-body">
                    <header className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-100">
                            <FaCompass aria-hidden="true" />
                        </span>

                        <div>
                            <h2 className="card-title text-slate-900 dark:text-white">
                                Mon profil guide
                            </h2>
                            <p className="text-sm text-slate-700 dark:text-teal-50">
                                Retrouvez les informations de votre profil guide.
                            </p>
                        </div>
                    </header>

                    <div className="my-2 border-t border-teal-200 dark:border-teal-700" />

                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {guide.user.first_name} {guide.user.last_name}
                                </h3>
                                <p className="mt-1 text-sm text-slate-700 dark:text-teal-50">
                                    {guide.user.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => setIsEditing(prev => !prev)}
                                className="btn border-none bg-teal-500 text-white hover:bg-teal-600"
                            >
                                <FaPen aria-hidden="true" />
                                {isEditing ? "Fermer l’édition du profil" : "Modifier le profil"}
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteGuide}
                                disabled={isDeleting}
                                className="btn border-none bg-red-600 text-white hover:bg-red-700 disabled:bg-slate-300 disabled:text-slate-500"
                            >
                                <FaTrash aria-hidden="true" />
                                {isDeleting ? "Suppression..." : "Supprimer le profil"}
                            </button>
                        </div>
                    </div>

                    <dl className="grid gap-4 rounded-lg border border-teal-200 bg-white/70 p-4 text-sm text-slate-700 dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-50 sm:grid-cols-2">
                        <div>
                            <dt className="font-semibold text-slate-900 dark:text-white">Bio</dt>
                            <dd className="mt-1">{guide.bio}</dd>
                        </div>

                        <div>
                            <dt className="font-semibold text-slate-900 dark:text-white">Ville</dt>
                            <dd className="mt-1">{guide.city}</dd>
                        </div>

                        <div>
                            <dt className="font-semibold text-slate-900 dark:text-white">Langues</dt>
                            <dd className="mt-1 flex flex-wrap gap-1">
                                {guide.languages.map((language) => (
                                    <span key={language.id} className="badge border-teal-600 bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-100">
                                        {language.name}
                                    </span>
                                ))}
                            </dd>
                        </div>

                        <div>
                            <dt className="font-semibold text-slate-900 dark:text-white">Themes</dt>
                            <dd className="mt-1 flex flex-wrap gap-1">
                                {guide.themes.map((theme) => (
                                    <span key={theme.id} className="badge border-teal-600 bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-100">
                                        {theme.name}
                                    </span>
                                ))}
                            </dd>
                        </div>

                        <div>
                            <dt className="font-semibold text-slate-900 dark:text-white">Prix par heure</dt>
                            <dd className="mt-1">{guide.price_per_hour} €</dd>
                        </div>
                    </dl>


                    {deleteError && (
                        <p className="text-sm font-medium text-red-600 dark:text-red-300">
                            {deleteError}
                        </p>
                    )}
                    {deleteSuccess && (
                        <p className="text-sm font-medium text-teal-700 dark:text-teal-100">
                            {deleteSuccess}
                        </p>
                    )}
                </div>
            </section>

            {isEditing && (
                <ProfileGuideEditForm
                    guide={guide}
                    setIsEditing={setIsEditing}
                    onGuideUpdated={setGuide}
                />
            )}

            <div>
                <h3>Ajouter des disponibilités</h3>
            </div>
            <CapacitySelector
                maxPeople={maxPeople}
                setMaxPeople={setMaxPeople}
            />
            <div>

                <form onSubmit={handleSubmitAvailabilities}>
                    <AvailabilitySelector
                        availabilityMode={availabilityMode}
                        setAvailabilityMode={setAvailabilityMode}
                        maxPeople={maxPeople}
                        setMaxPeople={setMaxPeople}
                    />
                    <WeeklyEditor
                        availabilityMode={availabilityMode}
                        weekStartDate={weekStartDate}
                        setWeekStartDate={setWeekStartDate}
                        weekTemplate={weekTemplate}
                        updateWeekDay={updateWeekDay}
                        addWeekInterval={addWeekInterval}
                        updateWeekInterval={updateWeekInterval}
                        removeWeekInterval={removeWeekInterval}
                    />
                    <DayEditor
                        availabilityMode={availabilityMode}
                        singleDays={singleDays}
                        addSingleDay={addSingleDay}
                        removeSingleDay={removeSingleDay}
                        updateSingleDay={updateSingleDay}
                        addSingleDayInterval={addSingleDayInterval}
                        updateSingleDayInterval={updateSingleDayInterval}
                        removeSingleDayInterval={removeSingleDayInterval}
                    />
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Enregistrement..." : "Ajouter les disponibilités"}
                    </button>
                </form>
                {message && <p style={{ color: "red" }}>{message}</p>}
                {submitSummary && <p style={{ color: "green" }}>{submitSummary}</p>}
            </div>
            <div>
                <ProfileGuideBookingsTab />
                <ProfileGuideReviewsTab guideId={guide.id} />
            </div>
        </div>
    )
}
