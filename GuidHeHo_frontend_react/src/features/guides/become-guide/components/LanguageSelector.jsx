
export default function LanguageSelector({
    languages,
    selectedLanguages,
    setSelectedLanguages,
    toggle,
}) {

    return (
        <fieldset className="form-control md:col-span-2">
            <legend className="mb-2 font-semibold text-slate-900 dark:text-white">
                Langues :
            </legend>


            <div className="flex flex-wrap gap-3">
                {(languages ?? []).map((language) => {
                    const languageId = Number(language.id);
                    return (
                        <label key={language.id} className="cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedLanguages.includes(languageId)}
                                onChange={() => toggle(setSelectedLanguages, languageId)}
                                className="peer sr-only"
                            />

                            <span className="
                                inline-flex items-center rounded-full border border-teal-600
                                bg-white px-4 py-2 text-sm font-medium text-teal-700
                                shadow-sm transition hover:bg-teal-100
                                peer-checked:bg-teal-600
                                peer-checked:text-white
                                peer-checked:hover:bg-teal-700
                                peer-checked:shadow-md
                                peer-focus-visible:ring-2
                                peer-focus-visible:ring-teal-600
                                peer-focus-visible:ring-offset-2
                                dark:peer-focus-visible:ring-offset-teal-950
                                dark:bg-teal-950
                                dark:text-teal-100
                                dark:hover:bg-teal-900
                                dark:peer-checked:hover:bg-teal-600
                                dark:peer-checked:bg-teal-500
                                dark:peer-checked:text-white
                                dark:peer-focus-visible:ring-teal-600
                            "
                            >
                                {language.name}
                            </span>
                        </label>
                    )
                })}
            </div>
        </fieldset>
    )
}
