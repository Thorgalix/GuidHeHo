import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../../../context/auth-context"
import { api } from "../../../services/api"
import { FaKey, FaSave, FaTimes, FaWrench, FaUser } from "react-icons/fa"

export default function ProfileTravelerEditForm({ user, setIsEditing, onUserUpdated }) {
    const { updateUser } = useContext(AuthContext)

    const [firstName, setFirstName] = useState(user.first_name)
    const [lastName, setLastName] = useState(user.last_name)
    const [email, setEmail] = useState(user.email)
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    useEffect(() => {
        if (!error && !success) return

        const timeoutId = window.setTimeout(() => {
            setError("")
            setSuccess("")
        }, 3500)

        return () => window.clearTimeout(timeoutId)
    }, [error, success])

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
        <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
            <div className="card-body space-y-6">
                <header className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-100">
                        <FaWrench aria-hidden="true" />
                    </span>

                    <div>
                        <h2 className="card-title text-slate-900 dark:text-white">
                            Modifier le profil
                        </h2>
                        <p className="text-sm text-slate-700 dark:text-teal-50">
                            Modifiez vos informations personnelles et changez votre mot de passe.
                        </p>
                    </div>
                </header>

                <div className="my-2 border-t border-teal-200 dark:border-teal-700" />

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <FaUser className="text-teal-700 dark:text-teal-100" aria-hidden="true" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Informations personnelles
                        </h3>
                    </div>

                    <div className="grid gap-4 rounded-lg border border-teal-200 bg-white/70 p-4 dark:border-teal-700 dark:bg-teal-950/40 md:grid-cols-2">
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text font-semibold text-slate-900 dark:text-white">
                                    Prénom
                                </span>
                            </div>

                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="input input-bordered w-full border-teal-600 bg-white text-slate-900 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                            />
                        </label>

                        <label className="form-control">
                            <div className="label">
                                <span className="label-text font-semibold text-slate-900 dark:text-white">
                                    Nom
                                </span>
                            </div>

                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="input input-bordered w-full border-teal-600 bg-white text-slate-900 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                            />
                        </label>

                        <label className="form-control md:col-span-2">
                            <div className="label">
                                <span className="label-text font-semibold text-slate-900 dark:text-white">
                                    Email
                                </span>
                            </div>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input input-bordered w-full border-teal-600 bg-white text-slate-900 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                            />
                        </label>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn border-none bg-teal-500 text-white hover:bg-teal-600 disabled:bg-slate-300 disabled:text-slate-500"
                        >
                            <FaSave aria-hidden="true" />
                            {loading ? "Enregistrement..." : "Enregistrer le profil"}
                        </button>

                    </div>
                </form>

                <div className="border-t border-teal-200 dark:border-teal-700" />

                <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <FaKey className="text-teal-700 dark:text-teal-100" aria-hidden="true" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Mot de passe
                        </h3>
                    </div>

                    <div className="grid gap-4 rounded-lg border border-teal-200 bg-white/70 p-4 dark:border-teal-700 dark:bg-teal-950/40 md:grid-cols-2">
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text font-semibold text-slate-900 dark:text-white">
                                    Ancien mot de passe
                                </span>
                            </div>

                            <input
                                type="password"
                                id="oldpassword"
                                name="oldpassword"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="input input-bordered w-full border-teal-600 bg-white text-slate-900 focus:border-teal-300 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                            />
                        </label>
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text font-semibold text-slate-900 dark:text-white">
                                    Nouveau mot de passe
                                </span>
                            </div>

                            <input
                                type="password"
                                id="new_password"
                                name="new_password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input input-bordered w-full border-teal-600 bg-white text-slate-900 focus:border-teal-300 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                            />
                        </label>
                        <label className="form-control md:col-span-2">
                            <div className="label">
                                <span className="label-text font-semibold text-slate-900 dark:text-white">
                                    Confirmer le nouveau mot de passe
                                </span>
                            </div>

                            <input
                                type="password"
                                id="new_password2"
                                name="new_password2"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input input-bordered w-full border-teal-600 bg-white text-slate-900 focus:border-teal-300 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                            />
                        </label>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn border-teal-600 bg-white text-teal-700 hover:border-teal-500 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-100 dark:hover:bg-teal-800"
                        >
                            <FaKey aria-hidden="true" />
                            {loading ? "Modification..." : "Modifier le mot de passe"}
                        </button>
                    </div>
                </form>

                <div className="flex flex-wrap items-center gap-3 border-t border-teal-200 pt-4 dark:border-teal-700">
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="btn border-teal-600 bg-white text-teal-700 hover:border-teal-500 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-100 dark:hover:bg-teal-800"
                    >
                        <FaTimes aria-hidden="true" />
                        Annuler
                    </button>
                </div>

            </div>
            {(error || success) && (
                <div className="toast toast-start z-50">
                    <div className={
                        error
                            ? "alert border-red-400 bg-red-50 text-red-700 shadow-lg dark:bg-red-950 dark:text-red-200"
                            : "alert border-teal-600 bg-teal-50 text-teal-700 shadow-lg dark:bg-teal-950 dark:text-teal-100"
                    }>
                        <span>{error || success}</span>
                    </div>
                </div>
            )}
        </section>
    )
}
