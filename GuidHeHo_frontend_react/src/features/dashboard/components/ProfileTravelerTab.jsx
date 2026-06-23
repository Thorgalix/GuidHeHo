import { useState } from "react"
import ProfileTravelerEditForm from "./ProfileTravelerEditForm"
import ProfileTravelerBookingsTab from "./ProfileTravelerBookingsTab"
import ProfileTravelerReviewsTab from "./ProfileTravelerReviewsTab"
import { useTravelerProfile } from "../hooks/useTravelerProfile"
import { API_BASE_URL } from "../../../config/apiConfig"


export default function ProfileTravelerTab({ user }) {
    const [isEditing, setIsEditing] = useState(false)
    const {
        traveler,
        loading,
        error,
        updateTravelerProfile,
        reviews,
        reviewsLoading,
        reviewsError,
    } = useTravelerProfile(user)

    const BACKEND_URL = API_BASE_URL

    const profilePictureUrl = traveler?.profile_picture
        ? traveler.profile_picture.startsWith("http")
            ? traveler.profile_picture
            : `${BACKEND_URL}${traveler.profile_picture.startsWith("/") ? "" : "/"}${traveler.profile_picture}`
        : null
    const roleLabel = traveler?.role === "guide" ? "Guide" : "Voyageur"

    if (!user) {
        return <p>Veuillez vous connecter pour accéder à votre espace voyageur.</p>
    }

    if (loading) {
        return <p>Chargement du profil voyageur...</p>
    }

    if (!traveler) {
        return <p>{error || "Impossible de charger le profil voyageur pour le moment."}</p>
    }

    return (
        <div>
            <h2>Espace voyageur</h2>
            <h3>Mon profil</h3>
            <div className="card border">
                {profilePictureUrl && (
                    <img src={profilePictureUrl} alt="Profil" className="h-40 w-40 rounded-xl object-cover" />
                )}
                <p>Prénom : {traveler.first_name}</p>
                <p>Nom : {traveler.last_name}</p>
                <p>Rôle : {roleLabel}</p>
                <p>Email : {traveler.email}</p>

                <button type="button" onClick={() => setIsEditing((prev) => !prev)}>
                    {isEditing ? "Fermer l’édition du profil" : "Modifier le profil"}
                </button>
            </div>


            {isEditing && (
                <ProfileTravelerEditForm
                    user={traveler}
                    setIsEditing={setIsEditing}
                    onUserUpdated={updateTravelerProfile}
                />
            )}

            <ProfileTravelerBookingsTab />
            <ProfileTravelerReviewsTab reviews={reviews} loading={reviewsLoading} error={reviewsError} />
        </div>
    )
}
