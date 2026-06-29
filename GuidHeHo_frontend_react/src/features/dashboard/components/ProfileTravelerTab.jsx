import { useContext, useState } from "react"
import { AuthContext } from "../../../context/auth-context"
import ProfileTravelerEditForm from "./ProfileTravelerEditForm"
import ProfileTravelerBookingsTab from "./ProfileTravelerBookingsTab"
import ProfileTravelerReviewsTab from "./ProfileTravelerReviewsTab"
import { useTravelerProfile } from "../hooks/useTravelerProfile"
import { API_BASE_URL } from "../../../config/apiConfig"
import { api } from "../../../services/api"
import { FaPen, FaTrash, FaUser } from "react-icons/fa"


export default function ProfileTravelerTab({ user }) {
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isUploadingPicture, setIsUploadingPicture] = useState(false)
    const [deleteError, setDeleteError] = useState("")
    const [deleteSuccess, setDeleteSuccess] = useState("")
    const { clearSession, updateUser } = useContext(AuthContext)

    const {
        traveler,
        loading,
        error,
        updateTravelerProfile,
    } = useTravelerProfile(user)

    const BACKEND_URL = API_BASE_URL

    const profilePictureUrl = traveler?.profile_picture
        ? traveler.profile_picture.startsWith("http")
            ? traveler.profile_picture
            : `${BACKEND_URL}${traveler.profile_picture.startsWith("/") ? "" : "/"}${traveler.profile_picture}`
        : null
    const roleLabel = traveler?.role === "guide" ? "Guide" : "Voyageur"

    async function handleUploadProfilePicture(file) {
        const formData = new FormData()
        formData.append("profile_picture", file)

        setIsUploadingPicture(true)
        setDeleteError("")
        setDeleteSuccess("")

        try {
            await api.postFormData("/users/upload-profile/", formData)
            const refreshedUser = await api.get("/users/me/")
            updateTravelerProfile(refreshedUser)
            updateUser(refreshedUser)
            setDeleteSuccess("Photo de profil mise à jour.")
        } catch (err) {
            setDeleteError(err.message || "Impossible de mettre à jour la photo de profil.")
        } finally {
            setIsUploadingPicture(false)
        }
    }

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
        return (
            <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
                <div className="card-body">
                    <p className="text-slate-700 dark:text-teal-100">
                        Veuillez vous connecter pour accéder à votre espace voyageur.
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
                        Chargement du profil voyageur...
                    </p>
                </div>
            </section>
        )
    }

    if (!traveler) {
        return (
            <section className="card border border-red-400 bg-red-50 shadow-sm dark:bg-red-950">
                <div className="card-body">
                    <p className="text-red-600 dark:text-red-300">
                        {error || "Impossible de charger le profil voyageur pour le moment."}
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
                            <FaUser aria-hidden="true" />
                        </span>

                        <div>
                            <h2 className="card-title text-slate-900 dark:text-white">
                                Espace voyageur
                            </h2>
                            <p className="text-sm text-slate-700 dark:text-teal-50">
                                Gérez vos informations personnelles, vos réservations et vos avis.
                            </p>
                        </div>
                    </header>

                    <div className="my-2 border-t border-teal-200 dark:border-teal-700" />

                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                            <label
                                htmlFor="profile_picture_upload"
                                className="group relative h-24 w-24 shrink-0 cursor-pointer rounded-full"
                            >
                                {profilePictureUrl ? (
                                    <img
                                        src={profilePictureUrl}
                                        alt={`Profil de ${traveler.first_name} ${traveler.last_name}`}
                                        className="h-24 w-24 rounded-full border border-teal-600 bg-base-300 object-cover shadow-sm"
                                    />
                                ) : (
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-teal-600 bg-teal-100 text-3xl font-bold text-teal-700 shadow-sm dark:bg-teal-950 dark:text-teal-100">
                                        <span>
                                            {traveler.first_name?.[0]}
                                            {traveler.last_name?.[0]}
                                        </span>
                                    </div>
                                )}

                                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/50 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                                    {isUploadingPicture ? "Envoi..." : "Modifier"}
                                </span>
                            </label>

                            <input
                                id="profile_picture_upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return

                                    handleUploadProfilePicture(file)
                                    e.target.value = ""
                                }}
                            />


                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {traveler.first_name} {traveler.last_name}
                                </h3>
                                <p className="mt-1 text-sm text-slate-700 dark:text-teal-50">
                                    {traveler.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => setIsEditing((prev) => !prev)}
                                className="btn border-none bg-teal-500 text-white hover:bg-teal-600"
                            >
                                <FaPen aria-hidden="true" />
                                {isEditing ? "Fermer l’édition" : "Modifier le profil"}
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteTraveler}
                                disabled={isDeleting}
                                className="btn border-none bg-red-600 text-white hover:bg-red-700 disabled:bg-slate-300 disabled:text-slate-500"
                            >
                                <FaTrash aria-hidden="true" />
                                {isDeleting ? "Suppression..." : "Supprimer le compte"}
                            </button>
                        </div>
                    </div>

                    <dl className="grid gap-4 rounded-lg border border-teal-200 bg-white/70 p-4 text-sm text-slate-700 dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-50 sm:grid-cols-2">
                        <div>
                            <dt className="font-semibold text-slate-900 dark:text-white">Prénom</dt>
                            <dd className="mt-1">{traveler.first_name}</dd>
                        </div>

                        <div>
                            <dt className="font-semibold text-slate-900 dark:text-white">Nom</dt>
                            <dd className="mt-1">{traveler.last_name}</dd>
                        </div>

                        <div>
                            <dt className="font-semibold text-slate-900 dark:text-white">Rôle</dt>
                            <dd className="mt-1">
                                <span className="badge border-teal-600 bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-100">
                                    {roleLabel}
                                </span>
                            </dd>
                        </div>

                        <div>
                            <dt className="font-semibold text-slate-900 dark:text-white">Email</dt>
                            <dd className="mt-1 break-all">{traveler.email}</dd>
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
                <ProfileTravelerEditForm
                    user={traveler}
                    setIsEditing={setIsEditing}
                    onUserUpdated={updateTravelerProfile}
                />
            )}

            <ProfileTravelerBookingsTab />
            <ProfileTravelerReviewsTab travelerId={traveler.id} />
        </div>
    )
}
