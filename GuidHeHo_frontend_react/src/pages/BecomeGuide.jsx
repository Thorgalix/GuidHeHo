import { useBecomeGuide } from "../hooks/useBecomeGuide"

export default function BecomeGuide() {
    
    // States

    const {
        isAuthenticated,
        bio, setBio,
        city, setCity,
        price, setPrice,
        themes,
        languages,
        selectedThemes, setSelectedThemes,
        selectedLanguages, setSelectedLanguages,
        message,
        submitting,
        submitSummary,
        slots, addSlot, removeSlot, updateSlot,
        toggle,
        handleSubmit
    } = useBecomeGuide()
    
    if (!isAuthenticated) {
        return <p>Tu dois être connecté pour devenir guide.</p>
    }

    // Affichage

    return (
        <div>
            <h2>Become a Guide</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />

                <input
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Price per hour"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

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

                <h4>Languages</h4>
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

                <h4>Disponibilités</h4>

                {slots.map((slot, index) => (
                    <div key={index}>
                        <input
                            type="datetime-local"
                            value={slot.start_datetime}
                            onChange={(e) => updateSlot(index, "start_datetime", e.target.value)}
                        />
                        <input
                            type="datetime-local"
                            value={slot.end_datetime}
                            onChange={(e) => updateSlot(index, "end_datetime", e.target.value)}
                        />
                        <button type="button" onClick={() => removeSlot(index)}>
                            Remove
                        </button>
                    </div>
                ))}
                
                <button type="button" onClick={addSlot}>
                    Add Slot
                </button>

                <button type="submit" disabled={submitting}>
                    {submitting ? "Création..." : "Become Guide"}
                </button>
            </form>

            {message && <p>{message}</p>}
            {submitSummary && <p>{submitSummary}</p>}
        </div>
    )
}