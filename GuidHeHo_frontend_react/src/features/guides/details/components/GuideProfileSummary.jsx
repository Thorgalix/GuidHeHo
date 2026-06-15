export default function GuideProfileSummary({ guide }) {
    if (!guide) return null

    return (
        <dl className="space-y-1 text-slate-700 dark:text-teal-100">
            <div>
                <dt className="font-semibold inline">City : </dt>
                <dd className="inline">{guide.city}</dd>
            </div>
            


            <div>
                <dt className="font-semibold inline">Languages : </dt>
                <dd className="inline">{guide.languages?.map((lang) => lang.name).join(", ") || "No languages"}</dd>
            </div>

            <div>
                <dt className="font-semibold inline">Themes : </dt>
                <dd className="inline">{guide.themes?.map((theme) => theme.name).join(", ") || "No themes"}</dd>
            </div>
            
            <div>
                <dt className="font-semibold inline">Price : </dt>
                <dd className="inline">{guide.price_per_hour}€/hour</dd>
            </div>
        </dl>
    )
}