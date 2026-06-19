import GuideProfileSummary from "./GuideProfileSummary"


export default function GuideHeader({ guide }) {
    if (!guide) return null

    const BACKEND_URL = "http://127.0.0.1:8000"

    const profilePictureUrl = guide?.user?.profile_picture
        ? guide.user.profile_picture.startsWith("http")
            ? guide.user.profile_picture
            : `${BACKEND_URL}${guide.user.profile_picture.startsWith("/") ? "" : "/"}${guide.user.profile_picture}`
        : null

    // Affichage
    return (
        <div>

            {profilePictureUrl && (
                <img src={profilePictureUrl} alt={`${guide.user.first_name} ${guide.user.last_name}`} className="h-30 w-30" />
            )}
            <h2>
                {guide.user.first_name} {guide.user.last_name}
            </h2>

            <p>Bio: {guide.bio}</p>
            <GuideProfileSummary guide={guide} />

        </div>
    )
}
