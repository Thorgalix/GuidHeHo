export default function DayEditor({
    availabilityMode,
    singleDays,
    addSingleDay,
    removeSingleDay,
    updateSingleDay,
    addSingleDayInterval,
    updateSingleDayInterval,
    removeSingleDayInterval,
}) {


    return (
        <div>
            {availabilityMode === "day" && (
                <div>
                    <p>Ajoute une ou plusieurs journées, chacune avec plusieurs créneaux.</p>

                    {singleDays.map((day, dayIndex) => (
                        <div key={dayIndex}>
                            <input
                                type="date"
                                value={day.date}
                                onChange={(e) => updateSingleDay(dayIndex, "date", e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => removeSingleDay(dayIndex)}
                                disabled={singleDays.length === 1}
                            >
                                Supprimer la journée
                            </button>

                            {day.intervals.map((interval, intervalIndex) => (
                                <div key={`${dayIndex}-${intervalIndex}`}>
                                    <input
                                        type="time"
                                        value={interval.start_time}
                                        onChange={(e) =>
                                            updateSingleDayInterval(dayIndex, intervalIndex, "start_time", e.target.value)
                                        }
                                    />
                                    <input
                                        type="time"
                                        value={interval.end_time}
                                        onChange={(e) =>
                                            updateSingleDayInterval(dayIndex, intervalIndex, "end_time", e.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSingleDayInterval(dayIndex, intervalIndex)}
                                        disabled={day.intervals.length === 1}
                                    >
                                        Supprimer le créneau
                                    </button>
                                </div>
                            ))}

                            <button type="button" onClick={() => addSingleDayInterval(dayIndex)}>
                                Ajouter un créneau
                            </button>
                        </div>
                    ))}

                    <button type="button" onClick={addSingleDay}>
                        Ajouter une journée
                    </button>
                </div>
            )}
        </div>
    )
}

