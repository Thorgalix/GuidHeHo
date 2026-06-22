import { useBecomeGuide } from "../../features/guides/become-guide/hooks/useBecomeGuide"
import GuideProfileFields from "../../features/guides/become-guide/components/GuideProfileFields"
import ThemeSelector from "../../features/guides/become-guide/components/ThemeSelector"
import LanguageSelector from "../../features/guides/become-guide/components/LanguageSelector"
import AvailabilitySelector from "../../features/guides/become-guide/components/AvailabilitySelector"
import WeeklyEditor from "../../features/guides/become-guide/components/WeeklyEditor"
import DayEditor from "../../features/guides/become-guide/components/DayEditor"
import CapacitySelector from "../../features/guides/become-guide/components/CapacitySelector"

export default function BecomeGuidePage() {
    
    // States

    const {
        isAuthenticated,
        bio, setBio,
        city, setCity,
        price, setPrice,
        themes,
        languages,
        maxPeople, setMaxPeople,
        selectedThemes, setSelectedThemes,
        selectedLanguages, setSelectedLanguages,
        message,
        availabilityMode,
        setAvailabilityMode,
        weekStartDate, setWeekStartDate,
        weekTemplate,
        updateWeekDay, addWeekInterval, updateWeekInterval, removeWeekInterval,
        singleDays,
        addSingleDay, removeSingleDay, updateSingleDay,
        addSingleDayInterval, updateSingleDayInterval, removeSingleDayInterval,
        submitting,
        submitSummary,
        toggle,
        handleSubmit
    } = useBecomeGuide()
    
    if (!isAuthenticated) {
        return <p>Tu dois être connecté pour devenir guide.</p>
    }

    // Affichage

    return (
        <main>
            <h2>Become a Guide</h2>

            <form onSubmit={handleSubmit}>
                <GuideProfileFields
                    bio={bio}
                    setBio={setBio}
                    city={city}
                    setCity={setCity}
                    price={price}
                    setPrice={setPrice}
                />

                <CapacitySelector
                    maxPeople={maxPeople}
                    setMaxPeople={setMaxPeople}
                />

                <ThemeSelector
                    themes={themes}
                    selectedThemes={selectedThemes}
                    setSelectedThemes={setSelectedThemes}
                    toggle={toggle}
                />

                <LanguageSelector
                    languages={languages}
                    selectedLanguages={selectedLanguages}
                    setSelectedLanguages={setSelectedLanguages}
                    toggle={toggle}
                />

                <AvailabilitySelector
                    availabilityMode={availabilityMode}
                    setAvailabilityMode={setAvailabilityMode}
                />

                <WeeklyEditor
                    availabilityMode={availabilityMode}
                    weekStartDate={weekStartDate}
                    setWeekStartDate={setWeekStartDate}
                    weekTemplate={weekTemplate}
                    updateWeekDay={updateWeekDay}
                    addWeekInterval={addWeekInterval}
                    updateWeekInterval={updateWeekInterval}
                    removeWeekInterval={removeWeekInterval}
                />

                <DayEditor
                    availabilityMode={availabilityMode}
                    singleDays={singleDays}
                    addSingleDay={addSingleDay}
                    removeSingleDay={removeSingleDay}
                    updateSingleDay={updateSingleDay}
                    addSingleDayInterval={addSingleDayInterval}
                    updateSingleDayInterval={updateSingleDayInterval}
                    removeSingleDayInterval={removeSingleDayInterval}
                />


                <button type="submit" disabled={submitting}>
                    {submitting ? "Création..." : "Become Guide"}
                </button>
            </form>

            {message && <p>{message}</p>}
            {submitSummary && <p>{submitSummary}</p>}
        </main>
    )
}
