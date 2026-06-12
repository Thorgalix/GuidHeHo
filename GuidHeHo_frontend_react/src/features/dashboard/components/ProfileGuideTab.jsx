import { useState } from "react"
import ProfileGuideBookingsTab from "./ProfileGuideBookingsTab"
import { useGuideAvailabilitiesManager } from "../hooks/useGuideAvailabilitiesManager"
import AvailabilitySelector from "../../guides/become-guide/components/AvailabilitySelector"
import WeeklyEditor from "../../guides/become-guide/components/WeeklyEditor"
import DayEditor from "../../guides/become-guide/components/DayEditor"


export default function ProfileGuideTab({ guide }) {
    const [isEditing, setIsEditing] = useState(false)
    const isGuide = guide !== null
    const {
        message, submitting, submitSummary,
        availabilityMode, setAvailabilityMode,
        weekStartDate, setWeekStartDate,
        weekTemplate, updateWeekDay, addWeekInterval, updateWeekInterval, removeWeekInterval,
        singleDays, addSingleDay, removeSingleDay, updateSingleDay, addSingleDayInterval, updateSingleDayInterval, removeSingleDayInterval,
        handleSubmitAvailabilities
    } = useGuideAvailabilitiesManager()

    if (!isGuide) {
        return (
            <div>
                <h2>Guide Dashboard</h2>
                <p>You are not a guide yet. Please apply to become a guide to access this dashboard.</p>
            </div>
        )
    }


    return (
        <div>
            <h2>Guide Dashboard</h2>
            <h3>My Profile</h3>
            <div className="card border">



            </div>
            <div>
                <h3>Add Disponibilities</h3>
                <form onSubmit={handleSubmitAvailabilities}>
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
                        {submitting ? "Enregistrement..." : "Ajouter les disponibilités"}
                    </button>
                </form>
                {message && <p style={{ color: "red" }}>{message}</p>}
                {submitSummary && <p style={{ color: "green" }}>{submitSummary}</p>}
            </div>
            <div>
                <ProfileGuideBookingsTab />
            </div>
        </div>
    )
}
