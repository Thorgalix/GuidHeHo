export default function GuideProfileSummary({ guide, limitItems = false }) {

    if (!guide) return null

    const languages = guide.languages || []
    const themes = guide.themes || []

    const visibleLanguages = limitItems ? languages.slice(0, 3) : languages
    const hiddenLanguagesCount = limitItems ? languages.length - visibleLanguages.length : 0

    const visibleThemes = limitItems ? themes.slice(0, 3) : themes
    const hiddenThemesCount = limitItems ? themes.length - visibleThemes.length : 0

    return (
        <dl className="space-y-3 text-slate-700 dark:text-teal-100">
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
                                    className="badge badge-outline border-teal-600 text-slate-700 dark:text-teal-100"
                                >
                                    {language.name}
                                </span>
                            ))}

                            {hiddenLanguagesCount > 0 && (
                                <span className="badge border-teal-600 bg-teal-100 text-teal-700 dark:bg-teal-800 dark:text-teal-100">
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
                                    className="badge badge-outline border-teal-600 text-slate-700 dark:text-teal-100"
                                >
                                    {theme.name}
                                </span>
                            ))}

                            {hiddenThemesCount > 0 && (
                                <span className="badge border-teal-600 bg-teal-100 text-teal-700 dark:bg-teal-800 dark:text-teal-100">
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
