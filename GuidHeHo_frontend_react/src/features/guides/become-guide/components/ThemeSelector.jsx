export default function ThemeSelector({
    themes,
    selectedThemes,
    setSelectedThemes,
    toggle,
}) {

    return (
        <fieldset className="form-control md:col-span-2">
            <legend className="mb-2 font-semibold text-slate-900 dark:text-white">
                Thèmes :
            </legend>


            <div className="flex flex-wrap gap-3">
                {(themes ?? []).map((theme) => {
                    const themeId = Number(theme.id);
                    return (
                        <label key={theme.id} className="cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedThemes.includes(themeId)}
                                onChange={() => toggle(setSelectedThemes, themeId)}
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
                                {theme.name}
                            </span>
                        </label>
                    )
                })}
            </div>
        </fieldset>
    )
}
