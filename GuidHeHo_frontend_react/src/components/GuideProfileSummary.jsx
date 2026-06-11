export default function GuideProfileSummary({ guide }) {
    if (!guide) return null

    return (
        <>
            <p>City : {guide.city}</p>

            <p>
                Languages : {guide.languages?.map((lang) => lang.name).join(", ") || "No languages"}
            </p>

            <p>
                Themes : {guide.themes?.map((theme) => theme.name).join(", ") || "No themes"}
            </p>
            
            <p>Price : {guide.price_per_hour}€/hour</p>
        </>
    )
}