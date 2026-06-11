import { useState } from "react"
import ProfileTravelerEditForm from "./ProfileTravelerEditForm"
import TravelerBookingsTab from "./TravelerBookingsTab"


export default function ProfileTravelerTab({ user }) {
    const [isEditing, setIsEditing] = useState(false)

    if (!user) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <h2>Traveler Dashboard</h2>
            <h3>My profile</h3>

            <p>First Name: {user.first_name}</p>
            <p>Last Name: {user.last_name}</p>
            <p>Role: {user.role}</p>
            <p>Email: {user.email}</p>

            <button type="button" onClick={() => setIsEditing((prev) => !prev)}>
                {isEditing ? "Close profile editor" : "Edit profile"}
            </button>

            {isEditing && <ProfileTravelerEditForm user={user} setIsEditing={setIsEditing} />}

            <TravelerBookingsTab />
        </div>
    )
}