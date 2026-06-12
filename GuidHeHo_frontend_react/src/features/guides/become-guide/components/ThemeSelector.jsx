export default function ThemeSelector({
    themes,
    selectedThemes,
    setSelectedThemes,
    toggle,
}) {

    return (
        <div>
            <h4>Themes</h4>
            {(themes ?? []).map((t) => (
                <label key={t.id}>
                    <input
                        type="checkbox"
                        checked={selectedThemes.includes(Number(t.id))}
                        onChange={() => toggle(setSelectedThemes, t.id)}
                    />
                    {t.name}
                </label>
            ))}
        </div>
    )
}