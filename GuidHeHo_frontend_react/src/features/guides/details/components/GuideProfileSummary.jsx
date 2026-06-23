export default function GuideProfileSummary({ guide }) {

    if (!guide) return null

    const visibleLanguages = guide.languages?.slice(0, 3) || []
    const hiddenLanguagesCount = (guide.languages?.length || 0) - visibleLanguages.length

    const visibleThemes = guide.themes?.slice(0, 3) || []
    const hiddenThemesCount = (guide.themes?.length || 0) - visibleThemes.length

    return (
        <dl className="space-y-1 text-slate-700 dark:text-teal-100">
            <div>
                <dt className="font-semibold inline">Ville : </dt>
                <dd className="inline">{guide.city}</dd>
            </div>

            <div>
                <dt className="font-semibold block mb-1">Langues : </dt>

                <dd className="flex flex-wrap gap-1">
                    {visibleLanguages.length > 0 ? (
                        <>
                            {visibleLanguages.map((language) => (
                                <span
                                    key={language.id}
                                    className="badge badge-outline border-teal-600"
                                >
                                    {language.name}
                                </span>
                            ))}

                            {hiddenLanguagesCount > 0 && (
                                <span className="badge bg-teal-100 dark:bg-teal-800 border-teal-600">
                                    +{hiddenLanguagesCount}
                                </span>
                            )}
                        </>
                    ) : (
                        <span>Aucune langue</span>
                    )}
                </dd>
            </div>

            <div>
                <dt className="font-semibold block mb-1">Thèmes :</dt>

                <dd className="flex flex-wrap gap-1">
                    {visibleThemes.length > 0 ? (
                        <>
                            {visibleThemes.map((theme) => (
                                <span
                                    key={theme.id}
                                    className="badge badge-outline border-teal-600"
                                >
                                    {theme.name}
                                </span>
                            ))}

                            {hiddenThemesCount > 0 && (
                                <span className="badge bg-teal-100 dark:bg-teal-800 border-teal-600">
                                    +{hiddenThemesCount}
                                </span>
                            )}
                        </>
                    ) : (
                        <span>Aucun thème</span>
                    )}
                </dd>
            </div>

            <div>
                <dt className="font-semibold inline">Prix : </dt>
                <dd className="inline">{guide.price_per_hour}€/heure</dd>
            </div>
        </dl>
    )
}