import { useState } from "react"
import ProfileTravelerEditForm from "./ProfileTravelerEditForm"
import ProfileTravelerBookingsTab from "./ProfileTravelerBookingsTab"
import ProfileTravelerReviewsTab from "./ProfileTravelerReviewsTab"
import { useTravelerProfile } from "../hooks/useTravelerProfile"


export default function ProfileTravelerTab({ user }) {
    const [isEditing, setIsEditing] = useState(false)
    const {
        traveler,
        loading,
        error,
        updateTravelerProfile,
    } = useTravelerProfile(user)

    const BACKEND_URL = "http://127.0.0.1:8000"

    const profilePictureUrl = traveler?.profile_picture
        ? traveler.profile_picture.startsWith("http")
            ? traveler.profile_picture
            : `${BACKEND_URL}${traveler.profile_picture.startsWith("/") ? "" : "/"}${traveler.profile_picture}`
        : null

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
                {profilePictureUrl && (
                    <img src={profilePictureUrl} alt="Profile" className="h-40 w-40 rounded-xl object-cover" />
                )}
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
            <ProfileTravelerReviewsTab user={traveler} />
        </div>
    )
}