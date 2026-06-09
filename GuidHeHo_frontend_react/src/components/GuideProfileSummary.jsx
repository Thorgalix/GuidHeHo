export default function GuideProfileSummary({ guide }) {
    if (!guide) return null

    return (
        <>
            <p>{guide.city}</p>
            <p>{guide.price_per_hour}€/hour</p>
            <p>{guide.bio}</p>

            <p>
                {guide.languages?.map((lang) => lang.name).join(", ") || "No languages"}
            </p>

            <p>
                {guide.themes?.map((theme) => theme.name).join(", ") || "No themes"}
            </p>
        </>
    )
}