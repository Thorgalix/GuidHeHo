import { useState, useContext } from "react"
import { AuthContext } from "../../../context/AuthContext"
import { api } from "../../../services/api"

export default function ProfileTravelerEditForm({ user, setIsEditing }) {
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
                setError("No changes detected.")
                setLoading(false)
                return
            }



            const updatedUser = await api.patch("/users/me/", data)

            updateUser({...user, ...updatedUser})
            setSuccess("Profile updated successfully!")
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
            setError("Please fill in all password fields.")
            setLoading(false)
            return
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.")
            setLoading(false)
            return
        }

        if (newPassword === oldPassword) {
            setError("New password must be different from old password.")
            setLoading(false)
            return
        }

        try {
            await api.post("/users/change-password/", {
                old_password: oldPassword,
                new_password: newPassword,
                new_password2: confirmPassword,
            })
            setSuccess("Password changed successfully!")
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
                <h3>Edit Profile</h3>
                <div>
                    <label htmlFor="first_name">First Name: </label>
                    <input type="text" id="first_name" name="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />

                    <label htmlFor="last_name">Last Name: </label>
                    <input type="text" id="last_name" name="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} />

                    <label htmlFor="email">Email: </label>
                    <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                    <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Profile"}</button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {success && <p style={{ color: "green" }}>{success}</p>}
                </div>


                <div>
                    <label htmlFor="oldpassword">Old Password: </label>
                    <input
                        type="password"
                        id="oldpassword"
                        name="oldpassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                    <label htmlFor="new_password">New Password: </label>
                    <input
                        type="password"
                        id="new_password"
                        name="new_password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <label htmlFor="new_password2">Confirm New Password: </label>
                    <input
                        type="password"
                        id="new_password2"
                        name="new_password2"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button type="button" onClick={handleChangePassword} disabled={loading}>
                        {loading ? "Changing..." : "Change Password"}
                    </button>
                </div>

                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
        </div>
    )
}