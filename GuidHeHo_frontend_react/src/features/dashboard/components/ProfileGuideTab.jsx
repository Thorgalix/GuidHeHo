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
    const { isGuide, guide, setGuide, reviews, loading, reviewsLoading, error, reviewsError } = useGuideProfile(user)
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
        const confirmed = window.confirm("Are you sure you want to delete your guide profile? This action cannot be undone.")
        if (!confirmed || !guide?.id || isDeleting) return

        setIsDeleting(true)
        setDeleteError("")
        setDeleteSuccess("")

        try {
            await api.delete(`/api/guides/${guide.id}/`)
            setDeleteSuccess("Guide profile deleted successfully.")
            setGuide(null)
            updateUser({ ...user, role: "traveler" })
            setIsEditing(false)
        } catch (error) {
            setDeleteError(error.message || "Failed to delete guide profile. Please try again later.")
        } finally {
            setIsDeleting(false)
        }
    }

    if (!isGuide) {
        return (
            <div>
                <h2>Guide Dashboard</h2>
                <p>You are not a guide yet. Please apply to become a guide to access this dashboard.</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div>
                <h2>Guide Dashboard</h2>
                <p>Loading guide profile...</p>
            </div>
        )
    }

    if (!guide) {
        return (
            <div>
                <h2>Guide Dashboard</h2>
                <p>{error || "Unable to load guide profile for now."}</p>
            </div>
        )
    }


    return (
        <div>
            <h2>Guide Dashboard</h2>
            <h3>My Profile</h3>
            <div className="card border">
                <p>Bio: {guide.bio}</p>
                <p>City: {guide.city}</p>
                <p>Languages: {(guide.languages || []).map((language) => language.name).join(", ")}</p>
                <p>Themes: {(guide.themes || []).map((theme) => theme.name).join(", ")}</p>
                <p>Price: {guide.price_per_hour}</p>
            
                <button type="button" onClick={() => setIsEditing(prev => !prev)}>
                    {isEditing ? "Close profile editor" : "Edit profile"}
                </button>
                <button
                    type="button"
                    onClick={handleDeleteGuide}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting..." : "Delete profile"}
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
                <h3>Add Disponibilities</h3>
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
                <ProfileGuideReviewsTab 
                reviews={reviews} 
                loading={reviewsLoading} 
                error={reviewsError} />
            </div>
        </div>
    )
}
