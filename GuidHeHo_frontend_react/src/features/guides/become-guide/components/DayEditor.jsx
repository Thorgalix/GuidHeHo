import { FaPlus, FaTrash } from "react-icons/fa"

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
                <div className="space-y-4">
                    {singleDays.map((day, dayIndex) => (
                        <div
                            key={dayIndex}
                            className="space-y-4 rounded-lg border border-teal-200 bg-white/70 p-4 dark:border-teal-700 dark:bg-teal-950/40"
                        >
                            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                                <label className="form-control">
                                    <div className="label">
                                        <span className="label-text font-semibold text-slate-900 dark:text-white">
                                            Journée {dayIndex + 1}
                                        </span>
                                    </div>
                                    <input
                                        type="date"
                                        value={day.date}
                                        onChange={(e) => updateSingleDay(dayIndex, "date", e.target.value)}
                                        required
                                        className="input input-bordered w-full border-teal-600 bg-white text-slate-900 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={() => removeSingleDay(dayIndex)}
                                    disabled={singleDays.length === 1}
                                    className="btn border-none bg-red-600 text-white hover:bg-red-700 disabled:bg-slate-300 disabled:text-slate-500"
                                >
                                    <FaTrash aria-hidden="true" />
                                    Supprimer la journée
                                </button>
                            </div>

                            {day.intervals.map((interval, intervalIndex) => (
                                <div
                                    key={`${dayIndex}-${intervalIndex}`}
                                    className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end"
                                >
                                    <label className="form-control">
                                        <div className="label py-1">
                                            <span className="label-text text-xs font-semibold text-slate-700 dark:text-teal-50">
                                                Début
                                            </span>
                                        </div>
                                        <input
                                            type="time"
                                            value={interval.start_time}
                                            onChange={(e) =>
                                                updateSingleDayInterval(dayIndex, intervalIndex, "start_time", e.target.value)
                                            }
                                            required
                                            className="input input-bordered w-full border-teal-600 bg-white text-slate-900 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                                        />
                                    </label>

                                    <label className="form-control">
                                        <div className="label py-1">
                                            <span className="label-text text-xs font-semibold text-slate-700 dark:text-teal-50">
                                                Fin
                                            </span>
                                        </div>
                                        <input
                                            type="time"
                                            value={interval.end_time}
                                            onChange={(e) =>
                                                updateSingleDayInterval(dayIndex, intervalIndex, "end_time", e.target.value)
                                            }
                                            required
                                            className="input input-bordered w-full border-teal-600 bg-white text-slate-900 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                                        />
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => removeSingleDayInterval(dayIndex, intervalIndex)}
                                        disabled={day.intervals.length === 1}
                                        className="btn border-none bg-red-600 text-white hover:bg-red-700 disabled:bg-slate-300 disabled:text-slate-500"
                                    >
                                        <FaTrash aria-hidden="true" />
                                        Supprimer
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => addSingleDayInterval(dayIndex)}
                                className="btn border-none bg-teal-500 text-white hover:bg-teal-600"
                            >
                                <FaPlus aria-hidden="true" />
                                Ajouter un créneau
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addSingleDay}
                        className="btn border-none bg-teal-500 text-white hover:bg-teal-600"
                    >
                        <FaPlus aria-hidden="true" />
                        Ajouter une journée
                    </button>
                </div>
            )}
        </div>
    )
}
