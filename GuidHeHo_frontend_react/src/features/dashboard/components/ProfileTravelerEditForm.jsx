import { useState, useContext } from "react"
import { AuthContext } from "../../../context/auth-context"
import { api } from "../../../services/api"

export default function ProfileTravelerEditForm({ user, setIsEditing, onUserUpdated }) {
    const { updateUser } = useContext(AuthContext)

    const [firstName, setFirstName] = useState(user.first_name)
    const [lastName, setLastName] = useState(user.last_name)
    const [email, setEmail] = useState(user.email)
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            const data = {}

            if (firstName !== user.first_name) data.first_name = firstName
            if (lastName !== user.last_name) data.last_name = lastName
            if (email !== user.email) data.email = email

            if (Object.keys(data).length === 0) {
                setError("Aucune modification détectée.")
                setLoading(false)
                return
            }



            const updatedUser = await api.patch("/users/me/", data)

            const mergedUser = { ...user, ...updatedUser }
            updateUser(mergedUser)
            if (onUserUpdated) onUserUpdated(mergedUser)
            setSuccess("Profil mis à jour avec succès !")
            setIsEditing(false)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleUploadProfilePicture(e) {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        if (!selectedFile) {
            setError("Veuillez sélectionner un fichier à envoyer.")
            setLoading(false)
            return
        }

        const formData = new FormData()
        formData.append("profile_picture", selectedFile)

        try {
            await api.postFormData("/users/upload-profile/", formData)
            const refreshedUser = await api.get("/users/me/") // Fetch the updated user data
            updateUser(refreshedUser)
            if (onUserUpdated) onUserUpdated(refreshedUser)
            setSuccess("Photo de profil mise à jour avec succès !")
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleChangePassword(e) {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Veuillez remplir tous les champs de mot de passe.")
            setLoading(false)
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Le nouveau mot de passe et sa confirmation ne correspondent pas.")
            setLoading(false)
            return
        }

        if (newPassword === oldPassword) {
            setError("Le nouveau mot de passe doit être différent de l’ancien.")
            setLoading(false)
            return
        }

        try {
            await api.post("/users/change-password/", {
                old_password: oldPassword,
                new_password: newPassword,
                new_password2: confirmPassword,
            })
            setSuccess("Mot de passe modifié avec succès !")
            setOldPassword("")
            setNewPassword("")
            setConfirmPassword("")
            setIsEditing(false)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <form action="" onSubmit={handleSubmit}>
                <h3>Modifier le profil</h3>
                <div>
                    <label htmlFor="first_name">Prénom : </label>
                    <input type="text" id="first_name" name="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />

                    <label htmlFor="last_name">Nom : </label>
                    <input type="text" id="last_name" name="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} />

                    <label htmlFor="email">Email : </label>
                    <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                    <button type="submit" disabled={loading}>{loading ? "Enregistrement..." : "Enregistrer le profil"}</button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {success && <p style={{ color: "green" }}>{success}</p>}
                </div>

                <div>
                    <label htmlFor="profile_picture">Photo de profil : </label>
                    <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
                    <button type="button" onClick={handleUploadProfilePicture} disabled={loading}>
                        {loading ? "Envoi..." : "Envoyer la photo"}
                    </button>
                </div>

                <div>
                    <label htmlFor="oldpassword">Ancien mot de passe : </label>
                    <input
                        type="password"
                        id="oldpassword"
                        name="oldpassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                    <label htmlFor="new_password">Nouveau mot de passe : </label>
                    <input
                        type="password"
                        id="new_password"
                        name="new_password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <label htmlFor="new_password2">Confirmer le nouveau mot de passe : </label>
                    <input
                        type="password"
                        id="new_password2"
                        name="new_password2"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button type="button" onClick={handleChangePassword} disabled={loading}>
                        {loading ? "Modification..." : "Modifier le mot de passe"}
                    </button>
                </div>

                <button type="button" onClick={() => setIsEditing(false)}>Annuler</button>
            </form>
        </div>
    )
}
