import { useContext, useState } from "react"
import { AuthContext } from "../../../context/auth-context"
import ProfileTravelerEditForm from "./ProfileTravelerEditForm"
import ProfileTravelerBookingsTab from "./ProfileTravelerBookingsTab"
import ProfileTravelerReviewsTab from "./ProfileTravelerReviewsTab"
import { useTravelerProfile } from "../hooks/useTravelerProfile"
import { API_BASE_URL } from "../../../config/apiConfig"
import { api } from "../../../services/api"


export default function ProfileTravelerTab({ user }) {
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState("")
    const [deleteSuccess, setDeleteSuccess] = useState("")
    const { clearSession } = useContext(AuthContext)

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

    async function handleDeleteTraveler() {
        const confirmed = window.confirm("Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible et supprimera toutes vos données.")
        if (!confirmed || !traveler?.id) return

        setIsDeleting(true)
        setDeleteError("")
        setDeleteSuccess("")

        try {
            await api.delete(`/users/me/`)
            setDeleteSuccess("Compte supprimé avec succès.")
            clearSession()
        } catch {
            setDeleteError("Impossible de supprimer le compte pour le moment.")
        } finally {
            setIsDeleting(false)
        }
    }
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
                <button type="button" onClick={handleDeleteTraveler} disabled={isDeleting}>
                    {isDeleting ? "Suppression en cours..." : "Supprimer votre compte"}
                </button>
                {deleteError && <p className="text-red-500">{deleteError}</p>}
                {deleteSuccess && <p className="text-green-500">{deleteSuccess}</p>}
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
