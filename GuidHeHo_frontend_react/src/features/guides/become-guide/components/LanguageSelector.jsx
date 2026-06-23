
export default function LanguageSelector({
    languages,
    selectedLanguages,
    setSelectedLanguages,
    toggle,
}) {

    return (
        <div>
            <h4>Langues</h4>
            {(languages ?? []).map((l) => (
                <label key={l.id}>
                    <input
                        type="checkbox"
                        checked={selectedLanguages.includes(Number(l.id))}
                        onChange={() => toggle(setSelectedLanguages, l.id)}
                    />
                    {l.name}
                </label>
            ))}
        </div>
    )
}
