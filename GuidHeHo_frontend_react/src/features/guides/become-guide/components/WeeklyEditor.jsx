export default function WeeklyEditor({
    availabilityMode,
    weekStartDate,
    setWeekStartDate,
    weekTemplate,
    updateWeekDay,
    addWeekInterval,
    updateWeekInterval,
    removeWeekInterval,
}) {

    return (
        <div>
            {availabilityMode === "week" && (
                <div>
                    <p>Choisissez le lundi de référence, puis ajoutez des créneaux sur les jours utiles.</p>
                    <input
                        type="date"
                        value={weekStartDate}
                        onChange={(e) => setWeekStartDate(e.target.value)}
                    />

                    {weekTemplate.map((day, dayIndex) => (
                        <div key={day.label}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={day.enabled}
                                    onChange={(e) => updateWeekDay(dayIndex, "enabled", e.target.checked)}
                                />
                                {day.label}
                            </label>

                            {day.enabled && (
                                <div>
                                    {day.intervals.map((interval, intervalIndex) => (
                                        <div key={`${day.label}-${intervalIndex}`}>
                                            <input
                                                type="time"
                                                value={interval.start_time}
                                                onChange={(e) =>
                                                    updateWeekInterval(dayIndex, intervalIndex, "start_time", e.target.value)
                                                }
                                            />
                                            <input
                                                type="time"
                                                value={interval.end_time}
                                                onChange={(e) =>
                                                    updateWeekInterval(dayIndex, intervalIndex, "end_time", e.target.value)
                                                }
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeWeekInterval(dayIndex, intervalIndex)}
                                                disabled={day.intervals.length === 1}
                                            >
                                                Supprimer le créneau
                                            </button>
                                        </div>
                                    ))}

                                    <button type="button" onClick={() => addWeekInterval(dayIndex)}>
                                        Ajouter un créneau
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}



