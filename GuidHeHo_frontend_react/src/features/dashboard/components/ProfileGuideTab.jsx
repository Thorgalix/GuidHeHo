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
            <div>
                <h2>Espace guide</h2>
                <p>Vous n’êtes pas encore guide. Devenez guide pour accéder à cet espace.</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div>
                <h2>Espace guide</h2>
                <p>Chargement du profil guide...</p>
            </div>
        )
    }

    if (!guide) {
        return (
            <div>
                <h2>Espace guide</h2>
                <p>{error || "Impossible de charger le profil guide pour le moment."}</p>
            </div>
        )
    }


    return (
        <div>
            <h2>Espace guide</h2>
            <h3>Mon profil</h3>
            <div className="card border">
                <p>Bio : {guide.bio}</p>
                <p>Ville : {guide.city}</p>
                <p>Langues : {(guide.languages || []).map((language) => language.name).join(", ")}</p>
                <p>Thèmes : {(guide.themes || []).map((theme) => theme.name).join(", ")}</p>
                <p>Prix : {guide.price_per_hour}</p>
            
                <button type="button" onClick={() => setIsEditing(prev => !prev)}>
                    {isEditing ? "Fermer l’édition du profil" : "Modifier le profil"}
                </button>
                <button
                    type="button"
                    onClick={handleDeleteGuide}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Suppression..." : "Supprimer le profil"}
                </button>

                {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}
                {deleteSuccess && <p style={{ color: "green" }}>{deleteSuccess}</p>}

            </div>

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
