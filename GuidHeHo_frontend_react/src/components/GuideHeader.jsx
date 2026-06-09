import GuideProfileSummary from "./GuideProfileSummary"

export default function GuideHeader({ guide }) {
    if (!guide) return null

    // Affichage
    return (
        <div>
            <h2>
                {guide.user.first_name} {guide.user.last_name}
            </h2>

            <GuideProfileSummary guide={guide} />
            
        </div>
    )
}
