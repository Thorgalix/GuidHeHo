import { useState } from "react"
import ProfileTravelerEditForm from "./ProfileTravelerEditForm"
import ProfileTravelerBookingsTab from "./ProfileTravelerBookingsTab"
import { useTravelerProfile } from "../hooks/useTravelerProfile"


export default function ProfileTravelerTab({ user }) {
    const [isEditing, setIsEditing] = useState(false)
    const {
        traveler,
        loading,
        error,
        updateTravelerProfile,
    } = useTravelerProfile(user)

    if (!user) {
        return <p>Please login to access your traveler dashboard.</p>
    }

    if (loading) {
        return <p>Loading traveler profile...</p>
    }

    if (!traveler) {
        return <p>{error || "Unable to load traveler profile for now."}</p>
    }

    return (
        <div>
            <h2>Traveler Dashboard</h2>
            <h3>My profile</h3>
            <div className="card border">
                <p>First Name: {traveler.first_name}</p>
                <p>Last Name: {traveler.last_name}</p>
                <p>Role: {traveler.role}</p>
                <p>Email: {traveler.email}</p>

                <button type="button" onClick={() => setIsEditing((prev) => !prev)}>
                    {isEditing ? "Close profile editor" : "Edit profile"}
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
        </div>
    )
}